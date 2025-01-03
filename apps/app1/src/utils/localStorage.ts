import CryptoJS from 'crypto-js'

export enum LocalStorageKeyEnum {
  PromiseNodeNumber = 'PromiseNodeNumber',
  SiteSlug = 'SiteSlug',
  CreatedOrder = 'CreatedOrder',
  AddCartComplete = 'AddCartComplete',
  NonLoginRequestConfigList = 'NonLoginRequestConfigList',
  AccessToken = 'AccessToken',
  BeforeRedirectUrl = 'BeforeRedirectUrl',
  DifferentShop = 'DifferentShop',
  HideOnlyTodayEvent = 'HideOnlyTodayEvent',
  SocialLoginType = 'SocialLoginType',
  ServiceFinishHideOnlyToday = 'ServiceFinishHideOnlyToday',
  CreateDeliveryDocument = 'CreateDeliveryDocument',
  GeoMapType = 'GeoMapType'
}

export const localStorageRemoveAll = () => {
  Object.values(LocalStorageKeyEnum).forEach((key) => {
    localStorage.removeItem(key)
  })
}

// 데이터 암호화 함수
export const encrypt = (data: string) => {
  if (!process.env.STORAGE_SECRET_KEY) {
    return data
  }
  return CryptoJS.AES.encrypt(data, process.env.STORAGE_SECRET_KEY).toString()
}

// 데이터 복호화 함수
export const decrypt = (data: string) => {
  if (!process.env.STORAGE_SECRET_KEY) {
    return data
  }
  const bytes = CryptoJS.AES.decrypt(data, process.env.STORAGE_SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 로컬스토리지에 데이터 저장
const localStorageSetItem = <T>(key: LocalStorageKeyEnum, data: T) => {
  // 데이터를 문자열로 변환하고 암호화하여 저장
  window.localStorage.setItem(key, JSON.stringify(data))
}

// 로컬스토리지에서 데이터 가져오기
const localStorageGetItem = <T>(key: LocalStorageKeyEnum) => {
  // 데이터를 가져와 복호화하고 원래의 타입으로 변환
  const encryptedData = window.localStorage.getItem(key)

  // 복호화 실패시 local storage clear
  try {
    return encryptedData ? (JSON.parse(encryptedData) as T) : null
  } catch (e) {
    window.localStorage.clear()
    return null
  }
}

// 로컬스토리지에서 데이터 삭제
const localStorageRemoveItem = (key: LocalStorageKeyEnum) => {
  window.localStorage.removeItem(key)
}

export const LocalStorage = {
  getItem: localStorageGetItem,
  setItem: localStorageSetItem,
  removeItem: localStorageRemoveItem,
  initItem: localStorageRemoveAll
}
