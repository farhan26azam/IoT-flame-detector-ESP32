import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [lastDataId, setLastDataId] = useState(null);

  const schedulePushNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Alert!",
        body: message,
        data: { data: "goes here" },
      },
      trigger: { seconds: 1 },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://192.168.97.248:5000/flame")
        .then((response) => {
          // Check if there's new data
          if (response.data.length > 0 && response.data[0]._id !== lastDataId) {
            schedulePushNotification(response.data[0].status);
            setLastDataId(response.data[0]._id); // Update the last data ID
          }
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setError(error);
        });
    }, 1000); // 1000 milliseconds = 1 second

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [lastDataId]);

  // Define getStatusStyle function here
  const getStatusStyle = (status) => {
    return status === "Flame Detected"
      ? styles.flameDetected
      : styles.normalStatus;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>SmartFire</Text>
        <Text style={styles.subHeader}>Flame Detection System</Text>
        {data.length > 0 ? (
          data.map((item, index) => (
            <View key={index} style={styles.dataItem}>
              <Text style={[styles.dataText, getStatusStyle(item.status)]}>
                ALERT: {item.status}
              </Text>
              <Text style={styles.timestampText}>
                Timestamp: {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        ) : error ? (
          <Text style={styles.errorText}>
            Error fetching data. Please check your server.
          </Text>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0074f0", // Using white as the primary background color
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20, // Added padding for better spacing
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Using #0074f0 for headers
    textAlign: "center",
    marginVertical: 5,
    marginTop: 80,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Using #0074f0 for headers
    textAlign: "center",
    marginVertical: 10,
  },
  dataItem: {
    backgroundColor: "#fff", // White cards
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0074f0", // Border color #0074f0
    shadowColor: "#0074f0", // Shadow in theme color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red", // Dark text for contrast
    marginBottom: 5, // Space between status and timestamp
  },
  timestampText: {
    fontSize: 16,
    color: "#666", // Slightly lighter color for timestamps
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#0074f0",
    textAlign: "center",
  },
  flameDetected: {
    fontWeight: "bold",
    color: "red",
  },
  normalStatus: {
    // Styles for normal status
  },
});
