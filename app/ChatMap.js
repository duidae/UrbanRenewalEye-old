import canUseDOM from "can-use-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import DataManager from './DataManager';
import ChatDialog from './ChatDialog';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import land_info from './renewal_units200.js';

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

        {land_info.features.map((polygon, i) => {
            let coords = [];
            let geo = polygon.geometry;
            if (geo && geo.coordinates[0] && geo.coordinates[0][0]) {
                coords = geo.coordinates[0][0].map((coord) => {
                    return {
                        lat: coord[1],
                        lng: coord[0],
                    };
                });
            }
            {/*console.log(JSON.stringify(coords));*/}


            return (
                <Polygon
                    paths={coords}
                    options={{
                        fillColor: 'red',
                        fillOpacity: 0.20,
                        strokeColor: 'red',
                        strokeOpacity: 1,
                        strokeWeight: 0.5,
                    }}
                    onClick={(event) => {
                        console.log(event, polygon);
                        props.onPolygonClick(event, i);
                    }}
                    key={'poly' + i}
                />
            );
        })}

        {props.landInfoWindow.position != null && (
            <InfoWindow
                position={props.landInfoWindow.position}
                onCloseClick={() => props.onPolygonCloseClick()}
                key={'polyInfo'}
            >
                <div>
                    <h3>單元名稱</h3>
                    <div className="btn-toolbar">
                        <button className='btn btn-primary' onClick={() => props.onChatClick()}>聊聊</button>
                        <button className='btn btn-primary' onClick={() => props.onLandDetailClick(props.landInfoWindow.landIndex)}>詳細</button>
                    </div>
                </div>
            </InfoWindow>
        )}

        {props.popupDetail != null && (
            <ModalContainer onClose={() => props.onLandDetailCloseClick()}>
                <ModalDialog onClose={() => props.onLandDetailCloseClick()} style={{ left: '800px' }}>
                    <h2>詳細資料</h2>
                    <p className="panel-body pre-scrollable" style={{ width: '500px', height: '600px' }}>
                        區域座標: <br />
                        {JSON.stringify(props.popupDetail, null, 2)}
                    </p>
                </ModalDialog>
            </ModalContainer>
        )}

        {props.popupChat == true && (
            <ModalContainer onClose={() => props.onChatCloseClick()}>
                <ModalDialog onClose={() => props.onChatCloseClick()} style={{ width: '800px', backgroundColor: '#EEEEEE' }}>
                    <ChatDialog></ChatDialog>
                </ModalDialog>
            </ModalContainer>
        )}

        {/*<Circle
            center={{ lat: 24.94, lng: 121.52 }}
            radius={500}
            options={{
                fillColor: 'red',
                fillOpacity: 0.20,
                strokeColor: 'red',
                strokeOpacity: 1,
                strokeWeight: 0.5,
            }}
        />*/}

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
            center: { lat: 24.985854476804, lng: 121.55429918361 },
            // polygons: land_info.features,
            popupDetail: null,
            popupChat: false,
            landInfoWindow: {
                position: null,
                landIndex: 0
            }
        };

        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
        this.handlePolygonClick = this.handlePolygonClick.bind(this);
        this.handlePolygonCloseClick = this.handlePolygonCloseClick.bind(this);

        this.handleLandDetailClick = this.handleLandDetailClick.bind(this);
        this.handleLandDetailCloseClick = this.handleLandDetailCloseClick.bind(this);
        this.handleChatClick = this.handleChatClick.bind(this);
        this.handleChatCloseClick = this.handleChatCloseClick.bind(this);
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

    handlePolygonClick(event, i) {
        this.setState({
            landInfoWindow: {
                position: event.latLng,
                landIndex: i
            }
        });
    }

    handlePolygonCloseClick() {
        this.setState({
            landInfoWindow: {
                position: null,
                landIndex: 0
            }
        });
    }

    handleLandDetailClick(targetPolygon) {
        this.setState({
            popupDetail: land_info.features[this.state.landInfoWindow.landIndex].properties
        });
    }

    handleLandDetailCloseClick() {
        this.setState({
            popupDetail: null
        });
    }

    handleChatClick(targetPolygon) {
        this.setState({
            popupChat: true
        });
    }

    handleChatCloseClick() {
        this.setState({
            popupChat: false
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
                    //onMapClick={this.handleMapClick}
                    //onMarkerRightClick={this.handleMarkerRightClick}
                    onPolygonClick={this.handlePolygonClick}
                    onPolygonCloseClick={this.handlePolygonCloseClick}
                    onLandDetailClick={this.handleLandDetailClick}
                    onLandDetailCloseClick={this.handleLandDetailCloseClick}
                    onChatClick={this.handleChatClick}
                    onChatCloseClick={this.handleChatCloseClick}
                    center={this.state.center}
                    markers={this.state.markers}
                    infos={this.state.infos}
                    //polygons={this.state.polygons}
                    popupDetail={this.state.popupDetail}
                    popupChat={this.state.popupChat}
                    landInfoWindow={this.state.landInfoWindow}
                />
            </div>
        );
    }
}
