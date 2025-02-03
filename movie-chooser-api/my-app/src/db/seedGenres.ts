import { eq } from 'drizzle-orm';
import { getDB } from './client';
import { genres } from './schema/genres';

const db = getDB();

const API_KEY = process.env.TMDB_API_KEY;

const TMDB_GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

async function seedGenres() {
  try {
    const response = await fetch(TMDB_GENRES_URL);
    const data = await response.json();

    if (!data.genres) {
      throw new Error('No genres found in response');
    }

    const genreData = data.genres.map(
      (genre: { id: number; name: string }) => ({
        id: genre.id,
        name: genre.name,
      })
    );

    for (const genre of genreData) {
      const existingGenre = await db
        .select()
        .from(genres)
        .where(eq(genres.id, genre.id))
        .get();
      if (!existingGenre) {
        await db.insert(genres).values(genre);
      }
    }

    console.log('Genres seeded successfully.');
  } catch (error) {
    console.error('Error seeding genres:', error);
  }
}

seedGenres();
