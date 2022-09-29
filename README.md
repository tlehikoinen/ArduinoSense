# ArduinoSense  
Controlling Arduino Nano from Android application and using phone as a gateway to database.  


## Original project idea  
Plan was to improve previously done [project](https://github.com/tlehikoinen/Arduino/tree/master/AdjustableDCFan) that controls fan speed either based on temperature or user selection.  
Fan speed could be then controlled from Android application and data from sensors could be saved to cloud for further analysis. 

## Technologies    
Arduino Nano 33 BLE was chosen as a development board and it was programmed using PlatformIO.  
Mobile application was programmed using Android Studio.  
Backend server was developed with Node.js and PostgreSQL was used as a database.

## Features 

#### Arduino Nano 33 BLE  
- Measures temperature and humidity and sends this data to phone
- PWM controls LED brightness based on temperature or user selection from phone

#### Backend (server)  
- Users can register and login
- Registered users can save temperature and humidity data
- Uses JWT to validate requests
- Saves data to PostgreSQL database

#### Android (mobile app)
- Connects to Arduino using Bluetooth Low Energy (BLE) and to backend with internet connection
- Works as a gateway between Arduino and backend
- Application allows users to:
  - Register and login
  - See temperature and humidity values from Arduino Nano
  - Control LED's brigthness
  - Look at history of data

# Pictures

#### Arduino and LED
<img src="https://github.com/tlehikoinen/ArduinoSense/blob/main/pics/nano_led.JPG" width="500" height="435" />

#### Mobile application  
<img src="https://github.com/tlehikoinen/ArduinoSense/blob/main/pics/arduino_login.JPG" width="220" height="500" />&nbsp; <img src="https://github.com/tlehikoinen/ArduinoSense/blob/main/pics/arduino.JPG" width="220" height="500" />&nbsp; <img src="https://github.com/tlehikoinen/ArduinoSense/blob/main/pics/data.JPG" width="220" height="500" />

#### Backend html documentation
<img src="https://github.com/tlehikoinen/ArduinoSense/blob/main/pics/arduino_sense_rip.JPG" width="800" height="415" />

# Project members  
This was done as a final project for mobile development course by:  
Aaro Kinnunen &  
Tommi Lehikoinen &  
Robert Hidri  


# Misc  
This repository combines three repositories originally used in development:  
https://github.com/tlehikoinen/arduino-sense  
https://github.com/tlehikoinen/arduino-sense-backend  
https://github.com/AaroKinnunen/Android_Arduino  
