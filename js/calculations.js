/**
 * Generate VE (Volumetric Efficiency) table
 * Creates a baseline VE table based on engine characteristics - EXACTLY 16x16
 */
function generateVETable(engineData) {
    // Standard RPM bins for MS2/Extra (16 bins)
    const rpmBins = [600, 900, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5400, 6000, 6600, 7200];
    
    // Standard load bins (kPa) (16 bins)
    const loadBins = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170];
    
    // Generate VE table data (16x16)
    const veTable = [];
    
    for (let i = 0; i < 16; i++) {
        const row = [];
        for (let j = 0; j < 16; j++) {
            let baseVE = 80; // Start with baseline VE
            
            // Adjust VE based on load
            if (loadBins[i] < 50) baseVE = 65;  // Light load
            else if (loadBins[i] > 100) baseVE = 95;  // Heavy load
            
            // Adjust VE based on RPM
            if (rpmBins[j] < 1500) baseVE *= 0.9;   // Low RPM penalty
            else if (rpmBins[j] > 5500) baseVE *= 0.95;  // High RPM penalty
            
            // Apply engine-specific modifications
            if (engineData.camProfile === 'performance') baseVE *= 1.05;
            if (engineData.camProfile === 'aggressive') baseVE *= 1.1;
            
            const finalVE = Math.max(30, Math.min(120, Math.round(baseVE)));
            row.push(finalVE);
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
 * Generate AFR (Air/Fuel Ratio) target table - EXACTLY 16x16
 * Creates AFR targets based on intended use
 */
function generateAFRTable(engineData, intendedUse = 'street_performance') {
    // RPM bins for AFR table (16 bins)
    const rpmBins = [600, 900, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5400, 6000, 6600, 7200];
    
    // Load bins for AFR table (16 bins)
    const loadBins = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170];
    
    // Get AFR targets from profile
    const afrProfile = afrProfiles[intendedUse] || afrProfiles.street_performance;
    
    // Generate AFR table (16x16)
    const afrTable = [];
    
    for (let i = 0; i < 16; i++) {
        const row = [];
        for (let j = 0; j < 16; j++) {
            let targetAFR;
            
            // Determine AFR based on load conditions
            if (loadBins[i] <= 50) {
                targetAFR = afrProfile.cruise;      // Light load - economy
            } else if (loadBins[i] <= 90) {
                targetAFR = afrProfile.acceleration; // Medium load - acceleration
            } else {
                targetAFR = afrProfile.wot;          // Heavy load - wide open throttle
            }
            
            // Special handling for idle
            if (rpmBins[j] <= 900) {
                targetAFR = afrProfile.idle;
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
 * Generate timing (spark advance) table - EXACTLY 16x16
 * Creates safe baseline timing based on fuel and engine specs
 */
function generateTimingTable(engineData, safetyLevel = 'conservative') {
    // RPM bins for timing table (16 bins)
    const rpmBins = [600, 900, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5400, 6000, 6600, 7200];
    
    // Load bins for timing table (16 bins)
    const loadBins = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170];
    
    // Get timing targets from profile
    const timingProfile = timingProfiles[safetyLevel] || timingProfiles.conservative;
    
    // Generate timing table (16x16)
    const timingTable = [];
    
    for (let i = 0; i < 16; i++) {
        const row = [];
        for (let j = 0; j < 16; j++) {
            let baseTiming = timingProfile.cruise;
            
            // Adjust timing based on load
            if (loadBins[i] > 100) baseTiming = timingProfile.power;    // High load - less timing
            
            // Adjust timing based on RPM
            if (rpmBins[j] <= 900) baseTiming = timingProfile.idle;    // Low RPM - idle timing
            else if (rpmBins[j] > 6000) baseTiming = timingProfile.redline; // High RPM - reduced timing
            
            const finalTiming = Math.max(5, Math.min(45, Math.round(baseTiming)));
            row.push(finalTiming);
        }
        timingTable.push(row);
    }
    
    return {
        rpmBins: rpmBins,
        loadBins: loadBins,
        data: timingTable
    };
}
