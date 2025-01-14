import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useManualOrdersCreate, useManualSitesList, useNodesList } from '@/api/generated/hooks'
import { AdminManualOrderCreateReqRequest, AdminSiteRes, NodeRes, SiteRes } from '@/api/generated/types'
import GeoMapContainer, { MapEventEnum, MarkerEnum, MarkerStyle } from '@/containers/GeoMapContainer'
import useDropDown, { DropDownContentType } from '@/hooks/common/useDropDown'
import useShopsListAll from '@/hooks/query/useShopsListAll'
import { MapEnum } from '@/hooks/useGeoMap'
import { CoordinateType } from '@/types/geoMap.type'
import { ApiUtils } from '@/utils/apiUtils'

type ManualOrderFormType = AdminManualOrderCreateReqRequest & {
  selectedSite?: AdminSiteRes | SiteRes
  selectedNode?: NodeRes
  searchText?: string
}

const defaultSiteCoordinate: CoordinateType = {
  longitude: 127.043824,
  latitude: 37.546603
}

const useOrderManualRegister = () => {
  const manualOrderFormControls = useForm<ManualOrderFormType>({
    mode: 'onChange'
  })
  const { resetField, setValue } = manualOrderFormControls
  const selectedSite = manualOrderFormControls.watch('selectedSite')
  const selectedNode = manualOrderFormControls.watch('selectedNode')
  const searchText = manualOrderFormControls.watch('searchText')
  const [searchedGeoLocation, setSearchedGeoLocation] = useState<CoordinateType>()
  const destinationDropDownControls = useDropDown()

  // sites
  const { data: manualSites } = useManualSitesList()

  // shops
  const { shopsList: shops } = useShopsListAll({
    queryParams: { sites: [...(selectedSite ? [selectedSite.id] : [])] },
    enabled: !!selectedSite
  })

  // nodes
  const { data: nodes } = useNodesList(
    {
      siteSlug: selectedSite?.slug || '',
      isDestination: true,
      isOrigin: false,
      ...(selectedSite && {
        position: JSON.stringify({
          latitude: selectedSite.centerLatitude,
          longitude: selectedSite.centerLongitude,
          distance: 20
        })
      }),
      ...(searchedGeoLocation && {
        position: JSON.stringify({
          ...searchedGeoLocation,
          distance: 20
        })
      })
    },
    { query: { enabled: !!selectedSite?.slug } }
  )

  useEffect(() => {
    if (!nodes) return
    const optionList = nodes.map((node) => ({ id: String(node.id), content: node.name }))
    destinationDropDownControls.setOptionList(optionList)
    const handleChangeDropDown = (selectedItem?: DropDownContentType) => {
      const selectedNode = nodes?.find((node) => selectedItem?.id === String(node.id))
      setValue('selectedNode', selectedNode)
      selectedNode && panTo({ latitude: selectedNode.latitude, longitude: selectedNode.longitude })
      selectedNode?.nodeNumber && setValue('destinationNodeNumber', selectedNode.nodeNumber)
    }
    destinationDropDownControls.setChangeCallback((selectedItem) => handleChangeDropDown(selectedItem))
  }, [nodes])

  const { initGeoMap, drawMarker, panTo, removeMarker, geoMap, isGeoMapLoaded, mapType } =
    GeoMapContainer.useContainer()

  useEffect(() => {
    if (!isGeoMapLoaded) return
    initGeoMap({
      ...defaultSiteCoordinate,
      mapTypeControl: false
    })
  }, [isGeoMapLoaded])

  useEffect(() => {
    if (!isGeoMapLoaded) return
    if (!selectedSite || !selectedSite.slug) {
      initGeoMap({
        ...defaultSiteCoordinate,
        mapTypeControl: false
      })
      setValue('siteSlug', '')
    } else {
      if (!selectedSite?.centerLatitude || !selectedSite?.centerLongitude) return
      initGeoMap({
        longitude: selectedSite.centerLongitude,
        latitude: selectedSite.centerLatitude,
        mapTypeControl: false
      })
      setValue('siteSlug', selectedSite.slug)
    }

    destinationDropDownControls.setSelectedItem(undefined)
    resetField('searchText')
    resetField('shop')
    setSearchedGeoLocation(undefined)
  }, [selectedSite])

  /**
   * 주소 검색 기능은 구글지도에서는 장소들의 명칭들이 구글지도에 등록되어 있지 않은 경우가 많아 사용을 하지 않습니다.
   */
  const searchAddress = () => {
    if (!selectedSite) {
      alert('사이트를 선택해주세요.')
      return
    }
    if (mapType !== MapEnum.GoogleMap || !geoMap) return
    if (!searchText) {
      alert('주소를 입력해주세요.')
      return
    }
    const request = {
      query: searchText,
      fields: ['name', 'geometry']
    }
    const service = new google.maps.places.PlacesService(geoMap as google.maps.Map)
    service.findPlaceFromQuery(request, (response, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (!response?.[0].geometry?.location?.lat() || !response?.[0].geometry?.location?.lng()) return
        const searchedAddressCoordinate: CoordinateType = {
          latitude: response?.[0].geometry?.location?.lat(),
          longitude: response?.[0].geometry?.location?.lng()
        }
        setSearchedGeoLocation(searchedAddressCoordinate)

        // 이전에 검색한 마커가 있으면 지웁니다.
        if (searchedGeoLocation) {
          removeMarker({
            removeMarkerTypes: [MarkerEnum.Searched]
          })
          removeMarker({
            removeMarkerTypes: [MarkerEnum.Location],
            removeMarkerCoordinate: searchedAddressCoordinate
          })
        }

        panTo(searchedAddressCoordinate)
        drawMarker({
          zIndex: 10,
          ...searchedAddressCoordinate,
          markerType: MarkerEnum.Searched,
          markerMarkup: MarkerStyle[MarkerEnum.Searched](searchText),
          onClickListener: () => {
            panTo(searchedAddressCoordinate)
          },
          mapEventType: MapEventEnum.ClickSearchedNode
        })
      }
    })
  }

  // 불러온 노드들에 대해서 마커 생성
  useEffect(() => {
    if (!geoMap || !nodes) return

    nodes?.forEach((node) => {
      drawMarker({
        zIndex: 0,
        markerMarkup: MarkerStyle[MarkerEnum.Location](node.name),
        markerType: MarkerEnum.Location,
        latitude: node.latitude,
        longitude: node.longitude,
        mapEventType: MapEventEnum.ClickLocationNode,
        onClickListener: () => {
          panTo({ longitude: node.longitude, latitude: node.latitude })
          destinationDropDownControls.setSelectedItem({ id: String(node.id), content: node.name })
        }
      })
    })

    return () => {
      removeMarker({ removeMarkerTypes: [MarkerEnum.Selected, MarkerEnum.Location] })
      destinationDropDownControls.setSelectedItem(undefined)
    }
  }, [nodes, geoMap])

  useEffect(() => {
    if (!geoMap || !selectedNode) return

    removeMarker({
      removeMarkerTypes: [MarkerEnum.Location],
      removeMarkerCoordinate: { latitude: selectedNode.latitude, longitude: selectedNode.longitude }
    })
    // 새롭게 선택된 노드는 기존에 Location 노드로 그려진 것을 지우고 Selected 타입의 노드로 다시 그려줍니다.
    drawMarker({
      zIndex: 20,
      markerMarkup: MarkerStyle[MarkerEnum.Selected](selectedNode.name),
      markerType: MarkerEnum.Selected,
      latitude: selectedNode.latitude,
      longitude: selectedNode.longitude,
      mapEventType: MapEventEnum.ClickSelectedNode,
      onClickListener: () => {
        panTo({ longitude: selectedNode.longitude, latitude: selectedNode.latitude })
      }
    })

    return () => {
      // 이전에 선택된 노드가 있다면 해당 노드는 지우고 일반 마커로 다시 그려줍니다.
      const prevSelectedNode = selectedNode
      removeMarker({ removeMarkerTypes: [MarkerEnum.Selected] })
      drawMarker({
        zIndex: 0,
        markerMarkup: MarkerStyle[MarkerEnum.Location](prevSelectedNode.name),
        markerType: MarkerEnum.Location,
        latitude: prevSelectedNode.latitude,
        longitude: prevSelectedNode.longitude,
        mapEventType: MapEventEnum.ClickLocationNode,
        onClickListener: () => {
          panTo({ longitude: prevSelectedNode.longitude, latitude: prevSelectedNode.latitude })
          destinationDropDownControls.setSelectedItem({
            id: String(prevSelectedNode.id),
            content: prevSelectedNode.name
          })
        }
      })
    }
  }, [selectedNode])

  const { mutateAsync: mutateManualOrderCreate } = useManualOrdersCreate({
    mutation: {
      onSuccess: (data) => {
        const { dispatchSuccess, dispatchMessage } = data
        if (!dispatchSuccess) {
          alert(dispatchMessage)
        }
      },
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })

  return {
    destinationDropDownControls,
    manualSites,
    manualOrderFormMethods: manualOrderFormControls,
    shops,
    searchAddress,
    nodes,
    mutateManualOrderCreate,
    panTo
  }
}

export default useOrderManualRegister
