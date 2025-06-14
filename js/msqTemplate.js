// MS2/Extra Tune Generator - MSQ XML File Generation
// Generates proper MS2/Extra 3.4.x XML format files
// Updated to match MS2Extra comms342hP signature

class MSQGenerator {
    constructor() {
        console.log('MS2/Extra XML MSQ Generator initialized');
    }
    
    /**
     * Main MSQ generation function
     * Creates proper MS2/Extra XML format files
     */
    generateMSQ(tuneData, componentSpecs) {
        try {
            // Calculate all parameters needed for MSQ
            const calculatedParams = this.calculateAllParameters(tuneData, componentSpecs);
            
            // Generate tables for XML encoding
            const tables = this.generateTables(tuneData, calculatedParams);
            
            // Create XML MSQ file
            const msqContent = this.generateXMLMSQ(tables, tuneData);
            
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
        
        // === ENGINE SETTINGS ===
        params.cylinders = tuneData.cylinders || 8;
        params.injectors = tuneData.cylinders || 8;
        params.hardRevLimit = tuneData.revLimit || 6500;
        params.softRevLimit = (tuneData.revLimit || 6500) - 300;
        
        return params;
    }
    
    /**
     * Generate all tune tables
     */
    generateTables(tuneData, params) {
        // Generate VE Table (16x16)
        const veTable = generateVETable(tuneData);
        
        // Generate AFR Table (16x16) 
        const afrTable = generateAFRTable(tuneData, tuneData.afrProfile || 'street_performance');
        
        // Generate Timing Table (16x16)
        const timingTable = generateTimingTable(tuneData, tuneData.timingProfile || 'conservative');
        
        return {
            veTable1: veTable.data,
            afrTable1: afrTable.data,
            sparkTable1: timingTable.data,
            veRpmBins: veTable.rpmBins,
            veLoadBins: veTable.loadBins,
            afrRpmBins: afrTable.rpmBins,
            afrLoadBins: afrTable.loadBins,
            sparkRpmBins: timingTable.rpmBins,
            sparkLoadBins: timingTable.loadBins
        };
    }
    
    /**
     * Generate XML MSQ file using the XML exporter
     */
    generateXMLMSQ(tables, tuneData) {
        // Use the XML exporter to create proper MS2/Extra format
        const xmlExporter = new MSQXmlExporter();
        
        const xmlOptions = {
            signature: 'MS2Extra comms342hP',
            revision: '20240609',
            author: 'MS2/Extra Tune Generator',
            comment: `Generated Baseline Tune for ${tuneData.displacement || 306}ci ${tuneData.engineFamily || 'Custom'} Engine`
        };
        
        const tuneForXML = {
            signature: 'MS2Extra comms342hP',
            veTable1: tables.veTable1,
            afrTable1: tables.afrTable1,
            sparkTable1: tables.sparkTable1
        };
        
        return MSQXmlExporter.generate(tuneForXML, xmlOptions);
    }
    
    /**
     * Generate filename for MSQ file
     */
    generateFilename(tuneData) {
        const date = new Date().toISOString().slice(0, 10);
        const engine = `${tuneData.engineFamily || 'Custom'}_${tuneData.displacement || 306}ci`;
        return `${date}_${engine}_baseline`.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
}

/**
 * Download MSQ file to user's computer
 */
function downloadMSQFile(msqContent, filename) {
    const blob = new Blob([msqContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename + '.msq';
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generate tune documentation
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

// Make classes available globally
window.MSQGenerator = MSQGenerator;

console.log('📄 MS2/Extra XML MSQ Generator loaded successfully');
