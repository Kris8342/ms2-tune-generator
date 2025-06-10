// MS2/Extra Tune Generator - Component Database
// Easy to add new components - just add entries at the bottom of each section

// ===== INJECTOR DATABASE =====
// Add new injectors here - copy format below
const injectorDatabase = {
    'Ford_19lb_Yellow': {
        size: 19,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 1.0,
        batteryCorrection: 0.2,
        flowVsPressure: { 30: 17, 40: 19, 50: 21, 60: 22 },
        notes: 'Stock Ford 5.0L injectors - yellow tops, very reliable',
        maxHP: 190,
        recommendedUse: ['street', 'mild_performance']
    },
    
    'Ford_24lb_Green': {
        size: 24,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 0.8,
        batteryCorrection: 0.2,
        flowVsPressure: { 30: 22, 40: 24, 50: 26, 60: 28 },
        notes: 'Ford Explorer 5.0L injectors - green tops, popular upgrade',
        maxHP: 240,
        recommendedUse: ['street', 'street_performance']
    },
    
    'Ford_30lb_Blue': {
        size: 30,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 0.7,
        batteryCorrection: 0.2,
        flowVsPressure: { 30: 28, 40: 30, 50: 32, 60: 34 },
        notes: 'Ford Cobra injectors - blue tops, excellent street/strip',
        maxHP: 300,
        recommendedUse: ['street_performance', 'street_strip']
    },
    
    'Bosch_42lb_Green': {
        size: 42,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 0.6,
        batteryCorrection: 0.15,
        flowVsPressure: { 30: 38, 40: 42, 50: 46, 60: 49 },
        notes: 'Bosch 42lb "Green Giants" - very popular performance choice',
        maxHP: 420,
        recommendedUse: ['street_performance', 'street_strip', 'track']
    },
    
    'Delphi_60lb_Multec': {
        size: 60,
        type: 'EV6',
        impedance: 'High-Z',
        deadtime: 0.5,
        batteryCorrection: 0.1,
        flowVsPressure: { 30: 55, 40: 60, 50: 65, 60: 69 },
        notes: 'Delphi Multec 2 - modern EV6 style, excellent atomization',
        maxHP: 600,
        recommendedUse: ['track', 'drag_racing', 'high_performance']
    },
    
    'Siemens_80lb': {
        size: 80,
        type: 'EV6',
        impedance: 'High-Z',
        deadtime: 0.45,
        batteryCorrection: 0.1,
        flowVsPressure: { 30: 72, 40: 80, 50: 87, 60: 93 },
        notes: 'Siemens 80lb - high flow for serious power applications',
        maxHP: 800,
        recommendedUse: ['drag_racing', 'high_performance', 'turbo']
    },
    
'InjectorDynamics_1050X': {
    size: 105,
    type: 'EV14',
    impedance: 'High-Z',
    deadtime: 0.38,
    batteryCorrection: 0.11,
    flowVsPressure: { 40: 105, 45: 110, 50: 115, 60: 125 },
    notes: 'ID1050X – E85 compatible, excellent atomization, modern EV14',
    maxHP: 1050,
    recommendedUse: ['street_performance', 'track', 'turbo', 'e85']
},

'InjectorDynamics_2000cc': {
    size: 210,
    type: 'EV14',
    impedance: 'High-Z',
    deadtime: 0.40,
    batteryCorrection: 0.10,
    flowVsPressure: { 40: 200, 50: 215, 60: 230 },
    notes: 'ID2000 – For very high‑power forced‑induction builds',
    maxHP: 2000,
    recommendedUse: ['drag_racing', 'turbo', 'high_performance', 'e85']
}
};

// ===== COIL DATABASE =====
// Add new coils here
const coilDatabase = {
    'Ford_TFI': {
        type: 'Distributor',
        dwellTime: 3.0,
        chargingTime: 2.0,
        sparkDuration: 1.0,
        maxRPM: 6500,
        sparkEnergy: 'Standard',
        notes: 'Stock Ford TFI - reliable to 6500 RPM, good for street use',
        settings: {
            dwellControl: 'voltage_based',
            sparkOutput: 'going_high'
        }
    },
    
    'Ford_EDIS': {
        type: 'Waste spark',
        dwellTime: 3.5,
        chargingTime: 1.8,
        sparkDuration: 1.5,
        maxRPM: 6800,
        sparkEnergy: 'High',
        notes: 'Ford EDIS waste spark system - excellent performance',
        settings: {
            dwellControl: 'dwell_time',
            sparkOutput: 'going_high',
            edisMode: true
        }
    },
    
    'GM_HEI': {
        type: 'Distributor',
        dwellTime: 4.0,
        chargingTime: 2.2,
        sparkDuration: 1.2,
        maxRPM: 6200,
        sparkEnergy: 'High',
        notes: 'GM HEI distributor - high energy, good for performance',
        settings: {
            dwellControl: 'voltage_based',
            sparkOutput: 'going_high'
        }
    },
    
    'LS1_COP': {
        type: 'Coil on plug',
        dwellTime: 4.0,
        chargingTime: 1.2,
        sparkDuration: 2.0,
        maxRPM: 7000,
        sparkEnergy: 'High',
        notes: 'GM LS1 coil-on-plug - excellent performance and reliability',
        settings: {
            dwellControl: 'dwell_time',
            sparkOutput: 'going_high',
            copMode: true
        }
    },
    
'AEM_SmartCoil': {
    type: 'Coil near plug',
    dwellTime: 4.5,
    chargingTime: 1.0,
    sparkDuration: 2.2,
    maxRPM: 9000,
    sparkEnergy: 'Very High',
    notes: 'AEM smart coil / IGN‑1A style, high‑energy replacement',
    settings: {
        dwellControl: 'dwell_time',
        sparkOutput: 'going_high',
        smartCoilMode: true
    }
},

'IGN1A_Coil': {
    type: 'Coil near plug',
    dwellTime: 5.0,
    chargingTime: 0.9,
    sparkDuration: 2.3,
    maxRPM: 9500,
    sparkEnergy: 'Very High',
    notes: 'Honeywell IGN‑1A coil widely used in motorsport',
    settings: {
        dwellControl: 'dwell_time',
        sparkOutput: 'going_high',
        smartCoilMode: true
    }
}
};

// ===== WIDEBAND DATABASE =====
// Add new wideband controllers here
const widebandDatabase = {
    'AEM_30-4110': {
        type: 'Bosch LSU 4.9',
        voltage: '0-5V',
        afrRange: '10.0-20.3',
        calibration: 'linear',
        heaterControl: 'internal',
        accuracy: '±0.1 AFR',
        notes: 'AEM 30-4110 - very popular and reliable wideband controller',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 10.0,
            highAFR: 20.3
        }
    },
    
    'Innovate_LC2': {
        type: 'Bosch LSU 4.9',
        voltage: '0-5V',
        afrRange: '7.35-22.39',
        calibration: 'innovate_lc2',
        heaterControl: 'internal',
        accuracy: '±0.1 AFR',
        notes: 'Innovate LC-2 - good budget option, widely supported',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 7.35,
            highAFR: 22.39
        }
    },
    
'14Point7_Spartan2': {
    type: 'Bosch LSU 4.9',
    voltage: '0‑5V',
    afrRange: '9.0‑22.0',
    calibration: 'linear',
    heaterControl: 'internal',
    accuracy: '±0.05 AFR',
    notes: '14Point7 Spartan 2 – fast response, open‑source friendly',
    settings: {
        sensorType: 'Custom',
        lowVoltage: 0.0,
        highVoltage: 5.0,
        lowAFR: 9.0,
        highAFR: 22.0
    }
},

'PLX_DM6': {
    type: 'Bosch LSU 4.9',
    voltage: '0‑5V',
    afrRange: '10.0‑20.0',
    calibration: 'linear',
    heaterControl: 'internal',
    accuracy: '±0.1 AFR',
    notes: 'PLX DM‑6 GEN4 – digital gauge with linear output',
    settings: {
        sensorType: 'Custom',
        lowVoltage: 0.0,
        highVoltage: 5.0,
        lowAFR: 10.0,
        highAFR: 20.0
    }
}
};

// ===== FUEL PUMP DATABASE =====
// Add new fuel pumps here
const fuelPumpDatabase = {
    'Walbro_255': {
        flow: '255 LPH',
        pressure: '43.5 psi',
        maxHP: 400,
        fuelType: 'gasoline',
        voltage: '12V',
        notes: 'Walbro 255 - supports up to 400hp, very reliable',
        powerConsumption: '6-8 amps'
    },
    
    'Walbro_450': {
        flow: '450 LPH',
        pressure: '58 psi',
        maxHP: 700,
        fuelType: 'gasoline',
        voltage: '12V',
        notes: 'Walbro 450 - high performance, supports serious power',
        powerConsumption: '12-15 amps'
    },
    
    'Aeromotive_340': {
        flow: '340 LPH',
        pressure: '60 psi',
        maxHP: 500,
        fuelType: 'gasoline/E85',
        voltage: '12V',
        notes: 'Aeromotive Stealth 340 - E85 compatible, quiet operation',
        powerConsumption: '8-10 amps'
    },
    
    'stock': {
        flow: 'Unknown',
        pressure: 'Standard',
        maxHP: 200,
        fuelType: 'gasoline',
        voltage: '12V',
        notes: 'Stock fuel pump - adequate for stock applications',
        powerConsumption: '4-6 amps'
    },
    
'Bosch_044': {
    flow: '300 LPH',
    pressure: '72 psi',
    maxHP: 600,
    fuelType: 'gasoline',
    voltage: '12V',
    notes: 'Bosch 0 580 254 044 – external inline, motorsport staple',
    powerConsumption: '10 amps'
},

'DeatschWerks_DW400': {
    flow: '415 LPH',
    pressure: '40 psi',
    maxHP: 750,
    fuelType: 'gasoline/E85',
    voltage: '12V',
    notes: 'DW400 in‑tank pump, E85 compatible, quiet',
    powerConsumption: '13‑16 amps'
}

};

// ===== KNOWN COMBINATIONS =====
// Add proven engine combos here
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
            notes: 'Popular street/strip combo, proven reliable and powerful'
        }
    },
    
    'Ford_302_stock_19lb': {
        engine: {
            displacement: 302,
            cylinders: 8,
            compression: 9.0,
            family: 'Ford_302'
        },
        camshaft: {
            profile: 'stock',
            duration: 204,
            lift: 0.395,
            lsa: 114
        },
        fuel: {
            injectorModel: 'Ford_19lb_Yellow',
            fuelPressure: 39,
            fuelType: '87'
        },
        ignition: {
            coilType: 'Ford_TFI',
            revLimit: 6000
        },
        tuneParams: {
            requiredFuel: 7.1,
            revLimit: 6000,
            afrProfile: 'street',
            timingProfile: 'conservative',
            notes: 'Stock 5.0L setup, excellent reliability and fuel economy'
        }
    }
    
    // ADD NEW PROVEN COMBOS HERE
};

// ===== AFR PROFILES =====
// Add new AFR strategies here
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
    },
    
    'street_strip': {
        idle: 14.0,
        cruise: 14.5,
        acceleration: 12.5,
        wot: 11.8,
        warmup: 13.0,
        description: 'Street/strip dual purpose'
    },
    
'forced_induction': {
    idle: 13.8,
    cruise: 14.7,
    acceleration: 12.0,
    wot: 11.5,
    warmup: 12.8,
    description: 'Safe AFRs for moderate boost on pump gas'
},

'e85_performance': {
    idle: 13.0,
    cruise: 13.8,
    acceleration: 11.8,
    wot: 11.0,
    warmup: 12.5,
    description: 'Optimized for E85 high‑performance street/strip'
}
};

// ===== TIMING PROFILES =====
// Add new timing strategies here
const timingProfiles = {
    'conservative': {
        idle: 15,
        cruise: 32,
        power: 28,
        redline: 25,
        advance_rate: 'slow',
        description: 'Safe for pump gas and unknown octane'
    },
    
    'moderate': {
        idle: 18,
        cruise: 36,
        power: 32,
        redline: 28,
        advance_rate: 'medium',
        description: 'Good balance of performance and safety'
    },
    
'aggressive': {
    idle: 18,
    cruise: 38,
    power: 34,
    redline: 30,
    advance_rate: 'fast',
    description: 'Max power on high‑octane or race fuel'
},

'boosted': {
    idle: 14,
    cruise: 30,
    power: 20,
    redline: 18,
    advance_rate: 'boost_retard',
    description: 'Base map for turbo/supercharged engines'
}
};

// Database loaded successfully
console.log('🗄️ Component databases loaded successfully');
