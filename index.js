'use strict';
var React = require('react');
var ReactNative = require('react-native');

var {
    Text,
} = ReactNative;

import code128 from "./code128"

export default React.createClass({
    render() {
        const {text, style, ...others } = this.props
        return <Text {...others} style= { [{ color: 'black', fontSize:50, fontFamily: 'code128' }, style, ]} >{ code128(text) }</Text >

    }
})
