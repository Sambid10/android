import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export type ResponseType = {
    genres: {
        id: number,
        name: string
    }[]
}
export type Movie = {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}
type MoviesResponse = {
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
}
export type MovieDetails = {
  adult: boolean
  backdrop_path: string
  genre_ids?: number[]  // only in list responses
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  // detail-only fields
  belongs_to_collection: {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
  } | null
  budget: number
  genres: { id: number; name: string }[]
  homepage: string
  imdb_id: string
  origin_country: string[]
  production_companies: {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }[]
  production_countries: {
    iso_3166_1: string
    name: string
  }[]
  revenue: number
  runtime: number
  spoken_languages: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status: string
  tagline: string
}
export const movieApi = createApi({
    reducerPath: "movieapi",
    baseQuery: fetchBaseQuery(
        {
            baseUrl: "https://api.themoviedb.org/3",
            prepareHeaders: (headers) => {
                headers.set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDQ4Njc2MjhiMjEzYTNjNTI5MGZlZWRlZTY5N2UwOSIsIm5iZiI6MTc1MTAxMDExOC42MTY5OTk5LCJzdWIiOiI2ODVlNGI0NmYzNzU2MGMwZjc4MDU4YTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.AZiFqOvnOhM20RFrzXCYx3ZRVubpiz8jepimaFHD0xY"
                );
                headers.set("accept", "application/json");
                return headers;
            }
        }),
    endpoints: (build) => ({
        getMovieCategories: build.query<ResponseType, void>({
            query: () => "/genre/movie/list?language=en",
        }),
        getTrendingMovie: build.query<MoviesResponse, void>({
            query: () => "/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
        }),
        getMovieByGenre: build.query<MoviesResponse, number>({
            query: (genreId) => `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`
        }),
        getSearchedMovie: build.query<MoviesResponse, string>({
            query: (movie) => `/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`
        }),
        getMovieDetails:build.query<MovieDetails,number>({
            query:(id)=>`/movie/${id}?language=en-US`
        })
    })
})

export const 
{ useGetMovieCategoriesQuery, useGetTrendingMovieQuery, useLazyGetTrendingMovieQuery, useLazyGetMovieByGenreQuery, useGetMovieByGenreQuery, useGetSearchedMovieQuery ,useGetMovieDetailsQuery} = movieApi