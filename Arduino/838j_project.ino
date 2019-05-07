// Notes from Noel:
// Build requires upload speed of 115200, and NodeMCU 0.9 board
// You also need to install the ZIP of FirebaseArdunio
// This also requires ArduinoJson library
//
// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// FirebaseDemo_ESP8266 is a sample that demo the different functions
// of the FirebaseArduino API.

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "physical-pacman-digital-maze.firebaseio.com"
#define FIREBASE_AUTH "AZGr9yR4HHVE4sYbfINmzs2r1EviHsAopM0SRIz3"
//#define FIREBASE_HOST "https://hltestforcmsc838.firebaseio.com/"
//#define FIREBASE_AUTH "Qn9pq9uBecgLzH0ycZrLAAn4d2kBwaM9gXw677xw"
#define WIFI_SSID "Henry"
#define WIFI_PASSWORD "umdumdumd"
//#define WIFI_SSID "Noel!"
//#define WIFI_PASSWORD "n8jbme4sq19id"

const int stepPin = 5; //d1
const int dirPin = 4;  //d2
const int stepPin2 = 12;  //d6
const int dirPin2 = 13;  //d7

byte rounds;
byte seconds;
byte dir;
int t;
int stepP;
int moveCommand=1;
int next, stepVal, stepVal2;

void inline servoISR(void){
  next=next+150000;
  timer0_write(next);
  if(moveCommand == 1 || moveCommand ==2 || (moveCommand>=5 && moveCommand <=8)) {
    if (stepVal2 == HIGH) {
      stepVal2 = LOW;
    }
    else { 
      stepVal2 = HIGH;
    }
    digitalWrite(stepPin2,stepVal2);
  }
  if(moveCommand == 3 || moveCommand ==4 || (moveCommand>=5 && moveCommand <=8)){
    if (stepVal == HIGH) {
      stepVal = LOW;
    }
    else { 
      stepVal = HIGH;
    }
    digitalWrite(stepPin,stepVal);
  }
}

void setup() {
  // Sets the two pins as Outputs
  noInterrupts();
  pinMode(stepPin,OUTPUT);
  pinMode(dirPin,OUTPUT);
  pinMode(stepPin2,OUTPUT);
  pinMode(dirPin2,OUTPUT);
  Serial.begin(9600);
/*
    // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setInt("move",-1000);
  moveCommand = Firebase.getInt("move");
  Firebase.stream("/");  
*/
  timer0_isr_init();
  timer0_attachInterrupt(servoISR);
  next=ESP.getCycleCount()+1000;
  timer0_write(next);
  interrupts();
}
void loop() {
  //moveCommand = Firebase.getInt("move");
  /*if (Firebase.failed()) {
    Serial.print("firebase fail ");
    delay(500);
    Serial.println(Firebase.error());
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  }*/
  /*if (Firebase.available()) {
     //FirebaseObject event = Firebase.readEvent();
     moveCommand = Firebase.getInt("move");
     if(moveCommand == 1) {
      digitalWrite(dirPin2,LOW);
     } else if(moveCommand == 2) {
      digitalWrite(dirPin2,HIGH);
     }else if(moveCommand == 3) {
      digitalWrite(dirPin,LOW);
     }else if(moveCommand == 4) {
      digitalWrite(dirPin,HIGH);
     }
  }  
  Serial.println(moveCommand);
 */
 if (Serial.available()) {
     //FirebaseObject event = Firebase.readEvent();
     moveCommand = Serial.read()-'0';
     if(moveCommand == 1) { //move right
      digitalWrite(dirPin2,LOW);
     } else if(moveCommand == 2) { //move left
      digitalWrite(dirPin2,HIGH);
     }else if(moveCommand == 3) { //move up
      digitalWrite(dirPin,LOW);
     }else if(moveCommand == 4) { //move down
      digitalWrite(dirPin,HIGH);
     }
     else if (moveCommand == 5) { //move up-right
      digitalWrite(dirPin, LOW); 
      digitalWrite(dirPin2, LOW);
     }
     else if (moveCommand == 6) { //move up-left
      digitalWrite(dirPin, LOW);      
      digitalWrite(dirPin2, HIGH);
     }
     else if (moveCommand == 7) { //move down-right
      digitalWrite(dirPin, HIGH); 
      digitalWrite(dirPin2, LOW);
     }
     else if (moveCommand == 8) { //move down-left
      digitalWrite(dirPin, HIGH);      
      digitalWrite(dirPin2, HIGH);
     }
  }  
  Serial.println(moveCommand);

 
  
  /*
  rounds = 1;
  seconds = 1;
  if(moveCommand == 1) {
    dir = 'l';
  } else if(moveCommand == 2) {
    dir = 'r';
  }else if(moveCommand == 3) {
    dir = 'u';
  }else if(moveCommand == 4) {
    dir = 'd';
  }else {
    dir = 'n';
  }
  //rounds = Serial.read();
  //dir = Serial.read();
  //seconds = Serial.read();
  //rounds = rounds - '0';
  //seconds = seconds -'0';
  if( dir == 'u') {
    digitalWrite(dirPin,LOW); //move the motor in one direction
  } 
  else {
    digitalWrite(dirPin,HIGH); //move the motor in one direction
  }
  if( dir == 'l') {
    digitalWrite(dirPin2,LOW); //move the motor in one direction
  } 
  else {
    digitalWrite(dirPin2,HIGH); //move the motor in one direction
  }
  if(dir == 'l' || dir == 'r') {
    stepP = stepPin2;
  } else {
    stepP = stepPin;
  }
  t = 2500*seconds/rounds;
  if(dir == 'l' || dir == 'r'||dir == 'u' || dir == 'd') {
    for(int i = 0; i < rounds; i++){
      for(int j = 0; j < 100; j++) {
        digitalWrite(stepP,HIGH);
        delayMicroseconds(t);
        digitalWrite(stepP,LOW);
        delayMicroseconds(t);
      }
    }
    Firebase.setInt("move",-1);
    moveCommand = 0;
    dir = 'n';
    
  }*/
}
