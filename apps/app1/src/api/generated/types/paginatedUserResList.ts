/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { UserRes } from './userRes'

export interface PaginatedUserResList {
  count?: number
  next?: string | null
  previous?: string | null
  results?: UserRes[]
}
