import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const wsUrl = 'ws://10.233.35.31:8080'; // Replace with your WebSocket server address

const KandyLiveApp: React.FC = () => {
  const [liveLocation, setLiveLocation] = useState({
    latitude: 6.9313,
    longitude: 79.8467,
  });

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (event) => {
      const rawData = event.data;
      console.log('Raw Data:', rawData);

      try {
        const data = JSON.parse(rawData);
        setLiveLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: liveLocation.latitude,
            longitude: liveLocation.longitude,
          }}
          title="Live Location"
        />
      </MapView>
      <Text style={styles.infoText}>Live Location on Map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KandyLiveApp;
