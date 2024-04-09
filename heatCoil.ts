import { WetAir, Temperature, RelativeHumidity, Speed } from "./magnitudes";

import Constants from "./constants";

class heatCoil {
    private waterFlow: number = 0; // m3/s
    private readonly inputWaterTemperature: number; // °C
    private readonly alphaCoefficient: number; // W/(m2*K)
    private readonly heatTransferSurface: number; // m2
    private readonly coilMass: number; // kg
    private readonly coilSpecificHeat: number; // J/(kg*K)
    private readonly waterToCoilHeatTransferCoefficient: number; // W/(m2*K)


    private readonly coilDiameter: number; // m

    private readonly discretizationPoints: number; // m

    outputWaterTemperature: number; // °C

    private waterTemperatureOnCoil: Array<number>; // °C

    private steelTemperatureOnCoil: Array<number>; // °C
    
    constructor() {}

    airHeatTransfer(inputAir: WetAir, airFlow: number): WetAir {

        let outputAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60));
        return outputAir;
    }

    heatTransferWaterToCoil() {
        for (let i = 0; i < this.discretizationPoints; i++) {
        }

    }

    updateWaterTemperaturePositionOnCoil() {
        this.outputWaterTemperature = this.waterTemperatureOnCoil[this.discretizationPoints];
        for (let i = 1; i < this.discretizationPoints; i++) {
            this.waterTemperatureOnCoil[i+1] = this.waterTemperatureOnCoil[i];
        }
        this.waterTemperatureOnCoil[0] = this.inputWaterTemperature;
    }

    get waterSpeed(): Speed {
        let speed = new Speed();
        speed.ms = this.waterFlow / (Math.PI * (this.coilDiameter/2) ** 2);
        return speed;
    }

}

export class heatCoilModel {

    private readonly inputWaterTemperature: number; // °C
    private readonly alphaCoefficient: number; // W/(m2*K)
    private readonly heatTransferSurface: number; // m2
    private readonly coilMass: number; // kg
    private readonly coilSpecificHeat: number; // J/(kg*K)
    private readonly waterToCoilHeatTransferCoefficient: number; // W/(m2*K)

    private readonly waterMass: number; // kg

    private waterMeanTemperature: number; // °C
    private steelMeanTemperature: number; // °C

    public heatWaterToMetal: number; // W
    public heatExternalToWater: number; // W

    public heatMetalToAir: number; // W
    public heatAirToMetal: number; // W


    private readonly coilDiameter: number; // m

    private readonly discretizationPoints: number; // m

    outputWaterTemperature: number; // °C

    constructor() {}

    airHeatTransfer(inputAir: WetAir, airFlow: number): WetAir {

        let outputAir = new WetAir(new Temperature(undefined, 20), new RelativeHumidity(60));
        return outputAir;
    }

    heatTransferWaterToCoil() {
        for (let i = 0; i < this.discretizationPoints; i++) {
        }

    }

    heatTransfer(airFlow: number, inputAirState: WetAir, outputAirState: WetAir, waterFlow: number) {

        this.heatWaterToMetal = this.waterToCoilHeatTransferCoefficient * (this.waterMeanTemperature - this.steelMeanTemperature);

        this.heatExternalToWater = waterFlow * Constants.waterSpecificHeat * (this.inputWaterTemperature - this.waterMeanTemperature);

        this.heatMetalToAir = this.alphaCoefficient * this.heatTransferSurface * (this.steelMeanTemperature - inputAirState.dryBulbTemperature.c);

        this.outputWaterTemperature = this.inputWaterTemperature - this.heatWaterToMetal / (waterFlow * Constants.waterSpecificHeat);

        this.waterMeanTemperature = (this.inputWaterTemperature + this.outputWaterTemperature) / 2;

        this.waterMeanTemperature = this.waterMeanTemperature - this.heatWaterToMetal / (this.waterMass * Constants.waterSpecificHeat);

        this.steelMeanTemperature = this.steelMeanTemperature + this.heatWaterToMetal / (this.coilMass * this.coilSpecificHeat);

        airOutput.removeHeat(this.heatMetalToAir/airFlow);

    }

}