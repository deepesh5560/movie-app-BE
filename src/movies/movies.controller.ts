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
  @UseInterceptors(FileInterceptor('poster', { storage: CloudinaryStorageConfig }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: CreateMovieDto, @Request() req) {
    const userId = req.user.userId; // from JWT strategy
    const payload = { ...body, poster: file?.path || '', userId };
    return this.moviesService.create(payload);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.userId;
    return this.moviesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.moviesService.findOne(id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto, @Request() req) {
    const userId = req.user.userId;
    return this.moviesService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.moviesService.remove(id, userId);
  }
}
