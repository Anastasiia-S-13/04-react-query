import type { Movie } from "../types/movie";
import axios from "axios";

export interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(query: string, page: number): Promise<MovieHttpResponse> {
  const response = await axios.get<MovieHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
}