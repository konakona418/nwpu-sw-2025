import jwt from 'jsonwebtoken';
import { okAsync, errAsync } from 'neverthrow';

export abstract class AuthUtil {
  static async generateToken(
    userId: number,
    email: string,
    role: 'ADMIN' | 'USER'
  ): Promise<{ token: string; refreshToken: string }> {
    const ts = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      { userId: userId, email: email, iat: ts, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
      { userId: userId, email: email, iat: ts },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, refreshToken };
  }

  static async decodeToken<T>(
    authorization: string | undefined,
    prefix: string = 'Bearer '
  ) {
    if (!authorization) {
      return errAsync();
    }

    let truncated = authorization.startsWith(prefix)
      ? authorization.slice(prefix.length)
      : authorization;
    truncated = truncated.trim();
    try {
      return okAsync(jwt.verify(truncated, process.env.JWT_SECRET) as T);
    } catch (_err) {
      return errAsync();
    }
  }
}
