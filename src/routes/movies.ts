import { Router, Request, Response } from 'express';
import { getMoviesByYear } from '../services/moviesServiecs';

const router = Router();

router.get('/', async (req: Request, res: Response):Promise<any> => {
  const { year } = req.query;
  const { page = 1 } = req.query;

  if (!year) {
    return res.status(400).json({ message: 'Year is required.' });
  }

  try {
    const movies = await getMoviesByYear(parseInt(year as string), parseInt(page as string));
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching movies.' });
  }
});

export default router;
