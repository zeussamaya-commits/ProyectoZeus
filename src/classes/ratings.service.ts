import { SERVER } from "../constants.ts";
import { Http } from "./http.ts";
import { type RatingInsert } from "../interfaces/rating.ts";
import { type SingleRatingResponse } from "../interfaces/responses.ts";

export class RatingsService {
  #http = new Http();

  async post(rating: RatingInsert): Promise<void> {
    await this.#http.post<SingleRatingResponse, RatingInsert>(
      `${SERVER}/ratings`,
      rating
    );
  }
}
