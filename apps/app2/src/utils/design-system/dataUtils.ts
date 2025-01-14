import cloneDeep from 'lodash/cloneDeep'
import _isEqual from 'lodash/isEqual'
import { FieldValues } from 'react-hook-form'
import { PrimitiveType } from '@/types/design-system/generic.type'

const isEmpty = <T>(value: T | undefined): value is undefined => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'undefined' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return _isEmptyPrimitive(value)
  }

  if (Array.isArray(value)) {
    return _isEmptyArray(value)
  }

  return typeof value === 'object' && Object.keys(value).length === 0
}

const _isEmptyArray = <T>(arr: T) => {
  return Array.isArray(arr) && arr.length === 0
}

const _isEmptyPrimitive = <T>(value: T) => {
  return value === undefined || value === null || value === '' || value === 0 || value === false
}

const excludeEmptyProperty = (input: Record<string, any>) => {
  const updatedObject: Record<string, any> = {}

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      if (!isEmpty(input[key])) {
        updatedObject[key] = input[key]
      }
    }
  }

  return updatedObject
}

const isValidateNumber = (value: string | number | undefined | null) => {
  const isNumeric = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return false
    if (typeof value === 'string') return false
    return !isNaN(value)
  }
  // 숫자로 변환될수 없는 값이면 false
  if (!isNumeric(value)) return false
  return Number(value) !== 0
}

/**
 * object에서 value로 key를 찾아 리턴
 * @param object
 * @param value
 * @returns string | undefined
 */
const getKeyByValue = (object: { [key: string]: string }, value: string) => {
  return Object.keys(object).find((key) => object[key] === value)
}

const isIncludeValue = (value: PrimitiveType, obj: Record<string, PrimitiveType>) => {
  return Object.values(obj).includes(value)
}

const isNullOrUndefined = (value?: unknown): value is null | undefined => {
  return value === null || value === undefined
}

const copy = <T extends object>(value: T): T => {
  return cloneDeep(value)
}

const deduplication = <T>(array: T[]) => {
  return Array.from(new Set(array))
}

/**
 * key에 해당하는 values의 값들이 모두 비어있는 경우 true
 * @example
 * case1
 * obj: {
 *     a: 0,
 *     b: ""
 * }
 * DataUtils.isEmpty(obj) // true
 * obj: {
 * }
 * DataUtils.isEmpty(obj) // true
 *
 * case2
 * obj: {}
 * DataUtils.isEmpty(obj) // true
 *
 * case3
 * obj: {
 *     a: 0,
 *     b: "aaa"
 * }
 * DataUtils.isEmpty(obj) // false
 */
const isEmptyObjValues = (obj: FieldValues) => {
  return Object.values(obj).some((value) => DataUtils.isEmpty(value))
}

const isEqual = (value1: any, value2: any) => {
  return _isEqual(value1, value2)
}

const moveArrayElement = <T>(arr: T[], fromIndex: number, toIndex: number): T[] | undefined => {
  const result = [...arr]
  if (fromIndex < 0 || fromIndex >= result.length || toIndex < 0 || toIndex >= result.length) {
    return
  }
  const element = result.splice(fromIndex, 1)[0]
  result.splice(toIndex, 0, element)
  return result
}

const DataUtils = {
  moveArrayElement,
  isEmptyObjValues,
  deduplication,
  isEmpty,
  excludeEmptyProperty,
  isValidateNumber,
  getKeyByValue,
  isIncludeValue,
  isNullOrUndefined,
  copy,
  isEqual
}

export default DataUtils
