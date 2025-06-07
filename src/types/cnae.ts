export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface Pageable {
  offset: number // int64
  sort: Sort
  empty: boolean
  sorted: boolean
  unsorted: boolean
  paged: boolean
  pageNumber: number // int32
  pageSize: number // int32
  unpaged: boolean
}

export interface CnaeItem {
  codigo: string
  descricao: string
  number: number // int32
}

export interface PageCnae {
  totalElements: number // int64
  totalPages: number // int32
  size: number // int32
  content: CnaeItem[]
  sort: Sort
  pageable: Pageable
  numberOfElements: number // int32
  first: boolean
  last: boolean
  empty: boolean
}
