import { User } from "./user";

export interface LoginResponse {
  token: string;
  user: User;
  success: string;
  message: string;
}