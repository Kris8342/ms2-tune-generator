// MS2/Extra Tune Generator - Calculation Engine
// Contains all mathematical algorithms for tune parameter generation

// RequiredFuel Calculation - Core fuel delivery formula
function calculateRequiredFuel(displacement, cylinders, injectorSize, fuelPressure = 43.5, targetAFR = 14.7) {
    // Convert displacement to per-cylinder in cubic inches
    const displacementPerCylinder = displacement / cylinders;
    
    // Base fuel calculation (simplified version of complex MS formula)
    const baseFuel = (displacementPerCylinder * 0.4536) / injectorSize;
    
    // Pressure correction factor
    const pressureCorrection = Math.sqrt(43.5 / fuelPressure);
    
    // Calculate required fuel in milliseconds
    const requiredFuel = baseFuel * pressureCorrection;
    
    return Math.round(requiredFuel * 100) / 100;
}

// VE Table Generator based on engine characteristics
function generateVETable(engineData) {
    const { displacement, cylinders, compression, camProfile, engineFamily } = engineData;
    
    // Base VE patterns for different cam profiles
    const baseTables = {
        stock: {
            lowLoad: [40, 45, 50, 60, 70, 80, 90, 95],
            midLoad: [45, 50, 55, 65, 75, 85, 95, 100],
            highLoad: [35, 40, 45, 55, 65, 75, 85, 90]
        },
        mild_performance: {
            lowLoad: [42, 47, 52, 62, 72, 82, 92, 97],
            midLoad: [47, 52, 57, 67, 77, 87, 97, 102],
            highLoad: [40, 45, 50, 60, 70, 80, 90, 95]
        },
        performance: {
            lowLoad: [38, 43, 48, 58, 68, 78, 88, 93],
            midLoad: [50, 55, 60, 70, 80, 90, 100, 105],
            highLoad: [45, 50, 55, 65, 75, 85, 95, 100]
        },
        race: {
            lowLoad: [30, 35, 40, 50, 60, 70, 80, 85],
            midLoad: [55, 60, 65, 75, 85, 95, 105, 110],
            highLoad: [60, 65, 70, 80, 90, 100, 105, 110]
        }
    };
    
    // Select base table
    let baseTable = baseTables[camProfile] || baseTables.mild_performance;
    
    // Apply displacement correction
    const displacementFactor = Math.pow(displacement / 350, 0.15);
    
    // Apply compression ratio correction
    const compressionFactor = 1 + ((compression - 9) * 0.05);
    
    // Engine family specific adjustments
    const familyFactors = {
        Ford_302: 1.0,
        GM_LS1: 1.08,
        Chevy_350: 0.95,
        Ford_351: 1.02,
        GM_LT1: 1.05
    };
    
    const familyFactor = familyFactors[engineFamily] || 1.0;
    
    // Generate the complete VE table
    const veTable = generateCompleteVETable(baseTable, displacementFactor, compressionFactor, familyFactor);
    
    return veTable;
}

// Generate complete VE table with RPM and load axes
function generateCompleteVETable(baseTable, displacementFactor, compressionFactor, familyFactor) {
    const rpmBins = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 6000, 6500];
    const loadBins = [30, 40, 50, 60, 70, 80, 90, 100]; // kPa
    
    const veTable = [];
    
    loadBins.forEach((load, loadIndex) => {
        const row = [];
        rpmBins.forEach((rpm, rpmIndex) => {
            // Determine which base pattern to use based on load
            let basePattern;
            if (load <= 50) basePattern = baseTable.lowLoad;
            else if (load <= 80) basePattern = baseTable.midLoad;
            else basePattern = baseTable.highLoad;
            
            // Interpolate base VE value
            const baseVE = interpolateArray(basePattern, rpmIndex / (rpmBins.length - 1));
            
            // Apply all correction factors
            let correctedVE = baseVE * displacementFactor * compressionFactor * familyFactor;
            
            // RPM-specific corrections
            if (rpm < 1500) correctedVE *= 0.9; // Lower VE at very low RPM
            if (rpm > 5500) correctedVE *= 0.95; // Slight reduction at high RPM
            
            // Round to reasonable precision
            correctedVE = Math.round(correctedVE);
            
            // Sanity limits
            correctedVE = Math.max(20, Math.min(130, correctedVE));
            
            row.push(correctedVE);
        });
        veTable.push(row);
    });
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: veTable
    };
}

// AFR Table Generator
function generateAFRTable(engineData, afrProfile = 'street_performance') {
    const { intendedUse, fuelType } = engineData;
    
    // Get AFR targets from profile
    const afrTargets = afrProfiles[afrProfile] || afrProfiles.street_performance;
    
    const rpmBins = [500, 800, 1100, 1400, 2000, 2600, 3100, 3700, 4300, 4900, 5400, 6000, 6500];
    const loadBins = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]; // kPa
    
    const afrTable = [];
    
    loadBins.forEach((load, loadIndex) => {
        const row = [];
        rpmBins.forEach((rpm, rpmIndex) => {
            let targetAFR;
            
            // Determine AFR based on load and RPM
            if (load <= 35) {
                // Idle/cruise conditions
                if (rpm <= 1000) targetAFR = afrTargets.idle;
                else targetAFR = afrTargets.cruise;
            } else if (load <= 60) {
                // Light acceleration
                targetAFR = interpolateValue(afrTargets.cruise, afrTargets.acceleration, (load - 35) / 25);
            } else if (load <= 85) {
                // Medium acceleration
                targetAFR = afrTargets.acceleration;
            } else {
                // WOT conditions
                targetAFR = afrTargets.wot;
                
                // Richen slightly at very high RPM for safety
                if (rpm > 5500) targetAFR -= 0.2;
            }
            
            // Fuel type adjustments
            const fuelAdjustments = {
                '87': 0.0,
                '91': -0.1,
                '93': -0.2,
                '100': -0.3,
                '110': -0.4,
                'E85': -1.5
            };
            
            targetAFR += (fuelAdjustments[fuelType] || 0);
            
            // Round to 0.1 precision
            targetAFR = Math.round(targetAFR * 10) / 10;
            
            row.push(targetAFR);
        });
        afrTable.push(row);
    });
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: afrTable
    };
}

// Timing Table Generator
function generateTimingTable(engineData, timingProfile = 'conservative') {
    const { compression, fuelType, camProfile, safetyLevel } = engineData;
    
    // Get base timing from profile
    const timingTargets = timingProfiles[timingProfile] || timingProfiles.conservative;
    
    const rpmBins = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 6000, 6500];
    const loadBins = [30, 40, 50, 60, 70, 80, 90, 100]; // kPa
    
    // Octane correction factors
    const octaneCorrections = {
        '87': 0,
        '89': 1,
        '91': 2,
        '93': 3,
        '100': 6,
        '110': 10,
        'E85': 8
    };
    
    // Compression ratio correction
    const compressionCorrection = compression > 10 ? -(compression - 10) * 2 : (10 - compression) * 1;
    
    // Cam timing correction (longer duration cams like more timing)
    const camCorrections = {
        stock: 0,
        mild_performance: 1,
        performance: 2,
        race: 3
    };
    
    const totalCorrection = (octaneCorrections[fuelType] || 0) + compressionCorrection + (camCorrections[camProfile] || 0);
    
    const timingTable = [];
    
    loadBins.forEach((load, loadIndex) => {
        const row = [];
        rpmBins.forEach((rpm, rpmIndex) => {
            let baseTiming;
            
            // Base timing curve shape
            if (rpm <= 1000) {
                baseTiming = timingTargets.idle;
            } else if (rpm <= 2500) {
                baseTiming = interpolateValue(timingTargets.idle, timingTargets.cruise, (rpm - 1000) / 1500);
            } else if (rpm <= 4500) {
                baseTiming = timingTargets.cruise;
            } else {
                baseTiming = interpolateValue(timingTargets.cruise, timingTargets.redline, (rpm - 4500) / 2000);
            }
            
            // Load-based timing reduction
            const loadCorrection = (load - 30) * -0.15; // Retard timing with increased load
            
            // Apply all corrections
            let finalTiming = baseTiming + totalCorrection + loadCorrection;
            
            // Safety limits based on load
            if (load > 80) finalTiming = Math.min(finalTiming, 30); // Never exceed 30° at high load
            if (load > 90) finalTiming = Math.min(finalTiming, 25); // Conservative at WOT
            
            // Absolute safety limits
            finalTiming = Math.max(5, Math.min(40, finalTiming));
            
            // Round to 0.5 degree precision
            finalTiming = Math.round(finalTiming * 2) / 2;
            
            row.push(finalTiming);
        });
        timingTable.push(row);
    });
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: timingTable
    };
}

// Enrichment Tables Generator
function generateEnrichmentTables(engineData) {
    const { displacement, cylinders, intendedUse } = engineData;
    
    // Cranking enrichment (temperature based)
    const crankingEnrichment = {
        temperatures: [-40, -21, -2, 19, 36, 58, 81, 108, 166, 214], // Fahrenheit
        enrichment: [180, 160, 140, 120, 110, 105, 100, 95, 90, 85]  // Percent
    };
    
    // After-start enrichment
    const afterStartEnrichment = {
        temperatures: [-40, 0, 32, 70, 100, 160, 200],
        enrichment: [35, 30, 25, 20, 15, 10, 5],
        decayTime: [20, 18, 15, 12, 10, 8, 5] // seconds
    };
    
    // Warmup enrichment
    const warmupEnrichment = {
        temperatures: [-40, 0, 32, 70, 100, 130, 160, 180, 200],
        enrichment: [150, 135, 120, 110, 105, 102, 100, 98, 95]
    };
    
    // Acceleration enrichment
    const accelEnrichment = {
        tpsThreshold: 2, // percent
        mapThreshold: 7, // kPa
        coldMultiplier: intendedUse.includes('performance') ? 175 : 150,
        tpsAmount: displacement > 400 ? 80 : displacement > 300 ? 60 : 50,
        mapAmount: 30,
        decayTime: 1.5
    };
    
    return {
        cranking: crankingEnrichment,
        afterStart: afterStartEnrichment,
        warmup: warmupEnrichment,
        acceleration: accelEnrichment
    };
}

// Injector Settings Calculator
function calculateInjectorSettings(injectorData, fuelPressure = 43.5) {
    const { size, type, deadtime, batteryCorrection } = injectorData;
    
    // Pressure correction for deadtime
    const pressureCorrection = Math.sqrt(fuelPressure / 43.5);
    const correctedDeadtime = deadtime * pressureCorrection;
    
    // Battery voltage correction curve
    const batteryCorrection_curve = [
        { voltage: 6.0, correction: batteryCorrection * 3 },
        { voltage: 8.0, correction: batteryCorrection * 2 },
        { voltage: 10.0, correction: batteryCorrection * 1.5 },
        { voltage: 12.0, correction: batteryCorrection },
        { voltage: 14.0, correction: batteryCorrection * 0.5 },
        { voltage: 16.0, correction: 0 }
    ];
    
    return {
        deadtime: Math.round(correctedDeadtime * 100) / 100,
        batteryCorrection: batteryCorrection,
        batteryCorrectionCurve: batteryCorrection_curve,
        injectorSize: size,
        flowData: injectorData.flowVsPressure
    };
}

// Rev Limiter and Safety Settings
function calculateSafetySettings(engineData) {
    const { revLimit, safetyLevel, coilType } = engineData;
    
    // Rev limiter settings
    const hardLimit = revLimit || 6500;
    const softLimit = hardLimit - 300; // Fuel cut 300 RPM before hard limit
    const sparkResume = hardLimit - 200;
    const fuelResume = softLimit - 200;
    
    // Over-boost protection (if applicable)
    const overBoostCut = engineData.mapSensor === '1bar' ? 105 : 
                        engineData.mapSensor === '2bar' ? 180 : 250;
    
    return {
        hardRevLimit: hardLimit,
        softRevLimit: softLimit,
        sparkResume: sparkResume,
        fuelResume: fuelResume,
        overBoostCut: overBoostCut,
        revLimitType: 'spark_cut'
    };
}

// Idle Control Settings
function calculateIdleSettings(engineData) {
    const { displacement, camProfile, intendedUse } = engineData;
    
    // Base idle RPM based on cam profile
    const baseIdleRPMs = {
        stock: 700,
        mild_performance: 750,
        performance: 850,
        race: 950
    };
    
    const targetIdle = baseIdleRPMs[camProfile] || 750;
    
    // IAC settings
    const iacSettings = {
        targetIdle: targetIdle,
        idleTimingAdvance: camProfile === 'race' ? 20 : 15,
        iacStartupSteps: Math.min(50, displacement / 10),
        fastIdleTemp: 160, // °F
        fastIdleRPM: targetIdle + 200
    };
    
    return iacSettings;
}

// Utility Functions
function interpolateValue(min, max, ratio) {
    return min + (max - min) * Math.max(0, Math.min(1, ratio));
}

function interpolateArray(array, position) {
    const scaledPos = position * (array.length - 1);
    const lowerIndex = Math.floor(scaledPos);
    const upperIndex = Math.ceil(scaledPos);
    
    if (lowerIndex === upperIndex) {
        return array[lowerIndex];
    }
    
    const ratio = scaledPos - lowerIndex;
    return interpolateValue(array[lowerIndex], array[upperIndex], ratio);
}

// Smart Defaults Calculator for Unknown Components
function calculateSmartDefaults(formData) {
    const smartDefaults = {};
    
    // Estimate compression ratio based on engine family and year
    if (!formData.compression || formData.compression === 'unknown') {
        const compressionDefaults = {
            Ford_302: 9.0,
            Ford_351: 8.8,
            GM_LS1: 10.1,
            GM_LT1: 10.4,
            Chevy_350: 8.5,
            Chevy_BBC: 8.2
        };
        smartDefaults.compression = compressionDefaults[formData.engineFamily] || 9.0;
    }
    
    // Estimate injector size based on displacement and intended use
    if (!formData.injectorSize || formData.injectorSize === 'unknown') {
        const estimatedHP = formData.displacement * (formData.intendedUse.includes('performance') ? 1.5 : 1.2);
        const requiredFlow = estimatedHP / 10; // Rule of thumb: 1 lb/hr per 10 hp
        
        if (requiredFlow <= 20) smartDefaults.injectorSize = 19;
        else if (requiredFlow <= 25) smartDefaults.injectorSize = 24;
        else if (requiredFlow <= 35) smartDefaults.injectorSize = 34;
        else if (requiredFlow <= 45) smartDefaults.injectorSize = 42;
        else smartDefaults.injectorSize = 60;
    }
    
    // Estimate cam profile based on intended use
    if (!formData.camProfile || formData.camProfile === 'unknown') {
        const camDefaults = {
            street: 'stock',
            street_performance: 'mild_performance',
            street_strip: 'performance',
            track: 'performance',
            drag_racing: 'race'
        };
        smartDefaults.camProfile = camDefaults[formData.intendedUse] || 'mild_performance';
    }
    
    // Estimate rev limit based on engine family and cam
    if (!formData.revLimit) {
        const baseRevLimits = {
            Ford_302: 6200,
            GM_LS1: 6500,
            Chevy_350: 6000
        };
        
        let baseLimit = baseRevLimits[formData.engineFamily] || 6200;
        
        // Adjust for cam profile
        if (formData.camProfile === 'performance') baseLimit += 300;
        if (formData.camProfile === 'race') baseLimit += 500;
        
        smartDefaults.revLimit = baseLimit;
    }
    
    return smartDefaults;
}

// Validation and Warning System
function validateConfiguration(formData) {
    const warnings = [];
    const suggestions = [];
    const errors = [];
    
    // Critical validations
    if (formData.compression > 11 && parseInt(formData.fuelType) < 91) {
        warnings.push('🚨 High compression + low octane = KNOCK RISK! Use premium fuel or retard timing.');
    }
    
    if (formData.injectorSize && formData.displacement) {
        const estimatedHP = formData.displacement * 1.3;
        const maxHP = formData.injectorSize * 10;
        
        if (estimatedHP > maxHP * 0.8) {
            warnings.push(`⚠️ Injectors may be undersized. Consider ${Math.ceil(estimatedHP/10)}lb+ injectors.`);
        }
        
        if (formData.injectorSize > estimatedHP / 5) {
            warnings.push(`⚠️ Injectors may be oversized. This can hurt idle quality and low-speed drivability.`);
        }
    }
    
    // Safety suggestions
    if (formData.widebandSensor === 'none' && formData.intendedUse !== 'street') {
        suggestions.push('💡 Strongly recommend adding a wideband O2 sensor for performance tuning and safety monitoring.');
    }
    
    if (formData.safetyLevel === 'aggressive' && parseInt(formData.fuelType) < 93) {
        suggestions.push('💡 Aggressive timing selected - ensure you have 93+ octane fuel and knock monitoring.');
    }
    
    if (formData.revLimit > 7000 && formData.coilType === 'Ford_TFI') {
        warnings.push('⚠️ Rev limit above coil capability. Consider upgrading ignition system.');
    }
    
    return {
        warnings: warnings,
        suggestions: suggestions,
        errors: errors,
        canGenerate: errors.length === 0
    };
}
