// MS2/Extra Tune Generator - Component Databases
// Contains all known component specifications for auto-population

// Injector Database with complete specifications
const injectorDatabase = {
    'Ford_19lb_Yellow': {
        size: 19,
        type: 'EV1',
        impedance: 'High-Z',
        deadtime: 1.0,
        batteryCorrection: 0.2,
        flowVsPressure: {30: 17, 40: 19, 50: 21, 60: 22},
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
        flowVsPressure: {30: 22, 40: 24, 50: 26, 60: 28},
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
        flowVsPressure: {30: 28, 40: 30, 50: 32, 60: 34},
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
        flowVsPressure: {30: 38, 40: 42, 50: 46, 60: 49},
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
        flowVsPressure: {30: 55, 40: 60, 50: 65, 60: 69},
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
        flowVsPressure: {30: 72, 40: 80, 50: 87, 60: 93},
        notes: 'Siemens 80lb - high flow for serious power applications',
        maxHP: 800,
        recommendedUse: ['drag_racing', 'high_performance', 'turbo']
    }
};

// Ignition Coil Database
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
    'MSD_Blaster_SS': {
        type: 'Single coil',
        dwellTime: 4.5,
        chargingTime: 1.5,
        sparkDuration: 20,
        maxRPM: 8000,
        sparkEnergy: 'Very High',
        notes: 'MSD Blaster SS - high performance single coil, multiple sparks',
        settings: {
            dwellControl: 'dwell_time',
            sparkOutput: 'going_high',
            multiSpark: true
        }
    },
    'MSD_Smart_Coils': {
        type: 'Coil near plug',
        dwellTime: 5.0,
        chargingTime: 1.0,
        sparkDuration: 25,
        maxRPM: 8500,
        sparkEnergy: 'Extreme',
        notes: 'MSD Smart Coils - race quality, excellent high RPM performance',
        settings: {
            dwellControl: 'dwell_time',
            sparkOutput: 'going_high',
            multiSpark: true
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
    'LS2_COP': {
        type: 'Coil on plug',
        dwellTime: 3.8,
        chargingTime: 1.0,
        sparkDuration: 2.2,
        maxRPM: 7500,
        sparkEnergy: 'Very High',
        notes: 'GM LS2/LS3 coil-on-plug - updated design, higher energy',
        settings: {
            dwellControl: 'dwell_time',
            sparkOutput: 'going_high',
            copMode: true
        }
    }
};

// Wideband O2 Sensor Database
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
    'AEM_X-Series': {
        type: 'Bosch LSU 4.9',
        voltage: '0-5V',
        afrRange: '7.35-22.39',
        calibration: 'aem_x_series',
        heaterControl: 'internal',
        accuracy: '±0.05 AFR',
        notes: 'AEM X-Series - latest generation, very accurate',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 7.35,
            highAFR: 22.39
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
    'Innovate_MTX-L': {
        type: 'Bosch LSU 4.9',
        voltage: '0-5V',
        afrRange: '7.35-22.39',
        calibration: 'innovate_mtx',
        heaterControl: 'internal',
        accuracy: '±0.05 AFR',
        notes: 'Innovate MTX-L - advanced features, data logging capable',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 7.35,
            highAFR: 22.39
        }
    },
    'PLX_SM-AFR': {
        type: 'NTK UEGO',
        voltage: '0-5V',
        afrRange: '9.0-19.0',
        calibration: 'plx_linear',
        heaterControl: 'external',
        accuracy: '±0.1 AFR',
        notes: 'PLX SM-AFR - requires external heater control, good value',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 9.0,
            highAFR: 19.0
        }
    },
    'Zeitronix_Zt3': {
        type: 'Bosch LSU 4.2',
        voltage: '0-5V',
        afrRange: '8.5-18.5',
        calibration: 'zeitronix_zt3',
        heaterControl: 'internal',
        accuracy: '±0.05 AFR',
        notes: 'Zeitronix ZT-3 - very accurate, professional grade',
        settings: {
            sensorType: 'Custom',
            lowVoltage: 0.0,
            highVoltage: 5.0,
            lowAFR: 8.5,
            highAFR: 18.5
        }
    }
};

// Fuel Pump Database
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
    }
};

// Known Engine Combo Database
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
    },
    'LS1_stock_24lb': {
        engine: {
            displacement: 346,
            cylinders: 8,
            compression: 10.1,
            family: 'GM_LS1'
        },
        camshaft: {
            profile: 'stock',
            duration: 196,
            lift: 0.457,
            lsa: 116
        },
        fuel: {
            injectorModel: 'Ford_24lb_Green',
            fuelPressure: 58,
            fuelType: '91'
        },
        ignition: {
            coilType: 'LS1_COP',
            revLimit: 6200
        },
        tuneParams: {
            requiredFuel: 5.8,
            revLimit: 6200,
            afrProfile: 'street',
            timingProfile: 'moderate',
            notes: 'Stock LS1 with mild upgrades, very reliable street setup'
        }
    },
    'LS1_cam_42lb': {
        engine: {
            displacement: 346,
            cylinders: 8,
            compression: 10.1,
            family: 'GM_LS1'
        },
        camshaft: {
            profile: 'performance',
            duration: 224,
            lift: 0.525,
            lsa: 112
        },
        fuel: {
            injectorModel: 'Bosch_42lb_Green',
            fuelPressure: 58,
            fuelType: '93'
        },
        ignition: {
            coilType: 'LS1_COP',
            revLimit: 6800
        },
        tuneParams: {
            requiredFuel: 5.2,
            revLimit: 6800,
            afrProfile: 'street_performance',
            timingProfile: 'moderate',
            notes: 'LS1 with performance cam, excellent street/strip setup'
        }
    },
    'SBC_350_mild_34lb': {
        engine: {
            displacement: 350,
            cylinders: 8,
            compression: 8.5,
            family: 'Chevy_350'
        },
        camshaft: {
            profile: 'mild_performance',
            duration: 214,
            lift: 0.420,
            lsa: 110
        },
        fuel: {
            injectorModel: 'Ford_30lb_Blue',
            fuelPressure: 43.5,
            fuelType: '89'
        },
        ignition: {
            coilType: 'GM_HEI',
            revLimit: 6200
        },
        tuneParams: {
            requiredFuel: 6.4,
            revLimit: 6200,
            afrProfile: 'street_performance',
            timingProfile: 'conservative',
            notes: 'Classic SBC mild performance, great torque and reliability'
        }
    },
    'SBC_350_Comp280_42lb': {
        engine: {
            displacement: 350,
            cylinders: 8,
            compression: 9.5,
            family: 'Chevy_350'
        },
        camshaft: {
            profile: 'performance',
            duration: 230,
            lift: 0.477,
            lsa: 110
        },
        fuel: {
            injectorModel: 'Bosch_42lb_Green',
            fuelPressure: 43.5,
            fuelType: '91'
        },
        ignition: {
            coilType: 'MSD_Blaster_SS',
            revLimit: 6500
        },
        tuneParams: {
            requiredFuel: 5.9,
            revLimit: 6500,
            afrProfile: 'street_performance',
            timingProfile: 'moderate',
            notes: 'SBC with Comp 280H cam, classic street/strip performance'
        }
    }
};

// AFR Target Profiles
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
    'track': {
        idle: 14.0,
        cruise: 14.5,
        acceleration: 12.5,
        wot: 11.8,
        warmup: 12.8,
        description: 'Track focused performance'
    },
    'drag_racing': {
        idle: 13.8,
        cruise: 13.5,
        acceleration: 12.0,
        wot: 11.5,
        warmup: 12.5,
        description: 'Drag racing optimized'
    }
};

// Timing Profiles
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
        idle: 20,
        cruise: 40,
        power: 36,
        redline: 32,
        advance_rate: 'fast',
        description: 'Maximum performance, requires high octane'
    }
};

// Sensor Calibration Database
const sensorDatabase = {
    map_sensors: {
        '1bar': {
            minVoltage: 0.5,
            maxVoltage: 4.5,
            minKpa: 10,
            maxKpa: 105,
            type: 'GM 1 bar'
        },
        '2bar': {
            minVoltage: 0.5,
            maxVoltage: 4.5,
            minKpa: 10,
            maxKpa: 200,
            type: 'GM 2 bar'
        },
        '3bar': {
            minVoltage: 0.5,
            maxVoltage: 4.5,
            minKpa: 10,
            maxKpa: 300,
            type: 'GM 3 bar'
        }
    },
    temp_sensors: {
        'gm_2wire': {
            type: 'GM 2-wire',
            resistance_curve: 'gm_standard',
            pullup: '2490 ohm'
        },
        'ford_2wire': {
            type: 'Ford 2-wire',
            resistance_curve: 'ford_standard',
            pullup: '2490 ohm'
        }
    }
};
