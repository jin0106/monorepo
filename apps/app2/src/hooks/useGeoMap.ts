import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Feature, FeatureCollection, LineString } from 'geojson'
import isEmpty from 'lodash/isEmpty'
import {
  CoordinateType,
  GeoJsonType,
  GeoMapDependencyMaterialType,
  GeoMapType,
  GeoMarkerType,
  GeoPolylineType,
  GeometryTypeEnum,
  MapEventListenerType,
  MapOptionType,
  MarkerType,
  PolylineOptionType,
  PolylineType
} from '@/types/geoMap.type'
import { googleMapMaterial } from '@/utils/geo-map/googleMapMaterial'
import { naverMapMaterial } from '@/utils/geo-map/naverMapMaterial'

export enum MapEnum {
  GoogleMap = 'GoogleMap',
  NaverMap = 'NaverMap'
}

export const geoMapMaterial = (mapType?: MapEnum) => {
  return mapType === MapEnum.GoogleMap ? googleMapMaterial() : naverMapMaterial()
}

/**
 * useGeoMap, googleMapMaterial, naverMapMaterial, geoMap.type
 * 위 파일들은 레포지토리 모두 공통적으로 사용되며 각 레포지토리마다 코드가 달라져서는 안됩니다.
 * 따라서 레포지토리의 고유의 코드가 import 됨을 막습니다.
 *
 * 지도를 사용하는 모든 곳에서 공통된 코드를 사용하기 위함입니다.
 *
 * 각 레포지토리 마다 추가 되어야 하는기능은 GeoMapContainer에 추가하여 사용합니다.
 *
 * @param loadScriptUrl
 * @param geoMapKey
 * @param createGeoMap
 * @param destroyGeoMap
 * @param removeGeoJsonFromGeoMap
 * @param addGeoJsonOnGeoMap
 * @param createPolylineOnGeoMap
 * @param removePolylineOnGeoMap
 * @param createMarkerOnGeoMap
 * @param removeMarkerOnGeoMap
 * @param addEventListenerOnGeoMap
 * @param removeEventListenerOnGeoMap
 * @param getCoordinateFromMarker
 * @param getCoordinateFromMap
 * @param getEventCoordinate
 * @param mapType
 */
const useGeoMap = <TMarkerEnum, TPolylineEnum, TGeoJsonEnum, TMapEventEnum>(
  {
    loadScriptUrl,
    restScriptLoad,
    geoMapKey,
    createGeoMap,
    destroyGeoMap,
    removeGeoJsonFromGeoMap,
    addGeoJsonOnGeoMap,
    createPolylineOnGeoMap,
    removePolylineOnGeoMap,
    createMarkerOnGeoMap,
    removeMarkerOnGeoMap,
    addEventListenerOnGeoMap,
    removeEventListenerOnGeoMap,
    getCoordinateFromMarker,
    getCoordinateFromMap,
    getEventCoordinate,
    setZoomGeoMap,
    panToGeoMap,
    panByGeoMap
  }: GeoMapDependencyMaterialType<GeoMapType>,
  mapType?: MapEnum
) => {
  const [isGeoMapLoaded, setIsGeoMapLoaded] = useState(false)
  const [geoMapCenter, setGeoMapCenter] = useState<CoordinateType>({ latitude: 0, longitude: 0 })
  const [geoMap, setGeoMap] = useState<GeoMapType>()
  const markers = useRef<MarkerType<TMarkerEnum>[]>([])
  const polylines = useRef<PolylineType<TPolylineEnum>[]>([])
  const geoJsons = useRef<GeoJsonType<TGeoJsonEnum>[]>([])
  const mapEventListeners = useRef<MapEventListenerType<TMapEventEnum>[]>([])
  const isCanUseMap = !isEmpty(geoMap) && isGeoMapLoaded

  useEffect(() => {
    if (!mapType) return
    geoMapscriptLoad()
    return () => {
      geoMap && destroyGeoMap(geoMap)
    }
  }, [mapType])

  const geoMapscriptLoad = async () => {
    if (!geoMapKey) {
      alert('geoMap 키가 환경변수에 없습니다.')
      return
    }
    const geoMapScriptId = 'geoMap'
    const geoMapScript = document.getElementById(geoMapScriptId)
    if (geoMapScript) {
      setIsGeoMapLoaded(true)
      return
    }
    window.onLoadGeoMap = () => {
      setIsGeoMapLoaded(true)
    }
    const $script = document.createElement('script')
    $script.src = loadScriptUrl
    $script.async = true
    $script.id = geoMapScriptId
    $script.addEventListener('load', () => setIsGeoMapLoaded(true))
    document.head.appendChild($script)
    await restScriptLoad?.()
  }

  const initGeoMap = ({ longitude, latitude, mapTypeControl = false }: CoordinateType & MapOptionType) => {
    const mapElement = document.getElementById('map')
    if (!isGeoMapLoaded || !mapElement) return
    if (geoMap) {
      destroyGeoMap(geoMap)
    }
    setGeoMap(createGeoMap({ latitude, longitude, mapTypeControl }))
    setGeoMapCenter({ longitude, latitude })
  }

  const extractGeoJson = (geoJson: FeatureCollection, type: GeometryTypeEnum): FeatureCollection => {
    return {
      ...geoJson,
      features: geoJson.features.filter((feature) => feature.geometry.type === type)
    }
  }

  const fetchGeoJson = async ({
    jsonUrl,
    geoJsonType,
    filterType
  }: {
    jsonUrl: string
    geoJsonType: TGeoJsonEnum
    filterType: GeometryTypeEnum
  }) => {
    const geoJson = await axios.get<FeatureCollection>(jsonUrl).then((res) => res.data)
    const filteredGeoJson = filterType ? extractGeoJson(geoJson, filterType) : geoJson
    geoJsons.current.push({ geoJson: filteredGeoJson, geoJsonType })
    return filteredGeoJson
  }

  const removeGeoJson = (removeGeoJsonTypes: TGeoJsonEnum[]) => {
    geoJsons.current = geoJsons.current.filter((geoJson) => !removeGeoJsonTypes.includes(geoJson.geoJsonType))
  }

  const removeGeoJsonFile = (geoJson: FeatureCollection) => {
    if (!isCanUseMap) return
    removeGeoJsonFromGeoMap(geoMap, geoJson)
  }

  const addGeoJsonFile = (geoJson: FeatureCollection) => {
    if (!isCanUseMap) return
    addGeoJsonOnGeoMap(geoMap, geoJson)
  }

  const convertLineStringToPath = (feature: Feature<LineString>): CoordinateType[] => {
    return feature.geometry.coordinates.map((coordinate) => ({ latitude: coordinate[1], longitude: coordinate[0] }))
  }

  const addMapEventListener = (params: {
    target: GeoPolylineType | GeoMarkerType | GeoMapType
    eventName: string
    mapEventType: TMapEventEnum
    listener: (event: any) => void
  }) => {
    if (!isCanUseMap) return
    const { target, eventName, listener, mapEventType } = params
    const mapEventListener = addEventListenerOnGeoMap({ target, eventName, listener })
    mapEventListener && mapEventListeners.current.push({ mapEventType, mapEventListener })
  }

  const removeMapEventListener = (removeMapEventType: TMapEventEnum[]) => {
    if (!isCanUseMap || isEmpty(mapEventListeners.current)) return
    const removeMapEventListener = mapEventListeners.current.filter((mapEventListener) =>
      removeMapEventType.includes(mapEventListener.mapEventType)
    )
    mapEventListeners.current = mapEventListeners.current.filter(
      (mapEventListener) => !removeMapEventType.includes(mapEventListener.mapEventType)
    )
    removeMapEventListener.forEach((mapEventListener) => removeEventListenerOnGeoMap(mapEventListener.mapEventListener))
  }

  const drawPolyline = ({
    isArrow,
    coordinates,
    strokeColor,
    strokeWeight = 5,
    zIndex,
    clickable = true,
    polylineType,
    mapEventType,
    listener,
    eventName
  }: PolylineOptionType<GeoMapType> & {
    polylineType: TPolylineEnum
    mapEventType?: TMapEventEnum
    listener?: (event: any) => void
    eventName?: string
  }) => {
    if (!isCanUseMap) return
    const polyline = createPolylineOnGeoMap({
      geoMap,
      coordinates,
      strokeWeight,
      strokeColor,
      clickable,
      zIndex,
      isArrow
    })
    if (!polyline) return
    polylines.current.push({ polylineType, polyline })
    if (!(listener && eventName && mapEventType)) return
    addMapEventListener({ target: polyline, eventName, listener, mapEventType })
  }

  const removePolyline = (removePolylineTypes: TPolylineEnum[]) => {
    if (!isCanUseMap) return
    const removePolylines = polylines.current.filter((polyline) => removePolylineTypes.includes(polyline.polylineType))
    polylines.current = polylines.current.filter((polyline) => !removePolylineTypes.includes(polyline.polylineType))
    removePolylines.forEach((polyline) => removePolylineOnGeoMap(polyline.polyline))
  }

  const drawMarker = (params: {
    zIndex: number
    longitude: number
    latitude: number
    markerType: TMarkerEnum
    markerMarkup: string
    mapEventType?: TMapEventEnum
    onClickListener?: (event: any) => void
  }) => {
    if (!isCanUseMap) return
    const { latitude, longitude, markerMarkup, markerType, onClickListener, mapEventType, zIndex } = params
    const marker = createMarkerOnGeoMap({ content: markerMarkup, geoMap, position: { latitude, longitude }, zIndex })
    if (!marker) return
    markers.current.push({ markerType, mapMarker: marker })
    mapEventType &&
      onClickListener &&
      addMapEventListener({ mapEventType, eventName: 'click', listener: onClickListener, target: marker })
    return marker
  }

  const removeMarker = (params: { removeMarkerTypes: TMarkerEnum[]; removeMarkerCoordinate?: CoordinateType }) => {
    if (!isCanUseMap) return
    const { removeMarkerTypes, removeMarkerCoordinate } = params
    if (!(markers.current && markers.current.length > 0)) return

    const removeMarkers = markers.current.filter((marker) => {
      if (removeMarkerCoordinate) {
        const markerPosition = getCoordinateFromMarker(marker.mapMarker)
        return (
          removeMarkerTypes.includes(marker.markerType) &&
          removeMarkerCoordinate.latitude === markerPosition?.latitude &&
          removeMarkerCoordinate.longitude === markerPosition?.longitude
        )
      }
      return removeMarkerTypes.includes(marker.markerType)
    })

    markers.current = markers.current.filter((marker) => {
      if (removeMarkerCoordinate) {
        const markerPosition = getCoordinateFromMarker(marker.mapMarker)
        return !(
          removeMarkerTypes.includes(marker.markerType) &&
          removeMarkerCoordinate.latitude === markerPosition?.latitude &&
          removeMarkerCoordinate.longitude === markerPosition?.longitude
        )
      }
      return !removeMarkerTypes.includes(marker.markerType)
    })
    removeMarkers.forEach((marker) => removeMarkerOnGeoMap(marker.mapMarker))
  }

  const getMapCenter = () => {
    if (!isCanUseMap) return
    return getCoordinateFromMap(geoMap)
  }

  const viewNodeByMapType = (mapType: MapEnum, nodeMarkup: string) => {
    return mapType === MapEnum.NaverMap
      ? nodeMarkup + ' translate-x-[-50%] translate-y-[-50%]'
      : nodeMarkup + ' translate-y-[50%]'
  }

  // 지정한 좌표를 중심점으로 지도를 이동합니다. 이때, 이동 거리가 가깝다면 부드럽게 이동합니다.
  const panTo = (coordinate: CoordinateType) => {
    if (!isCanUseMap) return
    panToGeoMap({ geoMap: geoMap, coordinate })
  }

  // 지정한 픽셀 좌표만큼 지도를 이동합니다.
  const panBy = (coordinate: CoordinateType) => {
    if (!isCanUseMap) return
    panByGeoMap({ geoMap: geoMap, coordinate })
  }

  const setZoom = (zoom: number) => {
    if (!isCanUseMap) return
    setZoomGeoMap({ geoMap: geoMap, zoom: zoom })
  }

  return {
    // geoMap setting
    geoMap,
    setGeoMap,
    initGeoMap,
    isGeoMapLoaded,
    geoMapCenter,
    setGeoMapCenter,
    getMapCenter,
    panTo,
    panBy,
    setZoom,
    // figure
    markers,
    polylines,
    drawPolyline,
    removePolyline,
    drawMarker,
    removeMarker,
    // map event
    mapEventListeners,
    addMapEventListener,
    removeMapEventListener,
    // geoJson
    geoJsons,
    fetchGeoJson,
    extractGeoJson,
    convertLineStringToPath,
    removeGeoJson,
    addGeoJsonFile,
    removeGeoJsonFile,
    // materials
    getCoordinateFromMarker,
    getCoordinateFromMap,
    getEventCoordinate,
    viewNodeByMapType
  }
}

export default useGeoMap
