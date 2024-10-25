import axios from 'axios';
import { format } from 'date-fns';
import dotenv from 'dotenv';

dotenv.config(); 

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_BEARER_TOKEN;

console.log("TMDB_TOKEN: ", TMDB_TOKEN)

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

interface Movie {
  title: string;
  release_date: string;
  vote_average: number;
  editors: string[];
}


export const getMoviesByYear = async (year: number, page: number): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get(`/discover/movie`, {
      params: {
        language: 'en-US',
        page,
        primary_release_year: year,
        sort_by: 'popularity.desc',
      },
    });

    const movies = response.data.results;

    console.log('movies data: ', movies)
    const moviesWithEditors = await Promise.all(
      movies.map(async (movie: any) => {
        const editors = await fetchEditors(movie.id);
        return {
          title: movie.title,
          release_date: format(new Date(movie.release_date), 'MMMM d, yyyy'), // Proper formatting
          vote_average: parseFloat(movie.vote_average.toFixed(2)),
          editors,
        };
      })
    );

    return moviesWithEditors;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies.');
  }
};


const fetchEditors = async (movieId: number): Promise<string[]> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    const editors = response.data.crew
      .filter((member: any) => member.known_for_department === 'Editing')
      .map((editor: any) => editor.name);

    return editors;
  } catch (error) {
    console.warn(`Failed to fetch editors for movie ID ${movieId}. Continuing without editors.`);
    return []; 
  }
};
