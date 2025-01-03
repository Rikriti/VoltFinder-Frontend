import React, { useEffect } from 'react';
import '../styles/GoogleMapView.css';
function GoogleMapView({ stations, center }) {
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 14,
    });

    stations.forEach((station) => {
      new window.google.maps.Marker({
        position: {
          lat: station.geometry.location.lat,
          lng: station.geometry.location.lng,
        },
        map: map,
        title: station.name,
      });
    });
  }, [stations, center]);

  return <div id="map" className="map"></div>;
}

export default GoogleMapView;
