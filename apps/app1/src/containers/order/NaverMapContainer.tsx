import { useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'

export enum MarkerType {
  SiteCenter = 'SiteCenter',
  Selected = 'Selected',
  Location = 'Location'
}

const markerStyle: { [key in MarkerType]: string } = {
  [MarkerType.SiteCenter]: 'text-error',
  [MarkerType.Selected]: 'text-info',
  [MarkerType.Location]: 'text-gray-400'
}

const getNodeMarker = (type: MarkerType, name: string) => {
  const size = type === MarkerType.Selected ? '2.8rem' : '1.4rem'
  return `<div class="flex flex-col items-center gap-[5px] ${markerStyle[type]}">
            <svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4 10.2C4 5.69801 7.55535 2 12 2C16.4446 2 20 5.69801 20 10.2C20 12.4965 18.9859 14.5068 17.613 16.3405C16.4671 17.871 15.0003 19.3666 13.5411 20.8543C13.2654 21.1355 12.99 21.4163 12.717 21.6971C12.5287 21.8907 12.2701 22 12 22C11.7299 22 11.4713 21.8907 11.283 21.6971C11.01 21.4163 10.7346 21.1355 10.4589 20.8543C8.99974 19.3666 7.53292 17.871 6.38702 16.3405C5.01406 14.5068 4 12.4965 4 10.2ZM9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10Z" fill="currentColor" />
            </svg>
            <span class="text-[10px] font-bold text-black">${name}</span>
          </div>`
}

const NaverMapContainer = createContainer(() => {
  const [isNaverMapLoad, setIsNaverMapLoad] = useState(false)
  const [naverMap, setNaverMap] = useState<naver.maps.Map>()
  const markers = useRef<naver.maps.Marker[]>([])

  const setNaverMapLoadFlag = () => {
    setIsNaverMapLoad(true)
  }

  const initNaverMap = (latitude?: number, longitude?: number, zoom = 16) => {
    if (!isNaverMapLoad || !latitude || !longitude) return
    if (naverMap) {
      naverMap.destroy()
    }
    const options: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(latitude, longitude),
      zoom
    }
    const map = new naver.maps.Map('map', options)
    setNaverMap(map)
  }

  const moveTo = (x: number, y: number, zoom?: number) => {
    naverMap?.panTo(new naver.maps.LatLng(x, y), {
      duration: 300
    })
    if (zoom) {
      naverMap?.setZoom(zoom)
    }
  }

  const createMarker = (name: string, latitude: number, longitude: number) => {
    if (!naverMap) return

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map: naverMap,
      icon: {
        content: getNodeMarker(MarkerType.SiteCenter, name)
      }
    })
    marker.setMap(naverMap)
    markers.current.push(marker)
    return marker
  }

  const addClickListener = (target: naver.maps.Marker, clickListener: (event: any) => void) => {
    if (!target) {
      return
    }
    try {
      naver.maps.Event.addListener(target, 'click', (event: any) => clickListener(event))
    } catch (e) {
      console.log(e, 'ERR:: Add Click Listener')
    }
  }

  const drawNodeMarkers = ({
    latitude,
    longitude,
    name,
    type
  }: {
    latitude: number
    longitude: number
    name: string
    type: MarkerType
  }) => {
    if (!naverMap) return

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map: naverMap,
      icon: {
        content: getNodeMarker(type, name)
      }
    })
    marker.setMap(naverMap)
    markers.current.push(marker)
    return marker
  }

  const removeMarkers = () => {
    //  마커 지우고 마커 초기화
    markers.current.forEach((marker) => marker.setMap(null))
    markers.current = []
  }

  const removeMarker = (marker: naver.maps.Marker) => {
    const markerX = marker.getPosition().x
    const markerY = marker.getPosition().y
    markers.current = markers.current.filter((marker) => {
      const location = marker.getPosition()
      return !(location.x === markerX && location.y === markerY)
    })
    marker.setMap(null)
    return
  }

  useEffect(() => {
    if (!process.env.NAVERMAP_KEY) {
      alert('navermap api not defined')
      return
    }
    const $script = document.createElement('script')
    $script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVERMAP_KEY}&submodules=drawing,geocoder&autoload=false`
    $script.addEventListener('load', setNaverMapLoadFlag)
    document.head.appendChild($script)

    return () => {
      $script.removeEventListener('load', setNaverMapLoadFlag)
    }
  }, [])

  return {
    isNaverMapLoad,
    naverMap,
    setNaverMap,
    markers,
    initNaverMap,
    drawNodeMarkers,
    removeMarkers,
    removeMarker,
    addClickListener,
    createMarker,
    moveTo
  }
})

export default NaverMapContainer
