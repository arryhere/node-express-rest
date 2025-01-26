export class Exception extends Error {
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

  public type = 'app';
}

export function handle_exception(error: unknown, message: string, status_code: number, data: object) {
  console.log('\n[Error]:', error, '\n');

  if (error instanceof Exception && error.type) {
    throw new Exception(error.message, error.status_code, error.data);
  }

  throw new Exception(message, status_code, data);
}
