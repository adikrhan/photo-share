import { useRef, useEffect } from "react";

import classes from "./Map.module.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({
      position: center,
      map: map,
    });
  }, [center, zoom]);

  return <div ref={mapRef} className={classes.map}></div>;
};

export default Map;
