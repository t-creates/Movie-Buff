import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '../services/api';

import genreOrCategoryReducer from '../features/currentGenreOrCatagory';
import userReducer from '../features/auth';

export default configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    currentGenreOrCatagory: genreOrCategoryReducer,
    user: userReducer,
  },
});
