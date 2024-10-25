import { getMoviesByYear } from '../moviesServiecs'; 
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios); 

describe('getMoviesByYear', () => {
  afterEach(() => {
    mock.reset(); 
  });

  it('should fetch movies with multiple editors', async () => {
    
    mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
      results: [
        { id: 1, title: 'Joker', release_date: 'October 1, 2019', vote_average: 8.15 },
      ],
    });

    
    mock.onGet('https://api.themoviedb.org/3/movie/1/credits').reply(200, {
      crew: [
        { known_for_department: 'Editing', name: 'Jeff Groth' },
        { known_for_department: 'Editing', name: 'Jeff Mee' },
        { known_for_department: 'Editing', name: 'Ray Neapolitan' },
        { known_for_department: 'Editing', name: 'Thomas J. Cabela'},
        { known_for_department: 'Editing', name: 'Jill Bogdanowicz' },
        { known_for_department: 'Editing', name: 'Jason Saulog' },
        { known_for_department: 'Editing', name: 'Cindy Bond' },
      ],
    });

    const movies = await getMoviesByYear(2019, 1);

    expect(movies).toEqual([
      {
        title: 'Joker',
        release_date: 'October 1, 2019',
        vote_average: 8.15,
        editors: [
          "Jeff Groth",
          "Jeff Mee",
          "Ray Neapolitan",
          "Thomas J. Cabela",
          "Jill Bogdanowicz",
          "Jason Saulog",
          "Cindy Bond"
        ],
      },
    ]);
  });

  it('should handle missing editors gracefully', async () => {
    
    mock.onGet('https://api.themoviedb.org/3/discover/movie').reply(200, {
      results: [
        { id: 1, title: 'Joker', release_date: 'October 1, 2019', vote_average: 8.15 },
      ],
    });

    
    mock.onGet('https://api.themoviedb.org/3/movie/1/credits').reply(500);

    const movies = await getMoviesByYear(2019, 1);

    expect(movies).toEqual([
      {
        title: 'Joker',
        release_date: 'October 1, 2019',
        vote_average: 8.15,
        editors: [], 
      },
    ]);
  });
});
