import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  // Create movie linked to user
  async create(dto: CreateMovieDto & { userId: Types.ObjectId }): Promise<Movie> {
    const movie = new this.movieModel(dto);
    return movie.save();
  }

  // Get movies only for logged-in user
async findAll(
  userId: string,
  options: { page: number; limit: number }
): Promise<{ movies: Movie[]; page: number; pageSize: number; total: number }> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const total = await this.movieModel.countDocuments({ userId });
  const movies = await this.movieModel
    .find({ userId })
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    movies,
    page,
    pageSize: limit,
    total,
  };
}

  async findOne(id: string, userId: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ _id: id, userId });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: string, dto: UpdateMovieDto, userId: string): Promise<Movie> {
    const movie = await this.movieModel.findOneAndUpdate(
      { _id: id, userId },
      dto,
      { new: true },
    );
    if (!movie) throw new ForbiddenException('Not authorized to update this movie');
    return movie;
  }

  async remove(id: string, userId: string): Promise<Movie> {
    const movie = await this.movieModel.findOneAndDelete({ _id: id, userId });
    if (!movie) throw new ForbiddenException('Not authorized to delete this movie');
    return movie;
  }
}
