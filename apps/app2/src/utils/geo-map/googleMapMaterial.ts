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
 * 구글 맵 api
 * @link https://developers.google.com/maps/documentation/javascript/reference/map?hl=ko#MapOptions.gestureHandling
 */
export const googleMapMaterial = (): GeoMapDependencyMaterialType<google.maps.Map> => {
  const destroyGeoMap = (geoMap: google.maps.Map) => {
    if (isEmpty(window?.google)) return
    geoMap.unbindAll()
  }

  const createGeoMap = ({ latitude, longitude, mapTypeControl }: CoordinateType & MapOptionType) => {
    if (isEmpty(window?.google)) return
    const mapElement = document.getElementById('map')
    if (!mapElement) return

    const options: google.maps.MapOptions = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 16,
      mapTypeControl: mapTypeControl,
      keyboardShortcuts: false,
      fullscreenControl: mapTypeControl,
      rotateControl: false,
      scaleControl: false,
      zoomControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy',
      mapId: process.env.GOOGLEMAP_ID
    }
    return new google.maps.Map(mapElement, options)
  }

  const removeGeoJsonFromGeoMap = (geoMap: google.maps.Map, geoJson: FeatureCollection) => {
    if (isEmpty(window?.google)) return
    if (!geoMap) return
    geoMap.data.forEach((removeFeature) => {
      const removeTargetFeature = geoJson.features.find((feature) => feature.id === removeFeature.getId())
      if (!removeTargetFeature) return
      geoMap.data.remove(removeFeature)
    })
  }

  const addGeoJsonOnGeoMap = (geoMap: google.maps.Map, geoJson: FeatureCollection) => {
    if (isEmpty(window?.google)) return
    geoMap.data.addGeoJson(geoJson)
  }

  const createPolylineOnGeoMap = (params: PolylineOptionType<google.maps.Map>) => {
    if (isEmpty(window?.google)) return
    const { geoMap, coordinates, strokeColor, strokeWeight, zIndex, clickable, isArrow } = params
    return new google.maps.Polyline({
      map: geoMap,
      path: coordinates?.map((coordinate) => ({ lat: coordinate.latitude, lng: coordinate.longitude })),
      strokeColor,
      strokeWeight,
      clickable,
      zIndex,
      icons: isArrow
        ? [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
              },
              offset: '100%' // This places the arrow at the end of the line
            }
          ]
        : undefined
    })
  }

  const removePolylineOnGeoMap = (polyline: google.maps.Polyline) => {
    if (isEmpty(window?.google)) return
    polyline.setMap(null)
  }

  const createMarkerOnGeoMap = (params: MarkerOptionType<google.maps.Map>) => {
    if (isEmpty(window?.google?.maps?.marker?.AdvancedMarkerElement)) return
    const { geoMap, content, position, zIndex } = params
    if (!geoMap) return

    const getNodeMarker = (markerMarkup: string) => {
      const content = document.createElement('div')
      content.innerHTML = markerMarkup
      return content
    }

    return new google.maps.marker.AdvancedMarkerElement({
      position: new google.maps.LatLng(position.latitude, position.longitude),
      map: geoMap,
      content: getNodeMarker(content),
      zIndex: zIndex
    })
  }

  const removeMarkerOnGeoMap = (marker: google.maps.marker.AdvancedMarkerElement) => {
    if (isEmpty(window?.google)) return
    marker.map = null
  }

  const addEventListenerOnGeoMap = (params: MapEventListerParamType) => {
    if (isEmpty(window?.google)) return
    const { target, eventName, listener } = params
    if (!target) return
    return google.maps.event.addListener(target, eventName, (event: any) => listener(event))
  }

  const removeEventListenerOnGeoMap = (eventListener: google.maps.MapsEventListener) => {
    if (isEmpty(window?.google)) return
    google.maps.event.removeListener(eventListener)
  }

  const getCoordinateFromMarker = (marker: google.maps.marker.AdvancedMarkerElement): CoordinateType | undefined => {
    if (isEmpty(window?.google)) return
    if (!(marker.position?.lat && marker.position?.lat)) return
    if (!(typeof marker.position.lat === 'number' && typeof marker.position.lng === 'number')) return

    return { latitude: marker.position.lat, longitude: marker.position.lng }
  }

  const getCoordinateFromMap = (geoMap: google.maps.Map) => {
    if (isEmpty(window?.google)) return
    return { longitude: geoMap?.getCenter()?.lng() ?? 0, latitude: geoMap?.getCenter()?.lat() ?? 0 }
  }

  const getEventCoordinate = (event: any): CoordinateType => {
    return { longitude: parseFloat(event.latLng.lng().toFixed(7)), latitude: parseFloat(event.latLng.lat().toFixed(7)) }
  }

  const panByGeoMap = ({ geoMap, coordinate }: { geoMap: google.maps.Map; coordinate: CoordinateType }) => {
    if (isEmpty(window?.google)) return
    geoMap?.panBy(coordinate.longitude, coordinate.latitude)
  }

  const panToGeoMap = ({ geoMap, coordinate }: { geoMap: google.maps.Map; coordinate: CoordinateType }) => {
    if (isEmpty(window?.google)) return
    geoMap.panTo(new google.maps.LatLng(coordinate.latitude, coordinate.longitude))
  }

  const setZoomGeoMap = ({ geoMap, zoom }: { geoMap: naver.maps.Map; zoom: number }) => {
    if (isEmpty(window?.google)) return
    geoMap.setZoom(zoom)
  }

  const restScriptLoad = async () => {
    if (isEmpty(window?.google)) return
    ;(await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary
  }

  return {
    loadScriptUrl: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLEMAP_KEY}&libraries=places,drawing,marker&v=3.54&callback=onLoadGeoMap`,
    restScriptLoad,
    geoMapKey: process.env.GOOGLEMAP_KEY,
    destroyGeoMap,
    createGeoMap,
    panByGeoMap,
    panToGeoMap,
    setZoomGeoMap,
    addGeoJsonOnGeoMap,
    removeGeoJsonFromGeoMap,
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
