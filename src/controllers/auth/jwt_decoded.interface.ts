export interface IJwtDecoded {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}