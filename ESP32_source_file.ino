#include <WiFi.h>
#include <PubSubClient.h>

// Replace with your network credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your broker address
const char* brokerAddress = "MOSQUITTO_BROKER_ADDRESS";
const char* brokerUser = "MOSQUITTO_BROKER_USERNAME";
const char* brokerPass = "MOSQUITTO_BROKER_PASSWORD";

//TODO
// Replace with your topic
const char* topic = "YOUR_DESIRED_TOPIC";

// Pin connected to the flame sensor (assuming digital output)
const int flameSensorPin = 4;  // Replace with the actual pin number

WiFiClient espClient;
PubSubClient client(espClient);

void connectToWiFi() {
  delay(100);
  Serial.print("\n Establishing connection to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println("\nConnected to");
  Serial.println(ssid);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT broker connection...");
    if (client.connect("location1/room1", brokerUser, brokerPass)) {
      Serial.println("Connected to MQTT Broker");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying connection...");
      delay(10000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();

  pinMode(flameSensorPin, INPUT);  // Initialize flame sensor pin as input

  client.setServer(brokerAddress, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read the state of the flame sensor
  int flameDetected = digitalRead(flameSensorPin);
  String flameStatus = flameDetected == LOW ? "Flame Detected!!!" : "No Flame Detected";  // Assuming LOW means flame detected

  // Publish flame status at regular intervals
  static unsigned long lastPublishTime = 0;
  if (millis() - lastPublishTime > 5000) { 
    Serial.print("Sending Flame Sensor Status: ");
    Serial.println(flameStatus);
    client.publish(topic, {flameStatus.c_str()});
    lastPublishTime = millis();
  }

  delay(100);  // Short delay to prevent excessive looping
}