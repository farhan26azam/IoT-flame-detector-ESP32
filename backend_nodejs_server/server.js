const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI =
  "YOUR_MONGODB_URI";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error(err));

// Define a Schema and Model
const Schema = mongoose.Schema;
const flameSensorSchema = new Schema({
  status: String,
  timestamp: Date,
});
const FlameSensor = mongoose.model("FlameSensor", flameSensorSchema);

// MQTT Client Setup
const mqttOptions = {
  username: "", // Replace with your MQTT broker username
  password: "", // Replace with your MQTT broker password
};

// MQTT Client Setup
const mqttClient = mqtt.connect("mqtt://YOUR_MOSQUITTO_BROKER_ADDRESS", mqttOptions);

mqttClient.on("connect", () => {
  mqttClient.subscribe("test", (err) => {
    if (!err) {
      console.log("Successfully subscribed to the topic");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  const messageString = message.toString();
  console.log(`Received message: ${messageString}`);

  let messageData;
  try {
    messageData = messageString;
  } catch (e) {
    console.error("Unable to parse the message", e);
    return;
  }

  // Check if a flame is detected before saving to the database
  if (messageData === "Flame Detected at Location 1") {
    const newSensorData = new FlameSensor({
      status: messageData,
      location: "Living Room",
      timestamp: new Date(),
    });

    newSensorData
      .save()
      .then((data) => console.log("Data saved:", data))
      .catch((err) => console.error("Error saving data:", err));
  }
});

// Express Routes
app.get("/flame", async (req, res) => {
  const data = await FlameSensor.find();
  res.json(data);
});

app.post("/flame", async (req, res) => {
  const newData = new FlameSensor({
    status: req.body.status,
    location: "Living Room",
    timestamp: new Date(),
  });
  await newData.save();
  res.json(newData);
});

// Start the Express Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
