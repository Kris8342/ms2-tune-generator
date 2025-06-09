// MS2/Extra Tune Generator - Calculation Engine
// Core algorithms for tune parameter calculation
// Add new calculation functions at the bottom

// ===== CORE FUEL CALCULATIONS =====

/**
 * Calculate RequiredFuel value for MS2/Extra
 * This is the fundamental fuel calculation
 */
function calculateRequiredFuel(displacement, cylinders, injectorSize, fuelPressure = 43.5, targetAFR = 14.7) {
    // Calculate displacement per cylinder
    const displacementPerCylinder = displacement / cylinders;
    
    // Base fuel calculation using the standard formula
    const baseFuel = (displacementPerCylinder * 0.4536) / injectorSize;
    
    // Pressure correction factor
    const pressureCorrection = Math.sqrt(43.5 / fuelPressure);
    
    // Final RequiredFuel value
    const requiredFuel = baseFuel * pressureCorrection;
    
    return Math.round(requiredFuel * 100) / 100;
}

/**
 * Generate VE (Volumetric Efficiency) table
 * Creates a baseline VE table based on engine characteristics
 */
function generateVETable(engineData) {
    // Standard RPM bins for MS2/Extra
    const rpmBins = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 6000, 6500];
    
    // Standard load bins (kPa)
    const loadBins = [30, 40, 50, 60, 70, 80, 90, 100];
    
    // Generate VE table data
    const veTable = [];
    
    for (let i = 0; i < loadBins.length; i++) {
        const row = [];
        for (let j = 0; j < rpmBins.length; j++) {
            let baseVE = 80; // Start with baseline VE
            
            // Adjust VE based on load
            if (loadBins[i] < 50) baseVE = 65;  // Light load
            if (loadBins[i] > 80) baseVE = 95;  // Heavy load
            
            // Adjust VE based on RPM
            if (rpmBins[j] < 1500) baseVE *= 0.9;   // Low RPM penalty
            if (rpmBins[j] > 5500) baseVE *= 0.95;  // High RPM penalty
            
            // Apply engine-specific modifications here if needed
            // Example: if (engineData.camProfile === 'aggressive') baseVE *= 1.05;
            
            row.push(Math.round(baseVE));
        }
        veTable.push(row);
    }
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: veTable
    };
}

/**
 * Generate AFR (Air/Fuel Ratio) target table
 * Creates AFR targets based on intended use
 */
function generateAFRTable(engineData, afrProfile = 'street_performance') {
    // RPM bins for AFR table
    const rpmBins = [500, 800, 1100, 1400, 2000, 2600, 3100, 3700, 4300, 4900, 5400, 6000, 6500];
    
    // Load bins for AFR table
    const loadBins = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    
    // Get AFR targets from profile
    const afrTargets = afrProfiles[afrProfile] || afrProfiles.street_performance;
    
    // Generate AFR table
    const afrTable = [];
    
    for (let i = 0; i < loadBins.length; i++) {
        const row = [];
        for (let j = 0; j < rpmBins.length; j++) {
            let targetAFR;
            
            // Determine AFR based on load conditions
            if (loadBins[i] <= 40) {
                targetAFR = afrTargets.cruise;      // Light load - economy
            } else if (loadBins[i] <= 70) {
                targetAFR = afrTargets.acceleration; // Medium load - acceleration
            } else {
                targetAFR = afrTargets.wot;          // Heavy load - wide open throttle
            }
            
            row.push(Math.round(targetAFR * 10) / 10);
        }
        afrTable.push(row);
    }
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: afrTable
    };
}

/**
 * Generate timing (spark advance) table
 * Creates safe baseline timing based on fuel and engine specs
 */
function generateTimingTable(engineData, timingProfile = 'conservative') {
    // RPM bins for timing table
    const rpmBins = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 6000, 6500];
    
    // Load bins for timing table
    const loadBins = [30, 40, 50, 60, 70, 80, 90, 100];
    
    // Get timing targets from profile
    const timingTargets = timingProfiles[timingProfile] || timingProfiles.conservative;
    
    // Generate timing table
    const timingTable = [];
    
    for (let i = 0; i < loadBins.length; i++) {
        const row = [];
        for (let j = 0; j < rpmBins.length; j++) {
            let baseTiming = timingTargets.cruise;
            
            // Adjust timing based on load
            if (loadBins[i] > 80) baseTiming = timingTargets.power;    // High load - less timing
            
            // Adjust timing based on RPM
            if (rpmBins[j] < 1500) baseTiming = timingTargets.idle;    // Low RPM - idle timing
            if (rpmBins[j] > 5500) baseTiming = timingTargets.redline; // High RPM - reduced timing
            
            row.push(Math.round(baseTiming));
        }
        timingTable.push(row);
    }
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: timingTable
    };
}

// ===== SMART DEFAULTS SYSTEM =====

/**
 * Calculate smart defaults for unknown parameters
 * Estimates reasonable values when user doesn't know specs
 */
function calculateSmartDefaults(formData) {
    const smartDefaults = {};
    
    // Estimate compression ratio if unknown
    if (!formData.compression) {
        smartDefaults.compression = 9.0; // Safe default for most engines
    }
    
    // Estimate injector size if unknown
    if (!formData.injectorSize) {
        const displacement = formData.displacement || 350;
        // Rule of thumb: 1 lb/hr per 10 hp, assume 1.2 hp/ci
        const estimatedHP = displacement * 1.2;
        smartDefaults.injectorSize = Math.ceil(estimatedHP / 10);
    }
    
    // Estimate rev limit if unknown
    if (!formData.revLimit) {
        smartDefaults.revLimit = 6500; // Conservative default
    }
    
    return smartDefaults;
}

// ===== VALIDATION FUNCTIONS =====

/**
 * Validate complete configuration for safety
 * Returns warnings, suggestions, and errors
 */
function validateConfiguration(formData) {
    const warnings = [];
    const suggestions = [];
    const errors = [];
    
    // Check for potential issues
    const displacement = formData.displacement || 0;
    const compression = formData.compression || 0;
    const revLimit = formData.revLimit || 0;
    
    // Displacement validation
    if (displacement > 500) {
        warnings.push('Large displacement engines may need custom tuning for optimal results');
    }
    
    // Compression validation
    if (compression > 10.5 && formData.fuelType === '87') {
        warnings.push('High compression with regular fuel may cause knock - consider premium fuel');
    }
    
    // Rev limit validation
    if (revLimit > 7000) {
        warnings.push('High rev limit requires careful attention to valve train and ignition timing');
    }
    
    // General suggestions
    if (!formData.widebandSensor || formData.widebandSensor === 'none') {
        suggestions.push('A wideband O2 sensor is highly recommended for safe tuning');
    }
    
    return {
        warnings: warnings,
        suggestions: suggestions,
        errors: errors,
        canGenerate: errors.length === 0
    };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Convert between units
 */
function convertUnits(value, fromUnit, toUnit) {
    // Add unit conversion functions here as needed
    if (fromUnit === 'liters' && toUnit === 'ci') {
        return value * 61.024;
    }
    if (fromUnit === 'cc' && toUnit === 'ci') {
        return value * 0.061024;
    }
    return value; // No conversion needed
}

// ===== ADD NEW CALCULATION FUNCTIONS HERE =====

// Example template for new functions:
/*
function calculateNewFeature(inputData) {
    // Your calculation logic here
    return result;
}
*/

// Calculations loaded successfully
console.log('🧮 Calculation engine loaded successfully');
