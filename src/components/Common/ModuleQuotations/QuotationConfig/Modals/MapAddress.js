import React from 'react';

// leaflet
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { TileLayer, Marker, Popup } from 'react-leaflet';
import { MapContainerView } from './MapAddress.style'

// icons 
import IconMarker from 'assets/icons/map/CustomMaker.png'

const MakerIcon = L.icon({
    iconUrl: IconMarker,
    iconAnchor: [30, 40],
    popupAnchor: [0, 0],
});

const MapAddress = ({ points = [] }) => {
    return (
        <React.Fragment>
            <MapContainerView center={[4.6527717, -74.0936052]} zoom={7}>
                <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@3x.png"
                />

                {points.length > 0 &&
                    points.map(point =>
                        <Marker position={[point.latitude, point.longitude]} icon={MakerIcon} >
                            <Popup>
                                {point.name}<br /> {point.category}
                            </Popup>
                        </Marker>
                    )
                }
            </MapContainerView>
        </React.Fragment >
    )
}

export default MapAddress