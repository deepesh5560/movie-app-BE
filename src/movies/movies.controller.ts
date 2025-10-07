import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Request,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CloudinaryStorageConfig } from 'src/config/cloudinary-storage';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('poster', { storage: CloudinaryStorageConfig }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMovieDto,
    @Request() req,
  ) {
    const userId = req.user.userId; // from JWT strategy
    const payload = { ...body, poster: file?.path || '', userId };
    return this.moviesService.create(payload);
  }

  @Get()
  findAll(
  @Request() req,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  const userId = req.user.userId;
  const pageNumber = parseInt(page as any, 10) || 1;
  let limitNumber = parseInt(limit as any, 10) || 10;

  // Optional: Set max limit to prevent overloading
  if (limitNumber > 100) limitNumber = 100;

  return this.moviesService.findAll(userId, {
    page: pageNumber,
    limit: limitNumber,
  });
}

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.moviesService.findOne(id, userId);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('poster', { storage: CloudinaryStorageConfig }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateMovieDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    // attach poster path only if new image uploaded
    const updatePayload = {
      ...dto,
      ...(file ? { poster: file.path } : {}),
    };

    return this.moviesService.update(id, updatePayload, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.moviesService.remove(id, userId);
  }
}
