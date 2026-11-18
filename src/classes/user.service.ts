import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type User } from "../interfaces/user.ts";
import { type UserResponse } from "../interfaces/responses.ts";

export class UserService {
  #http = new Http();

  async getProfile(id?: number): Promise<User> {
    const url = id ? `${SERVER}/users/${id}` : `${SERVER}/users/me`;
    const resp = await this.#http.get<UserResponse>(url);
    return resp.user;
  }
}
