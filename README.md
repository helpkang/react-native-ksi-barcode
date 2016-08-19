# react-native-ksi-barcode

barcode code128 generator

* install
```
npm i -S react-native-ksi-barcode
```

* native setup
```
rnpm link react-native-ksi-barcode
```

* using
```
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import KsiBarcode from "react-native-ksi-barcode"

class barcodetest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <KsiBarcode text="ME2T53DPC"/>
        <KsiBarcode text="1212121"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('barcodetest', () => barcodetest);
```

Component is Text View extended.  
pops is text attribute appended. 
