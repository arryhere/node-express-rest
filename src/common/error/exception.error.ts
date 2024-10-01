export default class Exception extends Error {
  constructor(
    public message: string,
    public status_code: number,
    public data: object
  ) {
    super(message);
    this.status_code = status_code;
    this.message = message;
    this.data = data;
  }
}
