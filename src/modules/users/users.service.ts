import { ListResponse } from '@/common/interfaces/response.interface';
import { Role } from '@/common/utils/enums';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserBasicInfoDto } from './dto/update-user-basic-info.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  @Inject()
  private readonly userRepository: UsersRepository;

  async create(userDto: RegisterDto & { role: Role }): Promise<UserEntity> {
    return this.userRepository.save(userDto);
  }

  async findUserByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async findMany(filters: FilterUserDto): Promise<ListResponse<UserEntity>> {
    return this.userRepository.findMany(filters);
  }

  async updateUser(
    id: number,
    userDto: Partial<UserEntity>,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, userDto);
  }

  async updateUserBasicInfo(
    id: number,
    userDto: UpdateUserBasicInfoDto,
  ): Promise<UserEntity | null> {
    await this.userRepository.update(id, { ...userDto });
    return this.findUserById(id);
  }
}
