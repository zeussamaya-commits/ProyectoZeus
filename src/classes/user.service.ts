import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import {
  type User,
  type UserProfileEdit,
  type UserPhotoEdit,
  type UserPasswordEdit,
} from "../interfaces/user.ts";
import {
  type UserResponse,
  type PhotoResponse,
} from "../interfaces/responses.ts";

export class UserService {
  #http = new Http();

  async getProfile(id?: number): Promise<User> {
    const url = id ? `${SERVER}/users/${id}` : `${SERVER}/users/me`;
    const resp = await this.#http.get<UserResponse>(url);
    return resp.user;
  }

  async saveProfile(name: string, email: string): Promise<void> {
    await this.#http.put<void, UserProfileEdit>(`${SERVER}/users/me`, {
      name,
      email,
    });
  }

  async savePhoto(photo: string): Promise<string> {
    const resp = await this.#http.put<PhotoResponse, UserPhotoEdit>(
      `${SERVER}/users/me/photo`,
      { photo }
    );
    return resp.photo;
  }

  async savePassword(password: string): Promise<void> {
    await this.#http.put<void, UserPasswordEdit>(
      `${SERVER}/users/me/password`,
      {
        password,
      }
    );
  }
}
