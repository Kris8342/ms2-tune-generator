// MS2/Extra Tune Generator - MSQ File Generation
// Handles creation of MS2/Extra .msq files
// Add new MSQ features and file format updates here

// ===== MSQ GENERATOR CLASS =====

class MSQGenerator {
    constructor() {
        // Initialize MSQ generator
        console.log('MSQ Generator initialized');
    }
    
    /**
     * Main MSQ generation function
     * Coordinates the entire MSQ creation process
     */
    generateMSQ(tuneData, componentSpecs) {
        try {
            // Calculate all parameters needed for MSQ
            const calculatedParams = this.calculateAllParameters(tuneData, componentSpecs);
            
            // Convert to MSQ file format
            const msqContent = this.convertToMSQFormat(calculatedParams);
            
            // Generate filename
            const filename = this.generateFilename(tuneData);
            
            return {
                content: msqContent,
                filename: filename,
                parameters: calculatedParams
            };
        } catch (error) {
            console.error('MSQ Generation Error:', error);
            throw new Error(`Failed to generate MSQ: ${error.message}`);
        }
    }
    
    /**
     * Calculate all parameters needed for MSQ file
     * Centralizes all parameter calculations
     */
    calculateAllParameters(tuneData, componentSpecs) {
        const params = {};
        
        // === FUEL PARAMETERS ===
        params.requiredFuel = calculateRequiredFuel(
            tuneData.displacement || 306,
            tuneData.cylinders || 8,
            componentSpecs.injector?.size || tuneData.customInjectorSize || 34,
            tuneData.fuelPressure || 43.5
        );
        
        params.injectorDeadtime = componentSpecs.injector?.deadtime || 0.6;
        params.batteryCorrection = componentSpecs.injector?.batteryCorrection || 0.15;
        
        // === VE TABLE ===
        const veTable = generateVETable(tuneData);
        params.veRpmBins = veTable.rpmBins.join(',');
        params.veLoadBins = veTable.loadBins.join(',');
        params.veTableData = this.formatTableData(veTable.data);
        
        // === AFR TABLE ===
        const afrTable = generateAFRTable(tuneData, tuneData.afrProfile);
        params.afrRpmBins = afrTable.rpmBins.join(',');
        params.afrLoadBins = afrTable.loadBins.join(',');
        params.afrTableData = this.formatTableData(afrTable.data);
        
        // === TIMING TABLE ===
        const timingTable = generateTimingTable(tuneData, tuneData.timingProfile);
        params.sparkRpmBins = timingTable.rpmBins.join(',');
        params.sparkLoadBins = timingTable.loadBins.join(',');
        params.sparkTableData = this.formatTableData(timingTable.data);
        
        // === REV LIMITER ===
        params.hardRevLimit = tuneData.revLimit || 6500;
        params.softRevLimit = (tuneData.revLimit || 6500) - 300;
        
        // === ENGINE SETTINGS ===
        params.cylinders = tuneData.cylinders || 8;
        params.injectors = tuneData.cylinders || 8;
        
        return params;
    }
    
    /**
     * Convert calculated parameters to MSQ file format
     * Creates the actual .msq file content
     */
    convertToMSQFormat(params) {
        const msqLines = [];
        
        // === MSQ HEADER ===
        msqLines.push('[MegaSquirt]');
        msqLines.push('signature=MShift v0.01');
        msqLines.push('fileVersion=029y3');
        msqLines.push('');
        
        // === CONSTANTS SECTION ===
        msqLines.push('[Constants]');
        
        // Core fuel settings
        msqLines.push(`reqFuel=${params.requiredFuel}`);
        msqLines.push(`injOpen=${params.injectorDeadtime}`);
        msqLines.push(`battFac=${params.batteryCorrection}`);
        
        // Rev limiter settings
        msqLines.push(`RevLimRpm2=${params.hardRevLimit}`);
        msqLines.push(`RevLimRpm=${params.softRevLimit}`);
        
        // Engine configuration
        msqLines.push(`nCylinders=${params.cylinders}`);
        msqLines.push(`nInjectors=${params.injectors}`);
        msqLines.push('engineType=0');
        msqLines.push('algorithm=0');
        
        // Sensor settings
        msqLines.push('mapType=0');
        msqLines.push('fanTemp=210');
        msqLines.push('fanHyst=5');
        msqLines.push('primePulse=5.0');
        msqLines.push('egoType=0');
        msqLines.push('egoSwitch=400');
        
        // Ignition settings
        msqLines.push('dwellcont=0');
        msqLines.push('dwellrun=4.0');
        msqLines.push('IdleAdv=15');
        msqLines.push('triggerAngle=0');
        msqLines.push('FixedAngle=10');
        msqLines.push('SparkMode=0');
        msqLines.push('IgInv=1');
        
        // Sensor calibrations
        msqLines.push('mapADC=255,255,255,1023');
        msqLines.push('matADC=32,158,177,121,239,90,252,68');
        msqLines.push('cltADC=32,158,177,121,239,90,252,68');
        msqLines.push('tpsADC=159,921,159,921');
        msqLines.push('egoADC=159,921,123,123');
        msqLines.push('');
        
        // === VE TABLE ===
        msqLines.push('[VETable1]');
        msqLines.push(`xBins=${params.veRpmBins}`);
        msqLines.push(`yBins=${params.veLoadBins}`);
        msqLines.push(`zBins=${params.veTableData}`);
        msqLines.push('');
        
        // === AFR TABLE ===
        msqLines.push('[AFRTable1]');
        msqLines.push(`xBins=${params.afrRpmBins}`);
        msqLines.push(`yBins=${params.afrLoadBins}`);
        msqLines.push(`zBins=${params.afrTableData}`);
        msqLines.push('');
        
        // === SPARK TABLE ===
        msqLines.push('[SparkTable1]');
        msqLines.push(`xBins=${params.sparkRpmBins}`);
        msqLines.push(`yBins=${params.sparkLoadBins}`);
        msqLines.push(`zBins=${params.sparkTableData}`);
        msqLines.push('');
        
        // === COMMENTS ===
        msqLines.push(`# Generated by MS2/Extra Tune Generator`);
        msqLines.push(`# Generated on: ${new Date().toLocaleString()}`);
        msqLines.push(`# SAFETY WARNING: This is a baseline tune. Professional tuning recommended.`);
        
        return msqLines.join('\n');
    }
    
    /**
     * Format table data for MSQ file
     * Converts 2D arrays to comma-separated format
     */
    formatTableData(tableData) {
        return tableData.map(row => row.join(',')).join(',');
    }
    
    /**
     * Generate filename for MSQ file
     * Creates descriptive filename based on engine specs
     */
    generateFilename(tuneData) {
        const date = new Date().toISOString().slice(0, 10);
        const engine = `${tuneData.engineFamily || 'Custom'}_${tuneData.displacement || 306}ci`;
        return `${date}_${engine}_baseline`.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
}

// ===== FILE DOWNLOAD FUNCTION =====

/**
 * Download MSQ file to user's computer
 * Handles browser download functionality
 */
function downloadMSQFile(msqContent, filename) {
    // Create blob with MSQ content
    const blob = new Blob([msqContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename + '.msq';
    downloadLink.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ===== DOCUMENTATION GENERATOR =====

/**
 * Generate tune documentation
 * Creates setup guide and notes for the user
 */
function generateTuneDocumentation(tuneData, validationResults, calculatedParams) {
    const docs = [];
    
    docs.push('# MS2/Extra Tune Documentation');
    docs.push('# Generated by MS2/Extra Tune Generator');
    docs.push(`# Generated on: ${new Date().toLocaleString()}`);
    docs.push('');
    
    // Engine specifications
    docs.push('## ENGINE SPECIFICATIONS');
    docs.push(`Displacement: ${tuneData.displacement} cubic inches`);
    docs.push(`Cylinders: ${tuneData.cylinders}`);
    docs.push(`Compression: ${tuneData.compression}:1`);
    docs.push(`Rev Limit: ${calculatedParams.hardRevLimit} RPM`);
    docs.push('');
    
    // Fuel system
    docs.push('## FUEL SYSTEM');
    docs.push(`RequiredFuel: ${calculatedParams.requiredFuel}ms`);
    docs.push(`Injector Deadtime: ${calculatedParams.injectorDeadtime}ms`);
    docs.push(`Fuel Pressure: ${tuneData.fuelPressure} psi`);
    docs.push('');
    
    // Setup instructions
    docs.push('## INITIAL SETUP PROCEDURE');
    docs.push('1. Flash this tune to your MS2/Extra ECU');
    docs.push('2. Set base timing to 10° BTDC at idle with timing light');
    docs.push('3. Start engine and warm up slowly');
    docs.push('4. Monitor AFR readings closely');
    docs.push('5. Check idle quality and basic operation');
    docs.push('6. Begin VE table tuning with TunerStudio');
    docs.push('');
    
    // Safety warnings
    docs.push('## SAFETY WARNINGS');
    docs.push('- This is a BASELINE tune only');
    docs.push('- Professional tuning recommended for optimal performance');
    docs.push('- Always monitor AFR with wideband O2 sensor');
    docs.push('- Start conservative and advance timing gradually');
    docs.push('- Monitor for knock and engine health');
    docs.push('');
    
    // Validation results
    if (validationResults.warnings.length > 0) {
        docs.push('## WARNINGS');
        validationResults.warnings.forEach(warning => {
            docs.push(`- ${warning}`);
        });
        docs.push('');
    }
    
    if (validationResults.suggestions.length > 0) {
        docs.push('## SUGGESTIONS');
        validationResults.suggestions.forEach(suggestion => {
            docs.push(`- ${suggestion}`);
        });
        docs.push('');
    }
    
    return docs.join('\n');
}

// ===== ADD NEW MSQ FEATURES HERE =====

// Example: Add new table types or MSQ sections
/*
function generateNewTable(engineData) {
    // Your new table generation logic
    return tableData;
}
*/

// Make MSQGenerator available globally
window.MSQGenerator = MSQGenerator;

// MSQ Template loaded successfully
console.log('📄 MSQ template engine loaded successfully');
