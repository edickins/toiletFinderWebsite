import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FiltersProvider from '../context/filtersContext/filtersContext';
import DetailPanel from '../components/detailpanel/DetailPanel';
import FilterPanel from '../components/filterpanel/FilterPanel';
import MyMap from '../components/googlemaps/MyMap';
import { useLocationsContext } from '../context/locationContext/locationsContext';
import { ILocation } from '../context/locationContext/types';
import { IMultiMarkerRef } from '../components/googlemaps/components/MultiMarker';
import useGetScreensize, { ScreenSizeEnum } from '../hooks/getScreensize';
import MessagePanelContainer from '../components/filterpanel/MessagePanelContainer';

function Home() {
  const screenSize = useGetScreensize();
  const [detailPanelItem, setDetailPanelItem] = useState<ILocation | undefined>(
    undefined
  );
  const [nearestAlternativeItem, setNearestAlternativeItem] = useState<
    ILocation | undefined
  >(undefined);
  const [messageDialogueProps, setMessageDialogueProps] = useState({
    messageTitle: '',
    message: ''
  });
  const [googleMapRef, setGoogleMapRef] = useState<google.maps.Map | null>(
    null
  );
  const [locationBounds, setLocationBounds] = useState<
    google.maps.LatLngBounds | undefined
  >();

  const mapMarkerRefs = useRef<IMultiMarkerRef[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationID, setLocationID] = useState(searchParams.get('locationID'));
  const {
    state: { locations }
  } = useLocationsContext();

  // pan to a marker location *and* offset for the available screen space
  // to accommodate the panel which will be covering the map
  const panToWithOffset = useCallback(
    (
      latlng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined
    ) => {
      let offsetX = 0;
      let offsetY = 150;

      switch (screenSize) {
        case ScreenSizeEnum.XL:
        case ScreenSizeEnum.LG:
        case ScreenSizeEnum.MD:
          offsetX = -150;
          offsetY = 150;
          break;
        case ScreenSizeEnum.SM:
          offsetX = 0;
          offsetY = 50;
          break;
        case ScreenSizeEnum.XS:
          offsetX = 0;
          offsetY = 10;
          break;
        default:
          offsetX = 0;
          offsetY = 0;
      }

      if (googleMapRef && latlng) {
        const ov = new google.maps.OverlayView();
        ov.onAdd = function onAdd() {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const overlay = this;
          const proj = overlay.getProjection();
          const aPoint: google.maps.Point | null =
            proj.fromLatLngToContainerPixel(
              latlng instanceof google.maps.LatLng
                ? { lat: latlng.lat(), lng: latlng.lng() }
                : latlng
            );
          if (aPoint !== null) {
            aPoint.x += offsetX;
            aPoint.y += offsetY;
            const latLng = proj.fromContainerPixelToLatLng(aPoint);
            if (latLng !== null) {
              if (googleMapRef) {
                setTimeout(() => {
                  googleMapRef?.panTo(latLng);
                }, 500);
              }
            }
          }
        };
        ov.draw = function draw() {};
        ov.setMap(googleMapRef);
      }
    },
    [googleMapRef, screenSize]
  );

  useEffect(() => {
    const newLocationID = searchParams.get('locationID');
    // TODO is this gate necessary?
    if (newLocationID !== locationID) {
      setLocationID(newLocationID);
    }
  }, [locationID, searchParams]);

  // respond to locationID being set in searchParams
  useEffect(() => {
    if (locationID) {
      const location = locations.find((loc) => loc.id === locationID);
      if (location) {
        panToWithOffset(location.geometry.location);
        setDetailPanelItem(location);
        setNearestAlternativeItem(
          locations.find((item) => item.id === location?.nearest_alternative)
        );
      }
    }
  }, [locationID, locations, panToWithOffset]);

  // get the bounds of the area defined by all locations
  useEffect(() => {
    if (googleMapRef) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        const latLng = new google.maps.LatLng(
          location.geometry.location.lat,
          location.geometry.location.lng
        );
        bounds.extend(latLng);
      });
      setLocationBounds(bounds);
    }
  }, [setLocationBounds, locations, googleMapRef]);

  // clickHandler sent via props to MultiMarker
  const onMarkerClicked = (id: string) => {
    if (id) {
      // Create a new URLSearchParams instance to clone the current parameters
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Set the new locationID parameter
      newSearchParams.set('locationID', id);

      // Replace the search parameters - this will be picked up in Home
      setSearchParams(newSearchParams);
    }
  };

  const defaultMapProps = {
    center: { lat: 50.8249486, lng: -0.1270007 },
    zoom: 13
  };

  return (
    <FiltersProvider>
      <main className='flex flex-grow' id='home-main'>
        <MyMap
          items={locations}
          locationID={locationID}
          onMarkerClicked={onMarkerClicked}
          mapMarkerRefs={mapMarkerRefs}
          setGoogleMapRef={setGoogleMapRef}
          defaultMapProps={defaultMapProps}
        />
        <DetailPanel
          item={detailPanelItem}
          nearestAlternativeItem={nearestAlternativeItem}
        />
        <FilterPanel
          setMessageDialogueText={setMessageDialogueProps}
          locationBounds={locationBounds}
          defaultMapProps={defaultMapProps}
        />
        <MessagePanelContainer messageDialogueProps={messageDialogueProps} />
      </main>
    </FiltersProvider>
  );
}

export default Home;
