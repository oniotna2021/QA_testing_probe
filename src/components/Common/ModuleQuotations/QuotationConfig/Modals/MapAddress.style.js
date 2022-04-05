import Styled from "@emotion/styled";
import { MapContainer } from 'react-leaflet'

export const MapWrapper = Styled.div`
  width: 100%;
`;

export const MapContainerView = Styled(MapContainer)`
    display: flex;
    position: sticky;    
    width: 100%;    
    min-height: 30vh;     
`;
