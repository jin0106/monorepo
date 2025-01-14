import { FeatureCollection } from 'geojson'

export type CoordinateType = {
  /** 위도 */
  latitude: number
  /** 경도 */
  longitude: number
}

export type GeoMapType = google.maps.Map | naver.maps.Map
export type GeoPolylineType = google.maps.Polyline | naver.maps.Polyline
export type GeoMarkerType = google.maps.marker.AdvancedMarkerElement | naver.maps.Marker
export type GeoMapEventListenerType = google.maps.MapsEventListener | naver.maps.MapEventListener

export enum GeometryTypeEnum {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection'
}

export type MarkerType<TMarkerEnum> = {
  mapMarker: GeoMarkerType
  markerType: TMarkerEnum
}

export type PolylineType<TPolylineEnum> = {
  polyline: GeoPolylineType
  polylineType: TPolylineEnum
}

export type GeoJsonType<TGeoJsonEnum> = {
  geoJson: FeatureCollection
  geoJsonType: TGeoJsonEnum
}

export type MapEventListenerType<TMapEventEnum> = {
  mapEventListener: GeoMapEventListenerType
  mapEventType: TMapEventEnum
}

export type PolylineOptionType<TGeoMapType> = {
  isArrow?: boolean
  geoMap: TGeoMapType
  coordinates?: CoordinateType[]
  strokeColor: string
  strokeWeight: number
  clickable: boolean
  zIndex: number
}

export type MapOptionType = {
  mapTypeControl?: boolean
}

export type MarkerOptionType<TGeoMapType> = {
  geoMap: TGeoMapType
  position: CoordinateType
  content: string
  zIndex: number
}

export type MapEventListerParamType = {
  target: GeoPolylineType | GeoMarkerType | GeoMapType
  eventName: string
  listener: (event: any) => void
}

export type GeoMapDependencyMaterialType<TGeoMapType> = {
  loadScriptUrl: string
  geoMapKey?: string
  destroyGeoMap(geoMap: GeoMapType): void
  createGeoMap(params: CoordinateType & MapOptionType): GeoMapType | undefined
  panByGeoMap({ geoMap, coordinate }: { geoMap: GeoMapType; coordinate: CoordinateType }): void
  panToGeoMap({ geoMap, coordinate, zoom }: { geoMap: GeoMapType; coordinate: CoordinateType; zoom?: number }): void
  setZoomGeoMap({ geoMap, zoom }: { geoMap: GeoMapType; zoom: number }): void
  removeGeoJsonFromGeoMap(geoMap: GeoMapType, geoJson: FeatureCollection): void
  addGeoJsonOnGeoMap(geoMap: GeoMapType, geoJson: FeatureCollection): void
  createPolylineOnGeoMap(params: PolylineOptionType<TGeoMapType>): undefined | GeoPolylineType
  removePolylineOnGeoMap(polyline: GeoPolylineType): void
  createMarkerOnGeoMap(params: MarkerOptionType<TGeoMapType>): undefined | GeoMarkerType
  removeMarkerOnGeoMap(marker: GeoMarkerType): void
  addEventListenerOnGeoMap(params: MapEventListerParamType): GeoMapEventListenerType | undefined
  removeEventListenerOnGeoMap(eventListener: GeoMapEventListenerType): void
  getCoordinateFromMarker(marker: GeoMarkerType): CoordinateType | undefined
  getCoordinateFromMap(geoMap: GeoMapType): CoordinateType | undefined
  getEventCoordinate(event: any): CoordinateType
  restScriptLoad?(): Promise<void>
}
