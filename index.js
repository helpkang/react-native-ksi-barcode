'use strict';
import {Component} from 'react'
import {Text} from 'react-native'


import code128 from "./code128"

export default class KsiBarcode extends Component{
    render() {
        const {text, style, ...others } = this.props
        return <Text {...others} style= { [{ color: 'black', fontSize:50, fontFamily: 'code128' }, style, ]} >{ code128(text) }</Text >

    }
}
