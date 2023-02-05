import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, Button, Grid, Box, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/api';
import useStyles from './styles';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const classes = useStyles();

  const { data: movies } = useGetMoviesByActorIdQuery({ id, page });
  const { data: actor, isFetching, error } = useGetActorQuery({ person_id: id });

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
        <Button startIcon={<ArrowBack />} onClick={() => history.goBack()} color="primary">
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xl={4} lg={5}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w500${actor?.profile_path}`}
            alt={actor?.name}
          />
        </Grid>
        {/* Name & Birthday & Bio */}
        <Grid item lg={7} xl={8} style={{ display: 'flex', justifyContetnt: 'center', flexDirection: 'column' }}>
          <Typography variant="h2" gutterBottom>
            {actor?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Born: {new Date(actor?.birthday).toDateString()}
          </Typography>
          {/* Bio */}
          <Typography variatn="body1" align="justify" paragraph>
            {actor?.biography || 'No Biography Available'}
          </Typography>
          {/* Buttons Groups */}
          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button
              size="medium"
              color="primary"
              variant="contained"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.imdb.com/name/${actor.imdb_id}`}
            >IMDB
            </Button>
            <Button
              endIcon={<ArrowBack />}
              size="medium"
              onClick={() => history.goBack()}
              color="primary"
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Actors Movies */}
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center">Movies</Typography>
        {movies && <MovieList movies={movies} numberOfMovies={12} />}
        <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
      </Box>
    </>
  );
};

export default Actors;
