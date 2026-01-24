export const RowStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;
export type RowStatus = (typeof RowStatus)[keyof typeof RowStatus];

export const Role = {
  ADMIN: 1,
  MANAGER: 2,
  HR: 3,
  EMPLOYEE: 4,
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
