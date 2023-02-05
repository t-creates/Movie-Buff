import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import genreIcons from '../../assets/genres';
import useStyles from './styles';
import { useGetMovieQuery, useGetMovieCastQuery, useGetRecomendationsQuery, useGetListQuery } from '../../services/api';
import { selectGenreOrCategory } from '../../features/currentGenreOrCatagory';
import { MovieList } from '..';
import { userSelector } from '../../features/auth';

const MovieInformation = () => {
  // Gets the user information from the redux store
  const user = useSelector(userSelector);
  // Gets the movie id from the url -- reminder useParams must be at the top of the component
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Gets the movie information from the api
  const { data, isFetching, error } = useGetMovieQuery(id);
  // Gets the movie cast from the api
  const { data: castData } = useGetMovieCastQuery(id);
  // Gets the movie recomendations from the api
  const { data: recommendations } = useGetRecomendationsQuery({ movie_id: id, list: '/recommendations' });
  // Get List of User Selected Movies
  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMBD_API_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });

    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMBD_API_KEY}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    });

    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">

        <Link to="/">Something has gone wrong - Go back.</Link>

      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px' }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      {/* Title & Tagline */}
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>

          {/* Rating, Runtime, & Language */}
          <Box display="flex" align="center">
            <Rating value={data?.vote_average / 2} readOnly />
            <Typography variatn="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom align="center">
            {data?.runtime}min | Language: {data?.spoken_languages[0].name}
          </Typography>
        </Grid>
        {/* Genres */}
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              key={genre.name}
              to="/"
              className={classes.links}
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography variant="subtitle1" color="textPrimary">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        {/* Overview */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        {/* Cast */}
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {castData && castData.cast.map((character) => (
            character.profile_path && (
              <Grid
                item
                key={character.id}
                style={{ textDecoration: 'none' }}
                xs={4}
                md={2}
                component={Link}
                to={`/actors/${character.id}`}
              >
                <img
                  className={classes.castImage}
                  src={`https://image.tmdb.org/t/p/w500${character.profile_path}`}
                  alt={character.name}
                />
                <Typography color="textPrimary">
                  {character?.name}
                </Typography>
                <Typography color="textSecondary">
                  {character?.character}
                </Typography>
              </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        {/* Buttons Groups */}
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >Website
                </Button>
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data.imdb_id}`}
                  endIcon={<MovieIcon />}
                >IMDB
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  href="#"
                  endIcon={<Theaters />}
                >Trailer
                </Button>
              </ButtonGroup>
              <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                <ButtonGroup size="medium" variant="outlined">
                  <Button
                    onClick={addToFavorites}
                    endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
                  >{isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button
                    onClick={addToWatchlist}
                    endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                  >Watchlist
                  </Button>
                  <Button endIcon={<ArrowBack />}>
                    <Typography style={{ textDecoration: 'none' }} component={Link} to="/" color="inherit" variant="subtitle2">
                      Back
                    </Typography>
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {/* Movies You May Like */}
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" align="center" gutterBottom>
          You May Also Like
        </Typography>
        {recommendations
          ? <MovieList movies={recommendations} numberOfMovies={12} />
          : <Box>Sorry Nothing Was Found</Box>}
      </Box>
      {/* Trailer */}
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            className={classes.video}
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
            title="Trailer"
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
