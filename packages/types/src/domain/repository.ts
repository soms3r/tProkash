import type { BaseEntity } from "./entity";
import type { Filter } from "./filter";
import type { PageRequest, PageResult } from "./pagination";
import type { SearchRequest, SearchResult } from "./search";
import type { Identifier } from "..";

export interface Repository<T extends BaseEntity, TId extends Identifier = Identifier> {
  findById(id: TId): Promise<T | null>;
  findAll(request?: PageRequest): Promise<PageResult<T>>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
  exists(id: TId): Promise<boolean>;
  count(filter?: Filter[]): Promise<number>;
  search(request: SearchRequest): Promise<SearchResult<T>>;
}
