#include <Arduino.h>
#include <ArduinoBLE.h>
#include <Arduino_HTS221.h>

// Function predefinitions
void changeSpeed(int newSpeed);
void changeMode(int newMode);
int sensorReadingToSpeedStage(int sensorValue);

// Fan speed changes based on temperature sensor or user given value
enum Mode {
  AUTO_MODE,
  USER_MODE
};

#define FET_GATE D3 // Pin D3 controls FET gate with PWM (F.e. Fan's current flow 50 % of time => half speed)
#define TEMP_SENSOR A1  // Temperature sensor on analog pin A1

Mode mode = USER_MODE;  // Default mode
int speed = 0;   // Speed stages 0 - 4

int temperature = 0;
int humidity = 0;

int analogSteps[] = { 200, 400, 600, 800, 1024 }; // Five speed stages for values of analogRead (0-1024)
int pwmSteps[] = { 0, 63, 126, 190, 255 };  // Five speed stages for PWM output values (0-255)

BLEService speedService("180A"); // BLE Service
BLEByteCharacteristic speedCharacteristic("2A67", BLERead | BLEWrite);  // GATT name "Location and Speed"
BLEByteCharacteristic modeCharacteristic("2BA3", BLERead | BLEWrite); // GATT name = "Media state"
BLEByteCharacteristic temperatureCharasteristic("2A6E", BLERead | BLENotify); // GATT name = "Temperature"
BLEByteCharacteristic humidityCharasteristic("2A6F", BLERead | BLENotify);  // GATT name = "Humidity"

void setup() {
  Serial.begin(9600);
  pinMode(TEMP_SENSOR, INPUT);
  pinMode(FET_GATE, OUTPUT);

  if (!HTS.begin()) {
    Serial.println("Failed to initialize humidity temperature sensor!");
  }

  if (!BLE.begin()) {
    Serial.println("- Starting Bluetooth® Low Energy module failed!");
    while (1);
  }

  BLE.setLocalName("Nano 33 BLE Sense");
  BLE.setAdvertisedService(speedService);

  // add the characteristics to the service
  speedService.addCharacteristic(speedCharacteristic);  // Fan speed (0 - 4)
  speedService.addCharacteristic(modeCharacteristic); // Mode (0 = AUTO, 1 = USER)
  speedService.addCharacteristic(temperatureCharasteristic);  // Temperature data
  speedService.addCharacteristic(humidityCharasteristic); // Humidity data

  // add service
  BLE.addService(speedService);

  // set the initial value for the characteristic:
  speedCharacteristic.writeValue(0);  // Default speed = 0
  modeCharacteristic.writeValue(1); // Default mode = USER

  // start advertising
  BLE.advertise();
}

void loop() {
  BLEDevice central = BLE.central();

  // Read sensor values
  int newTemperature = HTS.readTemperature();
  int newHumidity = HTS.readHumidity();

  if (central.connected()) {
    if (speedCharacteristic.written()) {  // User has send new speed
      Serial.println("Written to speed");
      int newSpeed = speedCharacteristic.value();
      changeSpeed(newSpeed);
    }
    if (modeCharacteristic.written()) { // User has send new mode
        Serial.println("Written to mode");
        int newMode = modeCharacteristic.value();
        changeMode(newMode);
    }
    if (temperature != newTemperature) {  // If temperature has changed, notify master
        temperature = newTemperature;
        temperatureCharasteristic.writeValue(newTemperature);
    }
    if (humidity != newHumidity) {  // If humidity has changed, notify master
        humidity = newHumidity;
        humidityCharasteristic.writeValue(newHumidity);
    }
  }

  switch(mode) {
    case AUTO_MODE: {
      int sensorValue = analogRead(TEMP_SENSOR);
      analogWrite(FET_GATE, pwmSteps[sensorReadingToSpeedStage(sensorValue)]);
      break;
    }

    case USER_MODE: {
      analogWrite(FET_GATE, pwmSteps[speed]);
      break;
    }
  }
}

void changeMode(int newMode) {
  if (newMode == 0) {
    mode = AUTO_MODE;
  } else if (newMode == 1) {
    mode = USER_MODE;
  }
}

void changeSpeed(int newSpeed) {
  if (newSpeed >= 0  && newSpeed < 5) {
    speed = newSpeed;
  }
}

int sensorReadingToSpeedStage(int sensorReading) {
  int speedStage = 0;
  while (sensorReading > analogSteps[speedStage]) {
    speedStage++;
  }

  return speedStage;
}