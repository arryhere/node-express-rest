export default class Exception extends Error {
  constructor(
    message: string,
    private readonly status_code: number,
    private readonly data: object
  ) {
    super(message);
  }
}
