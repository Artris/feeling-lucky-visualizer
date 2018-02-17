import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import ReactDOM from 'react-dom';

export class GoogleMap extends Component {
  state = { key: '' }
  componentWillMount(){
    this.fetchKey();
  }

  componentDidUpdate(prevProps) {
    let { origin, width, maxHeight, google } = prevProps;
    if (
      (google !== this.props.google || // initial setup
        origin !== this.props.origin) && // when origin changes
      this.props.width === width && // when width changes
      this.props.maxHeight === maxHeight
    ) {
      this.loadMap();
    }
  }

  fetchKey(){
    //Geting the key and storing it in the state.
    fetch('/key')
    .then(res => res.json())
    .then(key => this.setState({key}))
    .catch(err => console.log(err));
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
      height: this.props.maxHeight
    };

    return <div ref="map" style={style} />;
  }
}

export default GoogleApiWrapper({
  apiKey: this.state
})(GoogleMap);
