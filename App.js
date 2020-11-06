import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, ProviderPropType, Callout, Polyline } from 'react-native-maps';
// import database from '@react-native-firebase/database';
import firebase from 'firebase';
import database from '@react-native-firebase/database';
import fire from './src/config/firebase';
import AsyncStorage  from '@react-native-community/async-storage';



class DefaultMarkers extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      region: {
        latitude : 1,
        longitude : 1,
        latitudeDelta : 3,
        longitudeDelta : 3
      } ,
      koordinat: [], 
      arah: null
    };

  }
  
  componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          },
          arah: [],
        });
      }
    );
    // setPersistenceEnabled(true) taru ini dibawah sebelum ref
    firebase.database().ref('koordinat').limitToLast(30).on('child_added', (data) => {
      let koordinat = [...this.state.koordinat, data.val()];

     
      this.setState({ koordinat }, () => {
        //buat fungsi polyline diawal
        // let { poly1_latitude, poly1_longitude, tipe } = [...koordinat].pop();
      });
    });
  }

  onPress(e) {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          },
          arah: [],
        });
      }
    );

    const { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          // id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
      this.setState({
        editing: {
          ...editing,
          coordinates: [this.state.region, e.nativeEvent.coordinate],
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          showsUserLocation
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.state.koordinat.map((koordinat, index) => {
            let { latitude, longitude, tipe} = koordinat;
            return (
              <Marker
                ref={(ref) => this.marker = ref}
                key={index}
                identifier={'marker_' + index}
                coordinate={{ latitude, longitude }}
                title={(tipe)}
                onPress={e => this.onPress(e)}
              >
                {tipe === "Lokasi prediksi"  ? <Image source={require('./src/icon/compress/Layer2.png')} style={{width: 31, height: 12}}/> : null}
                
                {tipe === "Lokasi penangkapan"  ? <Image source={require('./src/icon/compress/Layer2banyak.png')} style={{width: 35, height: 20}}/> : null}
              </Marker>
            )
          })}

          {/* ini buat fungsi polyline diawal */}
          {/* {poly1_latitude && (
            <Polyline
              key="editingPolyline"
              coordinates={this.state.editing.coordinates}
              strokeColor="rgba(51,122,328,0.8)"
              fillColor="rgba(51,122,328,0.5)"
              strokeWidth={5}
            />
          )
          } */}
          
          {this.state.editing && (
            <Polyline
              key="editingPolyline"
              coordinates={this.state.editing.coordinates}
              strokeColor="rgba(51,122,328,0.8)"
              fillColor="rgba(51,122,328,0.5)"
              strokeWidth={5}
            />
          )}
        </MapView>
      </View>

    );
  }
}

DefaultMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default DefaultMarkers;
