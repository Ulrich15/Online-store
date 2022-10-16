import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
  }

  async createOrUpdate(user:User): Promise<User> {
    const hash = await bcrypt.hash(user.password, 10);
    user.setPassword(hash);
    return this.usersRepository.save(user);
  }

  async login(email:string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where : {email}});

    if(user) {
      const isMatch = await bcrypt.compare(password, user.getPassword());
      if(isMatch) {
        return user;
      }
      return null;
    }
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({
      id: parseInt(id)
    });
  }

  updateBalance(id: number, balance: number) {
    return this.usersRepository.update(id, { balance})
  }
}
