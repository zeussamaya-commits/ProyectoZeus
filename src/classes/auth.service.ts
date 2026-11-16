import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type LoginData } from "../interfaces/user.ts";
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
}
