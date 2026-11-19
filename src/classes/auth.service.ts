import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type LoginData } from "../interfaces/user.ts";
import { type RegisterData } from "../interfaces/user.ts";
import { type TokenResponse } from "../interfaces/responses.ts";

export class AuthService {
  #http = new Http();

  async login(userLogin: LoginData): Promise<void> {
    const resp = await this.#http.post<TokenResponse, LoginData>(
      `${SERVER}/auth/login`,
      userLogin
    );
    localStorage.setItem("token", resp.accessToken);
  }

  async register(userInfo: RegisterData): Promise<void> {
    await this.#http.post<void, RegisterData>(
      `${SERVER}/auth/register`,
      userInfo
    );
  }
  async checkToken(): Promise<void> {
    await this.#http.get<void>(`${SERVER}/auth/validate`);
  }
  logout(): void {
    localStorage.removeItem("token");
  }
}
