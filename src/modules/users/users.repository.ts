import { ListResponse } from '@/common/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findMany(filters: FilterUserDto): Promise<ListResponse<UserEntity>> {
    const key = 'users';
    const excludeKeys: string[] = [];
    const exactMatchKeys: string[] = ['email', 'role'];
    const paginationKeys: string[] = ['page', 'limit', 'sort_by', 'sort_order'];
    const queryBuilder = this.repository.createQueryBuilder(key);
    Object.keys(filters).forEach((k) => {
      if (excludeKeys.includes(k) || paginationKeys.includes(k)) return;
      if (exactMatchKeys.includes(k))
        return queryBuilder.andWhere(`${k} = :${k}`, {
          [k]: (filters as any)[k],
        });
      return queryBuilder.andWhere(`${k} LIKE :${k}`, {
        [k]: `%${(filters as any)[k]}%`,
      });
    });

    if (filters.sort_by) {
      queryBuilder.orderBy(
        `${key}.${filters.sort_by}`,
        filters.sort_order || 'DESC',
      );
    }

    if (!filters.page) {
      return queryBuilder.getRawMany();
    }

    return paginateRaw<UserEntity>(queryBuilder, {
      page: filters.page,
      limit: filters.limit,
    });
  }
}
