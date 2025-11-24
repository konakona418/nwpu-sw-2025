export abstract class CommonUtil {
  static async tokenIssuedAtIsValid(
    tokenIat: number,
    validDurationInSeconds: number
  ): Promise<boolean> {
    const currentTs = Math.floor(Date.now() / 1000);
    return currentTs - tokenIat <= validDurationInSeconds;
  }

  static secondsOfDays(days: number): number {
    return days * 24 * 60 * 60;
  }
}
