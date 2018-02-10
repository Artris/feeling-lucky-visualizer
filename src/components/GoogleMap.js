import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import config from '../config.json';
import ReactDOM from 'react-dom';

export class GoogleMap extends Component {
  componentDidUpdate(prevProps) {
    let { origin, width, google } = prevProps;
    if (
      (google !== this.props.google || //initial setup
        origin !== this.props.origin) && //when origin changes
      this.props.width === width //when width changes
    ) {
      this.loadMap();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google, destination, origin } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      this.map = new maps.Map(node, {
        scrollwheel: false,
        zoom: 14,
        gestureHandling: 'cooperative'
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();

      directionsDisplay.setMap(this.map);

      let request = {
        origin: new google.maps.LatLng(origin.latitude, origin.longitude),
        destination: new google.maps.LatLng(
          destination.latitude,
          destination.longitude
        ),
        travelMode: 'TRANSIT'
      };

      directionsService.route(request, function(result, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
    }
  }

  render() {
    const style = {
      width: this.props.width,
      height: 400
    };

    return <div ref="map" style={style} />;
  }
}

export default GoogleApiWrapper({
  apiKey: config.key
})(GoogleMap);
