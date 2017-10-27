import React, { Component } from 'react'
import {Well, Row, Col, Image} from 'react-bootstrap';
//import Places from './places.js';
import ReactStars from 'react-stars'
import NoImage from './images/No_Image_Available.jpg'; 

class Map extends Component{
  constructor(props){
    super(props);
    this.state={
                position: {lat: 37.782703500000004, lng: -122.4194},
                places: [],
                allPlaces: [],
                getDetails: null,
                detailMarker: null,
                placeDetails: null,
                shouldUpdate: true
              }
    //this.performSearch = this.performSearch.bind(this);
  }
  componentDidMount() {
    this.map = new window.google.maps.Map(this.refs.map, {
      center: this.state.position,
      zoom: 7
    });

    const map = this.map;
    const input = document.getElementById('placeInput');
    const searchBox = new window.google.maps.places.SearchBox(input);
    const infoWindow = new window.google.maps.InfoWindow();
    const service = new window.google.maps.places.PlacesService(this.map);

    const getDetails = (request) => {
      service.getDetails(request, detailsCallback);
    }
    const detailsCallback = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.state.allPlaces.forEach(place => {
          if (place.place.geometry.location.lat() !== results.geometry.location.lat() ||
          place.place.geometry.location.lng() !== results.geometry.location.lng()) {
            place.marker.setMap(null);
          }
        });
        this.setState({placeDetails: results});
      }
    }
    
    const serviceCallback = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }
     service.nearbySearch({
      location: this.state.position,
      radius: 500,
      type: ['store']
    }, serviceCallback);

    const createMarker = (place) => {
      
      const photos = place.photos;
          if (!photos) {
            return;
          }
      const marker = new window.google.maps.Marker({
          map: map,
          position: place.geometry.location,
          title: place.name,
          rating: place.rating,
          icon: photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
        });
      window.google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
      });
    }

     map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
    //

    searchBox.addListener('places_changed', () => {

      this.state.allPlaces.forEach(place => {
        place.marker.setMap(null);
      });

      const places = searchBox.getPlaces();
      let allPlaces = [];
      if(places.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => {
        if(!place.geometry) return;
        const icon = {
          url: place.icon,
          size: new window.google.maps.Size(71, 71),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          scaledSize: new window.google.maps.Size(25, 25)
        };

        const marker = new window.google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        });

        allPlaces.push({
          place: place,
          marker: marker
        });

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      this.setState({ allPlaces: allPlaces, 
        places: allPlaces,
        getDetails: getDetails,
        shouldUpdate: true });

      map.fitBounds(bounds);

      const updatePlaces = () => {
        let newPlaces = [];

        let bounds = new window.google.maps.LatLngBounds();
        bounds = map.getBounds();

        this.state.allPlaces.forEach(place => {
          if (bounds.contains(place.marker.getPosition())) {
            newPlaces.push(place);
          }
        });
        this.setState({places: newPlaces, shouldUpdate: false});
      };

      window.google.maps.event.addListener(map,'bounds_changed', updatePlaces);
    })

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        this.setState({position: pos});
      });
    }

  }
  
  render(){
    return (  
    <Well>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
           <div id='map'ref="map" style={{height: '600px', width: '100%'}}></div>
        </Col>
        <Col mdOffset={4} lgOffset={4} md={4} lg={4} xs={12} sm={12}>
           <input id="placeInput" className="search-box" type="text" placeholder="Search here!" />
        </Col>
         <Col xs={8} sm={8} md={8} lg={8} mdOffset={2} lgOffset={2} xsOffset={2} smOffset={2} style={{'textAlign':'center'}}>
           <h2> Jelp </h2>
           <hr />
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-cutlery" aria-hidden="true"></i> Food</p>
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-truck" aria-hidden="true"></i> Groceries</p>
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-car" aria-hidden="true"></i> Automobile</p>
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-bed" aria-hidden="true"></i> Hotels </p>
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-university" aria-hidden="true"></i> Places </p>
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
              <p><i className="fa fa-glass" aria-hidden="true"></i> Restaurants </p>
            </Col>
        </Col>
        <Col xs={12} sm={12} md={10} lg={10} mdOffset={1} lgOffset={1} className="podsArea">
         

            {this.state.allPlaces && this.state.allPlaces.map(function(data,i){
              return <Col xs={12} sm={12} md={3} lg={3} mdOffset={1} lgOffset={1} className="pod-container"key={i}>
                      
                        {data.place.photos && data.place.photos.length > 0 ? <Image className="place-img" src={data.place.photos[0].getUrl({ maxWidth: 340, maxHeight: 300 })}/> : <Image className="place-img" src={NoImage}/>}
                        <Col xs={12} sm={12} md={12} lg={12} className="pod-text">
                          <p className="name">{data.place.name}</p>
                          <p><i className="fa fa-address-card" aria-hidden="true"></i> Address: {data.place.formatted_address}</p>
                          <p> Rating: {data.place.rating}
                            <ReactStars count={data.place.rating} edit={false} onChange={data.place.rating} color1={'#f15c00'} size={16}/>
                          </p>  
                            <p><i className="fa fa-phone" aria-hidden="true"></i> Phone: {data.place.international_phone_number}</p>

                          {(data.place.website) ? <p>website: <a href={data.place.website} >{data.place.website}</a></p> : <p>website: none</p>}
                          <p> Price: {data.place.price_level}
                            <ReactStars count={data.place.price_level} char={<i class="fa fa-usd" aria-hidden="true"></i>} edit={false} onChange={data.place.rating} color1={'#f15c00'} size={16}/>
                          </p>
                          <p> Office Hours:</p>
                          {data.place.opening_hours && data.place.opening_hours.weekday_text.length > 0 ? data.place.opening_hours.weekday_text.map(function(i) {
                              return <p key={i}>{i}</p>
                          }) : <p> none </p>}
                        </Col>
                      
                      </Col>
            })}
          
        </Col>
      </Row>
    </Well>
    )
  }
}

export default Map