// FILE: libs/database/src/base/base.repository.ts
export abstract class BaseRepository<
  TEntity,
  TId,
  TCreate,
  TUpdate,
> {
  abstract findById(id: TId): Promise<TEntity | null>;
  abstract create(data: TCreate): Promise<TEntity>;
  abstract update(id: TId, data: TUpdate): Promise<TEntity>;
  abstract delete(id: TId): Promise<TEntity>;
}
