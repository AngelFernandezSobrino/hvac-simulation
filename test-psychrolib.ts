import { Psychrometrics } from './psychrolib';

let psychro: any = new (Psychrometrics as any)

// Set unit system
psychro.SetUnitSystem(psychro.SI)
// Calculate the dew point temperature for a dry bulb temperature of 25 C and a relative humidity of 80%
var TDewPoint = psychro.GetTDewPointFromRelHum(25.0, 0.80);



console.log('TDewPoint: %d', TDewPoint);
