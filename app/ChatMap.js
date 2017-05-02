import canUseDOM from "can-use-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import DataManager from './DataManager';
import {
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    TrafficLayer,
    Circle,
    Polygon,
} from 'react-google-maps';

let dataMgr = new DataManager();

const geolocation = (
    canUseDOM && navigator.geolocation ?
        navigator.geolocation :
        ({
            getCurrentPosition(success, failure) {
                failure(`Your browser doesn't support geolocation.`);
            },
        })
);

const UserLocationGoogleMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={12}
        defaultCenter={{ lat: 0, lng: 0 }}
        center={props.center}
    /*onClick={props.onMapClick}*/
    >
        {props.markers.map(marker => (
            <Marker {...marker}>
                <div>{marker.content}</div>
            </Marker>
        ))}

        {props.infos.map(info => (
            <InfoWindow {...info}>
                <div>{info.content}</div>
            </InfoWindow>
        ))}

        {props.polygons.map((polygon, i) => {
            const onClick = (event) => {
                console.log(event, polygon)
                props.onPolygonClick(event, polygon);
            }
            const onCloseClick = () => props.onPolygonCloseClick(polygon);


            return (
                <div key={'urban'+i}>
                    <Polygon
                        paths={polygon.paths}
                        options={{
                            fillColor: 'red',
                            fillOpacity: 0.20,
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 0.5,
                        }}
                        onClick={onClick}
                        key={'poly' + i}
                    />
                    {polygon.position != null && (
                        <InfoWindow
                            position={polygon.position}
                            onCloseClick={onCloseClick}
                            key={'polyInfo' + i}
                        >
                            <div>
                                區域座標: <br />
                                {JSON.stringify(polygon.paths)}
                            </div>
                        </InfoWindow>
                    )}
                </div>
            );
        })}

        {/*<TrafficLayer autoUpdate />*/}

        <Circle
            center={{ lat: 24.94, lng: 121.52 }}
            radius={500}
            options={{
                fillColor: 'red',
                fillOpacity: 0.20,
                strokeColor: 'red',
                strokeOpacity: 1,
                strokeWeight: 0.5,
            }}
        />

    </GoogleMap>
));

export default class ChatMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: [
                /*
                {
                    position: {
                        lat: 25.0112183,
                        lng: 121.52067570000001,
                    },
                    key: `Taiwan`,
                    defaultAnimation: 3,
                },
                {
                    position: {
                        lat: 30.0112183,
                        lng: 121.52067570000001,
                    },
                    key: `Taiwan2`,
                    defaultAnimation: 3,
                },
                */
            ],
            infos: [],
            center: { lat: 25, lng: 121 },
            polygons: [
                {
                    paths: [
                        { lat: 25 - 0.01, lng: 121.5 - 0.01 },
                        { lat: 25 - 0.01, lng: 121.5 + 0.01 },
                        { lat: 25 + 0.01, lng: 121.5 + 0.01 },
                        { lat: 25 + 0.01, lng: 121.5 - 0.01 },
                    ],
                    position: null,
                },
                {
                    paths: [
                        // Bermuda triangle
                        { lat: 25.774, lng: -80.190 },
                        { lat: 18.466, lng: -66.118 },
                        { lat: 32.321, lng: -64.757 },
                    ],
                    position: null,
                },
            ]
        };

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
        this.handlePolygonClick = this.handlePolygonClick.bind(this);
        this.handlePolygonCloseClick = this.handlePolygonCloseClick.bind(this);
        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
    }

    componentDidMount() {
        // Send current position to server
        geolocation.getCurrentPosition((position) => {
            console.log(position);
            dataMgr.connect();
            dataMgr.registerCbUpdateLocations(this.handleLocationUpdate);
            dataMgr.sendLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        }, (reason) => {
            console.log(reason);
        });
    }

    handleLocationUpdate(data) {
        let newCenter = this.state.center;
        let nextMarkers = data.map((d, i) => {
            if (d) {
                if (d.username == dataMgr.getUsername() && d.location != null) {
                    newCenter = d.location;
                }
                return {
                    position: d.location,
                    key: 'key' + i,
                    defaultAnimation: 3,
                    title: d.username,
                };
            }
        });
        console.log(JSON.stringify(nextMarkers));
        console.log(JSON.stringify(newCenter));
        this.setState({
            markers: nextMarkers,
            center: newCenter
        });
    }

    handleMapLoad(map) {
        this._mapComponent = map;
        if (map) {
            console.log(map.getZoom());
        }
    }

    /*
     * This is called when you click on the map.
     * Go and try click now.
     */
    handleMapClick(event) {
        const nextMarkers = [
            ...this.state.markers,
            {
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
            },
        ];
        this.setState({
            markers: nextMarkers,
        });

        if (nextMarkers.length === 3) {
            //alert("right click to remove");
            return;
            this.props.toast(
                `Right click on the marker to remove it`,
                `Also check the code!`
            );
        }
    }

    handleMarkerRightClick(targetMarker) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        //const nextMarkers = this.state.markers.filter(function(marker){return  marker === targetMarker});
        this.setState({
            markers: nextMarkers,
        });
    }

    handlePolygonClick(event, targetPolygon) {

        if (!targetPolygon.position) {
            const newPolygons = this.state.polygons.map(polygon => {
                if (polygon === targetPolygon) {
                    return {
                        paths: polygon.paths,
                        position: event.latLng, // For info window display usage
                        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
                    };
                }
                return polygon;
            });

            this.setState({
                polygons: newPolygons,
            });
        }
    }

    handlePolygonCloseClick(targetPolygon) {
        const newPolygons = this.state.polygons.map(polygon => {
            if (polygon === targetPolygon) {
                return {
                    paths: polygon.paths,
                    position: null,
                };
            }
            return polygon;
        });
        this.setState({
            polygons: newPolygons,
        });
    }

    render() {
        return (
            <div style={{ height: `100%`, width: '100%' }}>
                <UserLocationGoogleMap
                    containerElement={
                        <div style={{ height: `100%`, width: '100%' }} />
                    }
                    mapElement={
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: -1,
                        }} />
                    }
                    onMapLoad={this.handleMapLoad}
                    onMapClick={this.handleMapClick}
                    onMarkerRightClick={this.handleMarkerRightClick}
                    onPolygonClick={this.handlePolygonClick}
                    onPolygonCloseClick={this.handlePolygonCloseClick}
                    center={this.state.center}
                    markers={this.state.markers}
                    infos={this.state.infos}
                    polygons={this.state.polygons}
                />
            </div>
        );
    }
}
