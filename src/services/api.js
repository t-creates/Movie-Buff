import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
const apiKey = process.env.REACT_APP_TMBD_API_KEY;

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3/' }),
  endpoints: (builder) => ({
    // Get Genres
    getGenres: builder.query({
      query: () => `genre/movie/list?api_key=${apiKey}`,
    }),
    // Get Movies by [type]
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        // Get Movies By Search
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${apiKey}`;
        }

        // Get Movies By Category
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string') {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${apiKey}`;
        }

        // Get Movies By Genre
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number') {
          return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${apiKey}`;
        }

        // Get Popular Movies
        return `movie/popular?page=${page}&api_key=${apiKey}`;
      },
    }),

    // Get Movie Details
    getMovie: builder.query({
      query: (id) => `movie/${id}?append_to_response=videos,credits&api_key=${apiKey}`,
    }),

    // Get Movie Cast
    getMovieCast: builder.query({
      query: (id) => `movie/${id}/credits?api_key=${apiKey}`,
    }),

    // Get User Specific Lists
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => `/account/${accountId}/${listName}?api_key=${apiKey}&session_id=${sessionId}&page=${page}`,
    }),

    // Get User Specific Lists
    getRecomendations: builder.query({
      query: ({ movie_id, list }) => `movie/${movie_id}/${list}?api_key=${apiKey}`,
    }),

    // Get Actor Details
    getActor: builder.query({
      query: ({ person_id }) => `https://api.themoviedb.org/3/person/${person_id}?api_key=${apiKey}&language=en-US`,
    }),

    // Get Actor Movies
    getMoviesByActorId: builder.query({
      query: ({ id, page }) => `/discover/movie?with_cast=${id}&page=${page}&api_key=${apiKey}`,
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetGenresQuery,
  useGetMovieQuery,
  useGetMovieCastQuery,
  useGetRecomendationsQuery,
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;
