export type ArrayOrElement<TArray> = TArray extends (infer TElement)[] ? TElement : TArray

/**
 * T1과 T2의 교집합 타입
 */
export type IntersectionType<T1 extends object, T2 extends object> = Pick<T1 & T2, Extract<keyof T1, keyof T2>>

export type PrimitiveType = number | string | boolean | null | undefined | bigint | symbol

/**
 * @sample
 * interface Campaign {
 *   id: string
 *   attributeValues: {
 *     optionalAttributes: string[]
 *     mandatoryAttributes: string[]
 *     values?: { [key: string]: unknown }
 *   }
 * }
 *
 * type CampaignForm = ChangeFields<Campaign, {
 *   attributeValues: Omit<Campaign['attributeValues'], 'mandatoryAttributes'|'optionalAttributes'>
 * }>;
 *
 * const form: CampaignForm = {
 *   id: '123',
 *   attributeValues: {
 *     values: { '1': 1 }
 *   }
 * }
 */
export type ChangeFields<T, R> = Omit<T, keyof R> & R
