import { rest, RestHandler } from 'msw'
import { omit, pick } from 'lodash-es'

import { environment } from '@/configs/environment'
import { movies } from '@/test/data/movies'
import type { Movie, MovieDetail, MovieReview } from '@/services/api/movie'

const { apiUrl } = environment
const defaultDelay = 1800

function getMovieBySlug(movieSlug: string) {
  const movie = movies.find((movie) => movie.slug === movieSlug)

  if (!movie) {
    throw new Error(`Movie slug:"${movieSlug}" not found`)
  }

  return movie
}

export const movieHandlers: RestHandler[] = [
  rest.get<never, Movie[]>(`${apiUrl}/movies`, (_, response, context) => {
    const parsedMovies = movies.map((movie) => {
      return pick(movie, 'id', 'slug', 'name', 'category', 'score', 'year')
    })

    return response(context.status(200), context.delay(defaultDelay), context.json(parsedMovies))
  }),

  rest.get<never, MovieReview[]>(`${apiUrl}/movie-review/:slug`, (request, response, context) => {
    const movie = getMovieBySlug(request.params.slug)

    return response(context.status(200), context.delay(defaultDelay), context.json(movie.reviews))
  }),

  rest.get<never, MovieDetail>(`${apiUrl}/movie-detail/:slug`, (request, response, context) => {
    const movie = getMovieBySlug(request.params.slug)
    const movieDetails = omit(movie, ['reviews'])

    return response(context.status(200), context.delay(defaultDelay), context.json(movieDetails))
  }),
]