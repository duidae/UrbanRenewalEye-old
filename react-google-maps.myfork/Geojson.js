"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _flowRight2 = require("lodash/flowRight");

var _flowRight3 = _interopRequireDefault(_flowRight2);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require("create-react-class");

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _constants = require("./constants");

var _enhanceElement = require("./enhanceElement");

var _enhanceElement2 = _interopRequireDefault(_enhanceElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global google */
var controlledPropTypes = {
  // NOTICE!!!!!!
  //
  // Only expose those with getters & setters in the table as controlled props.
  //
  // [].map.call($0.querySelectorAll("tr>td>code", function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data
};

var defaultUncontrolledPropTypes = (0, _enhanceElement.addDefaultPrefixToPropTypes)(controlledPropTypes);

var eventMap = {
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
};

var publicMethodMap = {
  // Public APIs
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data
  //
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
  // END - Public APIs
};

var controlledPropUpdaterMap = {};

function getInstanceFromComponent(component) {
  return component.state[_constants.GEOJSON];
}

exports.default = (0, _flowRight3.default)(_createReactClass2.default, (0, _enhanceElement2.default)(getInstanceFromComponent, publicMethodMap, eventMap, controlledPropUpdaterMap))({
  displayName: "Geojson",

  propTypes: (0, _extends3.default)({}, controlledPropTypes, defaultUncontrolledPropTypes),

  contextTypes: (0, _defineProperty3.default)({}, _constants.MAP, _propTypes2.default.object),

  getInitialState: function getInitialState() {
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data
    var Data = new google.maps.Data();
    Data.loadGeoJson(this.props.url);
    Data.setStyle(this.props.style);
    /*
    Data.loadGeoJson('https://raw.githubusercontent.com/Pentatonic/GoogleVisionOCR/master/TPE/code1.geojson');
    Data.setStyle({
      fillColor: 'green',
      strokeWeight: 1
    });
    */
    Data.setMap(this.context[_constants.MAP]);
    /*
    data1 = new google.maps.Data();
    data1.loadGeoJson(url1);
    // do the same for data2, data3 or whatever
    // create some layer control logic for turning on data1
    data1.setMap(map) // or restyle or whatever
    // hide off data1 and turn on data2
    data1.setMap(null) // hides it
    data2.setMap(map) // displays data2
    */
    return (0, _defineProperty3.default)({}, _constants.GEOJSON, Data);
  },
  componentWillUnmount: function componentWillUnmount() {
    var Data = getInstanceFromComponent(this);
    if (Data) {
      Data.setMap(null);
    }
  },
  render: function render() {
    return false;
  }
});