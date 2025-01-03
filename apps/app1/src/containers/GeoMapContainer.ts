import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import useGeoMap, { MapEnum, geoMapMaterial } from '@/hooks/useGeoMap'
import { LocalStorage, LocalStorageKeyEnum } from '@/utils/localStorage'

/**
 * 각 레포지토리마다 GeoMapContainer를 만들어 사용합니다.
 * 공통 로직인 useGeoMap 훅을 사용하고
 * 각 레포지토라마다 추가될 로직이나 import 되어 사용해야하는 것들은 Container에 정의하여 사용합니다.
 */
const useGeoMapContainer = () => {
  const [mapType, setMapType] = useState<MapEnum>()
  const geoMapSet = useGeoMap<MarkerEnum, PolylineEnum, GeoJsonEnum, MapEventEnum>(geoMapMaterial(mapType), mapType)

  const changeMapType = () => {
    const storedMapType = LocalStorage.getItem<MapEnum>(LocalStorageKeyEnum.GeoMapType)
    LocalStorage.setItem<MapEnum>(
      LocalStorageKeyEnum.GeoMapType,
      storedMapType === MapEnum.NaverMap ? MapEnum.GoogleMap : MapEnum.NaverMap
    )
    window.location.reload()
  }

  const settingMapType = (mapType: MapEnum) => {
    const storedMapType = LocalStorage.getItem<MapEnum>(LocalStorageKeyEnum.GeoMapType)
    if (storedMapType === mapType) {
      return
    }
    LocalStorage.setItem<MapEnum>(LocalStorageKeyEnum.GeoMapType, mapType)
    window.location.reload()
  }

  useEffect(() => {
    const storedMapType = LocalStorage.getItem<MapEnum>(LocalStorageKeyEnum.GeoMapType)
    if (!storedMapType) {
      LocalStorage.setItem<MapEnum>(LocalStorageKeyEnum.GeoMapType, MapEnum.GoogleMap)
      setMapType(MapEnum.GoogleMap)
      return
    }
    setMapType(storedMapType)
  }, [])

  return {
    mapType,
    changeMapType,
    settingMapType,
    ...geoMapSet
  }
}

const GeoMapContainer = createContainer(useGeoMapContainer)
export default GeoMapContainer

export type MarkerInfoType = {
  name?: string | null
  latitude: number
  longitude: number
  id?: number
  markerType: MarkerEnum
}

export enum MarkerEnum {
  Searched = 'Searched',
  Selected = 'Selected',
  Location = 'Location'
}

export enum PolylineEnum {
  BaseToStartTPolyline = 'BaseToStartTPolyline',
  StartToDestinationPolyline = 'StartToDestinationPolyline'
}

export enum GeoJsonEnum {
  ExpectMovePath = 'ExpectMovePath'
}

// 이벤트 이름은 설명/액션/타켓 으로 하고 있습니다.
export enum MapEventEnum {
  ClickSearchedNode = 'ClickSearchedNode',
  ClickLocationNode = 'ClickLocationNode',
  ClickSelectedNode = 'ClickSelectedNode,'
}
const correctionPositionStyle = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'

// 마커 스타일 모음
export const MarkerStyle = {
  [MarkerEnum.Selected]: (
    name: string
  ) => `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; ${correctionPositionStyle}" >
            <svg width='48px' height='48px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 10.2C4 5.69801 7.55535 2 12 2C16.4446 2 20 5.69801 20 10.2C20 12.4965 18.9859 14.5068 17.613 16.3405C16.4671 17.871 15.0003 19.3666 13.5411 20.8543C13.2654 21.1355 12.99 21.4163 12.717 21.6971C12.5287 21.8907 12.2701 22 12 22C11.7299 22 11.4713 21.8907 11.283 21.6971C11.01 21.4163 10.7346 21.1355 10.4589 20.8543C8.99974 19.3666 7.53292 17.871 6.38702 16.3405C5.01406 14.5068 4 12.4965 4 10.2ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z" fill='#00A5E0' /></svg>
            <span style="font-size: 10px; color: black; font-weight: 700; white-space: nowrap;">${name}</span>
        </div>`,
  [MarkerEnum.Location]: (
    name: string
  ) => `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; ${correctionPositionStyle}" >
            <svg width='24px' height='24px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 10.2C4 5.69801 7.55535 2 12 2C16.4446 2 20 5.69801 20 10.2C20 12.4965 18.9859 14.5068 17.613 16.3405C16.4671 17.871 15.0003 19.3666 13.5411 20.8543C13.2654 21.1355 12.99 21.4163 12.717 21.6971C12.5287 21.8907 12.2701 22 12 22C11.7299 22 11.4713 21.8907 11.283 21.6971C11.01 21.4163 10.7346 21.1355 10.4589 20.8543C8.99974 19.3666 7.53292 17.871 6.38702 16.3405C5.01406 14.5068 4 12.4965 4 10.2ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z" fill='#7B7B7B' /></svg>
            <span style="font-size: 10px; color: black; font-weight: 700; white-space: nowrap;">${name}</span>
        </div>`,
  [MarkerEnum.Searched]: (
    name: string
  ) => `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; ${correctionPositionStyle}" >
            <svg width='24px' height='24px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 10.2C4 5.69801 7.55535 2 12 2C16.4446 2 20 5.69801 20 10.2C20 12.4965 18.9859 14.5068 17.613 16.3405C16.4671 17.871 15.0003 19.3666 13.5411 20.8543C13.2654 21.1355 12.99 21.4163 12.717 21.6971C12.5287 21.8907 12.2701 22 12 22C11.7299 22 11.4713 21.8907 11.283 21.6971C11.01 21.4163 10.7346 21.1355 10.4589 20.8543C8.99974 19.3666 7.53292 17.871 6.38702 16.3405C5.01406 14.5068 4 12.4965 4 10.2ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z" fill='#F97272' /></svg>
            <span style="font-size: 10px; color: black; font-weight: 700; white-space: nowrap;">${name}</span>
        </div>`
}
