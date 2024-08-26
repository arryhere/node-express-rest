export default class Exception extends Error {
  status_code: number;
  message: string;
  data: object;

  constructor(message: string, code: number, data: object) {
    super(message);
    this.status_code = code;
    this.message = message;
    this.data = data;
  }
}
