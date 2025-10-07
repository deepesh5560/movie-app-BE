import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, password: string, name: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hash, name });
    return user.save();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
