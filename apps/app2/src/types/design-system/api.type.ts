import { FieldValues } from 'react-hook-form'

export interface PaginatedResDataType<TDataSourceElement> {
  count?: number
  next?: string | null
  previous?: string | null
  results?: TDataSourceElement[]
}

export interface QueryPageParams extends FieldValues {
  limit?: number
  offset?: number
}
