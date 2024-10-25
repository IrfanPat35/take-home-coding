import express from 'express';
import moviesRoute from './routes/movies';
import dotenv from 'dotenv';

dotenv.config({path: './.env'}); // Load environment variables from .env

// console.log('TMDB_TOKEN:', process.env.TMDB_BEARER_TOKEN);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/movies', moviesRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
