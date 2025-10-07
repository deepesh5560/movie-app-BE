import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb+srv://deepesh5560_db_user:deepesh912@cluster0.7iutgvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    MoviesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
