import { Pagination } from 'nestjs-typeorm-paginate';

export type ListResponse<T> = T[] | Pagination<T>;
