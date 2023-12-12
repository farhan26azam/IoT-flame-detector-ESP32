# IoT Flame Detector with ESP32

## Overview
This project is an IoT-based flame detection system using ESP32. It involves an ESP32 microcontroller detecting flames using a sensor, a Node.js backend server for processing and storing data, and a React Native frontend application for real-time monitoring.

## Components
- **ESP32 Microcontroller**: Reads flame sensor data and publishes it to an MQTT topic.
- **Node.js Backend Server**: Listens for MQTT messages and stores data in MongoDB.
- **React Native Frontend App**: Displays flame detection data and sends notifications.

## Setup and Installation

### Prerequisites
- ESP32 microcontroller
- Flame sensor module
- Node.js and npm
- MongoDB
- React Native environment

### Setting Up Mosquitto MQTT Broker
To set up the Mosquitto MQTT broker locally, follow the instructions in this YouTube tutorial: [Setting up Mosquitto MQTT Broker](https://www.youtube.com/watch?v=hyJhKWhxAxA). This video provides a comprehensive guide on installing and configuring Mosquitto on your local machine.

### Configuring the ESP32
1. Update the `ESP32_source_file.ino` with your WiFi credentials and MQTT broker details.
2. Upload the sketch to your ESP32.

### Running the Backend Server
1. Navigate to the `backend_nodejs_server` directory.
2. Install dependencies: `npm install`.
3. Start the server: `npm start`.

### Setting Up the Frontend App
1. Navigate to the `reactnative_frontend_app` directory.
2. Install dependencies: `npm install`.
3. Run the app: `npm start`.

## Usage
Once all components are set up and running, the ESP32 will start sending flame detection data to the MQTT broker. The backend server will process this data and store it in MongoDB. The React Native app will display the data and alert users in real-time if a flame is detected.

## Contributing
Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## Contact
For any queries or contributions, please contact farhan26azam@gmail.com.

---

*This README is a basic guide to get started with the IoT Flame Detector project. For more detailed information, please refer to the individual component documentation.*


