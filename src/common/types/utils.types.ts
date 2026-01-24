export type SanitizedEntity<T, K extends keyof T = never> = Omit<
  T,
  | K
  | 'hasId'
  | 'save'
  | 'remove'
  | 'softRemove'
  | 'recover'
  | 'reload'
  | 'getId'
>;
