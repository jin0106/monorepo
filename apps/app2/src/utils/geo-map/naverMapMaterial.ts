import { FeatureCollection } from 'geojson'
import isEmpty from 'lodash/isEmpty'
import {
  CoordinateType,
  GeoMapDependencyMaterialType,
  MapEventListerParamType,
  MapOptionType,
  MarkerOptionType,
  PolylineOptionType
} from '@/types/geoMap.type'

/**
 * 네이버 맵 api
 * @link https://navermaps.github.io/maps.js.en/docs/index.html
 */
export const naverMapMaterial = (): GeoMapDependencyMaterialType<naver.maps.Map> => {
  const destroyGeoMap = (geoMap: naver.maps.Map) => {
    if (isEmpty(window?.naver)) return
    geoMap.destroy()
  }

  const createGeoMap = ({ latitude, longitude, mapTypeControl }: CoordinateType & MapOptionType) => {
    if (isEmpty(window?.naver)) return
    const mapElement = document.getElementById('map')
    if (!mapElement) return

    const options: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(latitude, longitude),
      mapTypeControl: mapTypeControl,
      zoom: 16
    }
    return new naver.maps.Map('map', options)
  }

  const removeGeoJsonFromGeoMap = (geoMap: naver.maps.Map, geoJson: FeatureCollection) => {
    if (isEmpty(window?.naver)) return
    if (!geoMap) return
    geoMap.data.removeGeoJson(geoJson)
  }

  const addGeoJsonOnGeoMap = (geoMap: naver.maps.Map, geoJson: FeatureCollection) => {
    if (isEmpty(window?.naver)) return
    geoMap.data.addGeoJson(geoJson, false)
  }

  const createPolylineOnGeoMap = (params: PolylineOptionType<naver.maps.Map>) => {
    if (isEmpty(window?.naver)) return
    const { geoMap, coordinates, strokeColor, strokeWeight, zIndex, clickable, isArrow } = params
    if (!coordinates) return

    return new naver.maps.Polyline({
      map: geoMap,
      path: coordinates.map((coordinate) => ({ lat: coordinate.latitude, lng: coordinate.longitude })),
      strokeColor,
      strokeWeight,
      clickable,
      zIndex,
      endIcon: isArrow ? naver.maps.PointingIcon.OPEN_ARROW : undefined
    })
  }

  const removePolylineOnGeoMap = (polyline: naver.maps.Polyline) => {
    if (isEmpty(window?.naver)) return
    polyline.setMap(null)
  }

  const createMarkerOnGeoMap = (params: MarkerOptionType<naver.maps.Map>) => {
    if (isEmpty(window?.naver)) return
    const { geoMap, content, position, zIndex } = params
    if (!geoMap) return
    return new naver.maps.Marker({
      zIndex,
      position: new naver.maps.LatLng(position.latitude, position.longitude),
      map: geoMap,
      icon: {
        content
      }
    })
  }

  const removeMarkerOnGeoMap = (marker: naver.maps.Marker) => {
    if (isEmpty(window?.naver)) return
    marker.setMap(null)
  }

  const addEventListenerOnGeoMap = (params: MapEventListerParamType) => {
    if (isEmpty(window?.naver)) return
    const { target, eventName, listener } = params
    if (!target) return
    return naver.maps.Event.addListener(target, eventName, (event: any) => listener(event))
  }

  const removeEventListenerOnGeoMap = (eventListener: naver.maps.MapEventListener) => {
    if (isEmpty(window?.naver)) return
    naver.maps.Event.removeListener(eventListener)
  }

  const getCoordinateFromMarker = (marker: naver.maps.Marker) => {
    if (isEmpty(window?.naver)) return
    return { longitude: marker.getPosition().x, latitude: marker.getPosition().y }
  }

  const getCoordinateFromMap = (geoMap: naver.maps.Map) => {
    if (isEmpty(window?.naver)) return
    return { longitude: geoMap?.getCenter().x ?? 0, latitude: geoMap?.getCenter().y ?? 0 }
  }

  const getEventCoordinate = (event: any): CoordinateType => {
    return { longitude: event.coord.x, latitude: event.coord.y }
  }

  const panByGeoMap = ({ geoMap, coordinate }: { geoMap: naver.maps.Map; coordinate: CoordinateType }) => {
    if (isEmpty(window?.naver)) return
    geoMap?.panBy(new naver.maps.Point(coordinate.longitude, coordinate.latitude))
  }

  const panToGeoMap = ({ geoMap, coordinate }: { geoMap: naver.maps.Map; coordinate: CoordinateType }) => {
    if (isEmpty(window?.naver)) return
    geoMap.panTo(new naver.maps.LatLng(coordinate.latitude, coordinate.longitude), {
      duration: 300
    })
  }

  const setZoomGeoMap = ({ geoMap, zoom }: { geoMap: naver.maps.Map; zoom: number }) => {
    if (isEmpty(window?.naver)) return
    geoMap.setZoom(zoom)
  }

  return {
    loadScriptUrl: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVERMAP_KEY}&submodules=drawing,geocoder&autoload=false`,
    geoMapKey: process.env.NAVERMAP_KEY,
    destroyGeoMap,
    createGeoMap,
    panByGeoMap,
    panToGeoMap,
    setZoomGeoMap,
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
    getEventCoordinate
  }
}
