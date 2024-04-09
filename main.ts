
import { RelativeHumidity, Speed, Temperature, WetAir } from "./magnitudes";

// Simulation static parameters

let recirculatedAirFlow = 2600/3600; // m3/s

let outsideAirFlow = 1100/3600; // m3/s
let outsideAirTemperature = 16; // °C
let outsideAirHumidity = 80; // %

// Outside air absolute humidity



let totalAirFlow = recirculatedAirFlow + outsideAirFlow;

let roomAirVolume = 10000; // m3

let roomAirDensity = 1.2; // kg/m3

let roomAirSpecificHeat = 1005; // J/(kg*K)

let roomAirMass = roomAirVolume * roomAirDensity; // kg

let peopleHeat = 100; // W

let roomBoundariesHeat = -20; // W

// Simulation parameters

let simulationTime = 3600; // s

let simulationTimeStep = 1; // s


// Global model variables

let simulationTimeCurrent = 0; // s

let roomAir: WetAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60)); // °C

let AhuMixedAire: WetAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60)); // °C

let AhuAfterCoolingCoilAir: WetAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60)); // °C

let AhuAfterCoolingSupportCoilAir: WetAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60)); // °C

let AhuAfterHeatingCoilAir: WetAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60)); // °C

let AhuSupplyAir = AhuAfterHeatingCoilAir;
let AhuReciculatedAir = roomAir;
let AhuOutsideAir: WetAir = new WetAir(new Temperature(undefined, outsideAirTemperature), new RelativeHumidity(outsideAirHumidity)); // °C

// HVAC system symulation 

// Air handling unit (AHU) model






// Energy balance for room air, discretized in time, considering thermal energy flows and air mass flows of the HVAC system

// Room air model

let roomAirTemperatureOld = roomAirTemperature; // °C

let roomAirTemperatureNew = roomAirTemperature; // °C

let roomAirTemperatureDelta = 0; // °C


// Room heat input from HVAC air flow

