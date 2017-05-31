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
                <div key={'urban' + i}>
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
            center: { lat: 24.985854476804, lng: 121.55429918361 },
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
                {
                    //http://twland.ronny.tw/index/search?lands[]=臺北市,華興段三小段,141
                    paths: [
                        {
                            "lat": 24.985892654871,
                            "lng": 121.55384976076
                        },
                        {
                            "lat": 24.985873733201,
                            "lng": 121.55379447147
                        },
                        {
                            "lat": 24.985860790847,
                            "lng": 121.55380444302
                        },
                        {
                            "lat": 24.985846141297,
                            "lng": 121.55381904241
                        },
                        {
                            "lat": 24.985815455747,
                            "lng": 121.55384924635
                        },
                        {
                            "lat": 24.985761038096,
                            "lng": 121.55369249155
                        },
                        {
                            "lat": 24.985744384764,
                            "lng": 121.55370885189
                        },
                        {
                            "lat": 24.985626851341,
                            "lng": 121.55383365214
                        },
                        {
                            "lat": 24.98562353384,
                            "lng": 121.55383751423
                        },
                        {
                            "lat": 24.985620522659,
                            "lng": 121.55384163053
                        },
                        {
                            "lat": 24.985617740986,
                            "lng": 121.55384600071
                        },
                        {
                            "lat": 24.985615265947,
                            "lng": 121.55385054083
                        },
                        {
                            "lat": 24.985613020728,
                            "lng": 121.55385525054
                        },
                        {
                            "lat": 24.985611082144,
                            "lng": 121.55386013018
                        },
                        {
                            "lat": 24.985609527325,
                            "lng": 121.55386509582
                        },
                        {
                            "lat": 24.985608202325,
                            "lng": 121.55387023106
                        },
                        {
                            "lat": 24.985607261089,
                            "lng": 121.5538754523
                        },
                        {
                            "lat": 24.985606627117,
                            "lng": 121.55388067492
                        },
                        {
                            "lat": 24.985606300093,
                            "lng": 121.55388598319
                        },
                        {
                            "lat": 24.985606280331,
                            "lng": 121.55389129283
                        },
                        {
                            "lat": 24.985606644962,
                            "lng": 121.55389651992
                        },
                        {
                            "lat": 24.985607316541,
                            "lng": 121.55390183267
                        },
                        {
                            "lat": 24.98560829601,
                            "lng": 121.55390697823
                        },
                        {
                            "lat": 24.985842243819,
                            "lng": 121.55486538213
                        },
                        {
                            "lat": 24.985843761279,
                            "lng": 121.55487044585
                        },
                        {
                            "lat": 24.985845663444,
                            "lng": 121.55487534272
                        },
                        {
                            "lat": 24.985848027447,
                            "lng": 121.55487998882
                        },
                        {
                            "lat": 24.985850776471,
                            "lng": 121.55488438381
                        },
                        {
                            "lat": 24.985853910829,
                            "lng": 121.5548884434
                        },
                        {
                            "lat": 24.985857353393,
                            "lng": 121.55489225153
                        },
                        {
                            "lat": 24.98586118192,
                            "lng": 121.5548955557
                        },
                        {
                            "lat": 24.985865242466,
                            "lng": 121.5548984395
                        },
                        {
                            "lat": 24.985869535029,
                            "lng": 121.55490090294
                        },
                        {
                            "lat": 24.98587405961,
                            "lng": 121.55490294601
                        },
                        {
                            "lat": 24.985878740023,
                            "lng": 121.5549043998
                        },
                        {
                            "lat": 24.985883499137,
                            "lng": 121.55490534827
                        },
                        {
                            "lat": 24.985888336639,
                            "lng": 121.55490587567
                        },
                        {
                            "lat": 24.986015835407,
                            "lng": 121.55488992872
                        },
                        {
                            "lat": 24.985986407522,
                            "lng": 121.55476817802
                        },
                        {
                            "lat": 24.986043126696,
                            "lng": 121.55476059434
                        },
                        {
                            "lat": 24.986042366863,
                            "lng": 121.55473775055
                        },
                        {
                            "lat": 24.986041164981,
                            "lng": 121.55470984788
                        },
                        {
                            "lat": 24.986102673276,
                            "lng": 121.55471577075
                        },
                        {
                            "lat": 24.986088508501,
                            "lng": 121.5546208901
                        },
                        {
                            "lat": 24.986077123038,
                            "lng": 121.55454287832
                        },
                        {
                            "lat": 24.986074475002,
                            "lng": 121.55453199408
                        },
                        {
                            "lat": 24.986058432194,
                            "lng": 121.55446694082
                        },
                        {
                            "lat": 24.986054592782,
                            "lng": 121.55444593743
                        },
                        {
                            "lat": 24.986038170355,
                            "lng": 121.5543590535
                        },
                        {
                            "lat": 24.986021520571,
                            "lng": 121.55427132575
                        },
                        {
                            "lat": 24.98599648841,
                            "lng": 121.55418608891
                        },
                        {
                            "lat": 24.98597615915,
                            "lng": 121.55411688671
                        },
                        {
                            "lat": 24.985970529705,
                            "lng": 121.55410211217
                        },
                        {
                            "lat": 24.985947166001,
                            "lng": 121.55404326306
                        },
                        {
                            "lat": 24.985941341557,
                            "lng": 121.55401896381
                        },
                        {
                            "lat": 24.985922495243,
                            "lng": 121.55394344719
                        },
                        {
                            "lat": 24.985902362008,
                            "lng": 121.55394537974
                        },
                        {
                            "lat": 24.985900925097,
                            "lng": 121.55393930502
                        },
                        {
                            "lat": 24.985890876126,
                            "lng": 121.55389425355
                        },
                        {
                            "lat": 24.985897666678,
                            "lng": 121.55386537534
                        },
                        {
                            "lat": 24.985892654871,
                            "lng": 121.55384976076
                        }
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
