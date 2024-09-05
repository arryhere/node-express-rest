export default class Exception extends Error {
  status_code: number;
  message: string;
  data: object;

  constructor(message: string, status_code: number, data: object) {
    super(message);
    this.status_code = status_code;
    this.message = message;
    this.data = data;
  }
}
