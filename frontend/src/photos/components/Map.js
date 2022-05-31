import { FaMapMarkerAlt } from 'react-icons/fa';
import GoogleMapReact from "google-map-react";
import classes from "./Map.module.css";

const Map = ({ location, zoomLevel }) => {
  return (
    <div className={classes['google-map']}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin lat={location.lat} lng={location.lng} />
      </GoogleMapReact>
    </div>
  );
};

const LocationPin = ({ text }) => {
  return (
    <div className={classes.pin}>
      <FaMapMarkerAlt />
    </div>
  );
};

export default Map;
