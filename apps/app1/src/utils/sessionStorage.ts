// 로컬스토리지에 데이터 저장

export enum SessionStorageKeyEnum {
  ViewScroll = 'ViewScroll',
  IsFirstRenderRobotStatusSheet = 'IsFirstRenderRobotStatusSheet'
}

export const sessionStorageRemoveAll = () => {
  Object.values(SessionStorageKeyEnum).forEach((key) => {
    sessionStorage.removeItem(key)
  })
}

const sessionStorageSetItem = <T>(key: SessionStorageKeyEnum, data: T) => {
  // 데이터를 문자열로 변환하고 암호화하여 저장
  window.sessionStorage.setItem(key, JSON.stringify(data))
}

// 로컬스토리지에서 데이터 가져오기
const sessionStorageGetItem = <T>(key: SessionStorageKeyEnum) => {
  // 데이터를 가져와 복호화하고 원래의 타입으로 변환
  const encryptedData = window.sessionStorage.getItem(key)
  try {
    return encryptedData ? (JSON.parse(encryptedData) as T) : null
  } catch (e) {
    window.sessionStorage.clear()
    return null
  }
}

// 로컬스토리지에서 데이터 삭제
const sessionStorageRemoveItem = (key: SessionStorageKeyEnum) => {
  window.sessionStorage.removeItem(key)
}

export const SessionStorage = {
  getItem: sessionStorageGetItem,
  setItem: sessionStorageSetItem,
  removeItem: sessionStorageRemoveItem,
  initItem: sessionStorageRemoveAll
}
