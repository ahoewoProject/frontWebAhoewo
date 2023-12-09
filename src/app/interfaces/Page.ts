export interface Page<T> {
  content: T[],
  pageable: {
    sort: {
        empty: boolean,
        unsorted: boolean,
        sorted: boolean
    },
    offset: number,
    pageSize: number,
    pageNumber: number,
    paged: boolean,
    unpaged: boolean
  },
  last: boolean,
  totalPages: number,
  totalElements: number,
  size: number,
  number: number,
  sort: {
    empty: boolean,
    unsorted: boolean,
    sorted: boolean
  },
  first: boolean,
  numberOfElements: number,
  empty: boolean
}
