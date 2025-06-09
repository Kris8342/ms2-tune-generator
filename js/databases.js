const injectorDatabase = {
    'Ford_19lb_Yellow': {
        size: 19,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 1.0,
        batteryCorrection: 0.2,
        flowVsPressure: {30: 17, 40: 19, 50: 21, 60: 22},
        notes: 'Stock Ford 5.0L injectors - yellow tops',
        maxHP: 190,
        recommendedUse: ['street', 'mild_performance']
    },
    'Ford_24lb_Green': {
        size: 24,
        type: 'EV1', 
        impedance: 'High-Z',
        deadtime: 0.8,
        batteryCorrection: 0.2,
        flowVsPressure: {30: 22, 40: 24, 50: 26, 60: 28},
        notes: 'Ford Explorer 5.0L injectors - green tops',
        maxHP: 240,
        recommendedUse: ['street', 'street_performance']
    },
    'Bosch_42lb_Green': {
        size: 42,
        type: 'EV1',
        impedance: 'High-Z', 
        deadtime: 0.6,
        batteryCorrection: 0.15,
        flowVsPressure: {30: 38, 40: 42, 50: 46, 60: 49},
        notes: 'Bosch 42lb Green Giants - very popular',
        maxHP: 420,
        recommendedUse: ['street_performance', 'street_strip', 'track']
    }
};

const coilDatabase = {
    'Ford_TFI': {
        type: 'Distributor',
        dwellTime: 3.0,
        maxRPM: 6500,
        notes: 'Stock Ford TFI distributor',
        settings: {
            dwellControl: 'voltage_based',
            sparkOutput: 'going_high'
        }
    }
};

const widebandDatabase = {
    'AEM_30-4110': {
        type: 'Bosch LSU 4.9',
        voltage: '0-5V',
        afrRange: '10.0-20.3',
        notes: 'AEM 30-4110 wideband controller',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 10.0,
            highAFR: 20.3
        }
    }
};

const knownCombos = {
    'Ford_302_X303_34lb': {
        engine: {
            displacement: 306,
            cylinders: 8,
            compression: 9.0,
            family: 'Ford_302'
        },
        camshaft: {
            profile: 'performance',
            duration: 224,
            lift: 0.477,
            lsa: 112
        },
        fuel: {
            injectorModel: 'Bosch_42lb_Green',
            fuelPressure: 39,
            fuelType: '91'
        },
        ignition: {
            coilType: 'Ford_TFI',
            revLimit: 6500
        },
        tuneParams: {
            requiredFuel: 6.2,
            revLimit: 6500,
            afrProfile: 'street_performance',
            timingProfile: 'conservative',
            notes: 'Popular street/strip combo, proven reliable'
        }
    }
};

const afrProfiles = {
    'street': {
        idle: 14.7,
        cruise: 15.5,
        acceleration: 13.2,
        wot: 12.5,
        warmup: 13.5,
        description: 'Economy focused street driving'
    },
    'street_performance': {
        idle: 14.7,
        cruise: 15.0,
        acceleration: 12.8,
        wot: 12.2,
        warmup: 13.2,
        description: 'Balanced street performance'
    }
};

const timingProfiles = {
    'conservative': {
        idle: 15,
        cruise: 32,
        power: 28,
        redline: 25,
        advance_rate: 'slow',
        description: 'Safe for pump gas'
    },
    'moderate': {
        idle: 18,
        cruise: 36,
        power: 32,
        redline: 28,
        advance_rate: 'medium',
        description: 'Good balance of performance and safety'
    }
};

const fuelPumpDatabase={'Walbro_255':{flow:'255 LPH',pressure:'43.5 psi',maxHP:400,fuelType:'gasoline',voltage:'12V',notes:'Walbro 255 - supports up to 400hp, very reliable',powerConsumption:'6-8 amps'},'Walbro_450':{flow:'450 LPH',pressure:'58 psi',maxHP:700,fuelType:'gasoline',voltage:'12V',notes:'Walbro 450 - high performance, supports serious power',powerConsumption:'12-15 amps'},'Aeromotive_340':{flow:'340 LPH',pressure:'60 psi',maxHP:500,fuelType:'gasoline/E85',voltage:'12V',notes:'Aeromotive Stealth 340 - E85 compatible, quiet operation',powerConsumption:'8-10 amps'},'stock':{flow:'Unknown',pressure:'Standard',maxHP:200,fuelType:'gasoline',voltage:'12V',notes:'Stock fuel pump - adequate for stock applications',powerConsumption:'4-6 amps'}};


console.log('databases.js loaded successfully');
