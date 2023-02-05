import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  imageLink: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10% 0',
  },
  image: {
    width: '70%',
    height: 'auto',
    textSize: '2rem',
  },
  links: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  genreImage: {
    // " invert(1)" changes the images if we are in dark mode to make the img more visible.
    filter: theme.palette.mode === 'dark' && 'invert(1)',
  },
}));
