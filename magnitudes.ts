export class Temperature {

    private temperatureKelvin: number;

    constructor(temperatureKelvin?: number, temperatureCelsius?: number) {
        if (temperatureKelvin != undefined) {
            this.temperatureKelvin = temperatureKelvin;
        } else if (temperatureCelsius != undefined) {
            this.temperatureKelvin = temperatureCelsius + 273.15;
        } else {
            this.temperatureKelvin = 0;
        }
    }
    get c(): number {
        return this.temperatureKelvin - 273.15;
    }

    set c(value: number) {
        this.temperatureKelvin = value + 273.15;
        if (this.temperatureKelvin < 0) {
            throw new Error("Temperature below absolute zero");
        }
    }

    get K(): number {
        return this.temperatureKelvin;
    }

    set K(value: number) {
        this.temperatureKelvin = value;
    }

}

export class RelativeHumidity {
    constructor(private relativeHumidity: number) { }

    set percent(value: number) {
        this.relativeHumidity = value;
        if (this.relativeHumidity < 0 || this.relativeHumidity > 100) {
            throw new Error("Relative humidity must be between 0 and 100");
        }
    }

    get percent(): number {
        return this.relativeHumidity;
    }

    get fraction(): number {
        return this.relativeHumidity / 100;
    }
}

export class Speed {
    private speedms: number;
    constructor() { }

    set ms(value: number) {
        this.speedms = value;
    }

    get ms(): number {
        return this.speedms;
    }

    set kmh(value: number) {
        this.speedms = value / 3.6;
    }

    get kmh(): number {
        return this.speedms * 3.6;
    }

}

export class WetAir {

    static readonly C8 = -5800.2206;
    static readonly C9 = 1.3914993;
    static readonly C10 = - 0.048640239;
    static readonly C11 = 4.1764768E-05;
    static readonly C12 = - 1.4452093E-08;
    static readonly C13 = 6.5459673;
    static readonly RV = 0.4614010099889;
    static readonly RA = 0.28670504137931;
    static readonly PATM = 101325.0;

    static readonly a = 17.625;
    static readonly b = 243.04;

    constructor(public dryBulbTemperature: Temperature, public airRelativeHumidity: RelativeHumidity) {}

    get absoluteWater() {

        let pvs = Math.exp(WetAir.C8 / this.dryBulbTemperature.K + WetAir.C9 + WetAir.C10 * this.dryBulbTemperature.K + WetAir.C11 * this.dryBulbTemperature.K ** 2 + WetAir.C12 * this.dryBulbTemperature.K ** 3 + WetAir.C13 * Math.log(this.dryBulbTemperature.K)); 

        let pv = pvs * this.airRelativeHumidity.fraction;

        let w = WetAir.RV/WetAir.RA * pv / (WetAir.PATM - pv) * 1000;

        let d = pv / (WetAir.RV * this.dryBulbTemperature.K);

        return w;
    }

    get dewTemperature() {
        
        let pvs = Math.exp(WetAir.C8 / this.dryBulbTemperature.K + WetAir.C9 + WetAir.C10 * this.dryBulbTemperature.K + WetAir.C11 * this.dryBulbTemperature.K ** 2 + WetAir.C12 * this.dryBulbTemperature.K ** 3 + WetAir.C13 * Math.log(this.dryBulbTemperature.K)); 

        let pv = pvs * this.airRelativeHumidity.fraction;

        let alpha = (t: Temperature, rh: RelativeHumidity) => Math.log(rh.fraction) + WetAir.a*t.c/(WetAir.b + t.c);

        let ts = WetAir.b * alpha(this.dryBulbTemperature, this.airRelativeHumidity) / (WetAir.a - alpha(this.dryBulbTemperature, this.airRelativeHumidity));

        return ts;
    }


    removeHeat(heatPerKg:number) {

        let specificHeat = 1005 + 1.82 * this.absoluteWater;

        let newSensibleTemperature = this.dryBulbTemperature.K - heatPerKg / specificHeat;

        if (newSensibleTemperature > this.dewTemperature) {
            
            let ratioHumidityIncrease = (this.dryBulbTemperature.K - this.dewTemperature) / (this.dryBulbTemperature.K - newSensibleTemperature);
            this.dryBulbTemperature.K = newSensibleTemperature;

        }
    }
}