// MS2/Extra Tune Generator - MSQ File Template and Generation
// Handles .msq file creation and population with calculated parameters

// Base MSQ Template Structure (MS2/Extra v3.4.x format)
const msqTemplate = {
    // Header and version info
    header: {
        signature: "MShift v0.01",
        fileVersion: "029y3",
        writeProtect: "0",
        msVersion: "MS2/Extra 3.4.0"
    },
    
    // Core fuel parameters
    fuel: {
        reqFuel: "{{REQUIRED_FUEL}}",
        alternate: "1",
        injOpen: "{{INJECTOR_DEADTIME}}",
        battFac: "{{BATTERY_CORRECTION}}",
        rpmk: "25000",
        rpmRange: "25",
        mapType: "0",
        algorithm: "0",
        baroCorr: "0",
        primePulse: "5.0",
        egoType: "0",
        egoSwitch: "400",
        ego_sampleTime: "200",
        fastIdleT: "160",
        egoRPM: "1500",
        egoLimit: "250",
        ego_delta: "10",
        ego_target: "122",
        iacStart: "{{IAC_STARTUP_STEPS}}",
        iacStepTime: "125",
        iacFastTemp: "{{FAST_IDLE_TEMP}}",
        iacSlowTemp: "180",
        fanTemp: "210",
        fanHyst: "5"
    },
    
    // Ignition parameters
    ignition: {
        triggerAngle: "{{TRIGGER_ANGLE}}",
        FixedAngle: "10",
        CrankAngle: "10",
        IgHold: "{{DWELL_TIME}}",
        dwellcont: "{{DWELL_CONTROL}}",
        dwellcrank: "6.0",
        dwellrun: "4.0",
        numteeth: "36",
        onetwo: "0",
        crank: "1",
        odd: "0",
        SparkMode: "{{SPARK_MODE}}",
        SparkATime: "10",
        SparkBTime: "20",
        IgInv: "{{SPARK_OUTPUT}}",
        IdleAdv: "{{IDLE_TIMING_ADVANCE}}",
        IdleAdvTPS: "2",
        IdleAdvRPM: "200",
        IdleAdvCLT: "160",
        RevLimRpm: "{{SOFT_REV_LIMIT}}",
        RevLimRpm2: "{{HARD_REV_LIMIT}}",
        HardRevLim: "{{HARD_REV_LIMIT}}",
        SoftRevLim: "{{SOFT_REV_LIMIT}}",
        taeBins: "10,20,30,40,50,60,70,80",
        taeRates: "100,90,80,70,60,50,40,30",
        TriggerPulse: "1",
        Oddfire: "0",
        IdleVE: "65",
        FuelLoad: "1"
    },
    
    // VE Table 1 (Primary)
    ve_table1: {
        rpmBins: "{{VE_RPM_BINS}}",
        loadBins: "{{VE_LOAD_BINS}}",
        data: "{{VE_TABLE_DATA}}"
    },
    
    // AFR Table 1 (Primary)
    afr_table1: {
        rpmBins: "{{AFR_RPM_BINS}}",
        loadBins: "{{AFR_LOAD_BINS}}",
        data: "{{AFR_TABLE_DATA}}"
    },
    
    // Timing/Spark Table 1 (Primary)
    spark_table1: {
        rpmBins: "{{SPARK_RPM_BINS}}",
        loadBins: "{{SPARK_LOAD_BINS}}",
        data: "{{SPARK_TABLE_DATA}}"
    },
    
    // Enrichment tables
    enrichment: {
        crankingPW: "{{CRANKING_PULSEWIDTH}}",
        cwh: "{{CRANKING_ENRICHMENT_VALUES}}",
        cwu: "{{CRANKING_TEMP_BINS}}",
        awev: "{{AFTERSTART_ENRICHMENT_VALUES}}",
        aweu: "{{AFTERSTART_TEMP_BINS}}",
        wwu: "{{WARMUP_TEMP_BINS}}",
        wwv: "{{WARMUP_ENRICHMENT_VALUES}}",
        tpsaccel: "{{TPS_ACCEL_AMOUNT}}",
        mapaccel: "{{MAP_ACCEL_AMOUNT}}",
        accelTime: "{{ACCEL_TIME}}",
        accelTaper: "3"
    },
    
    // Sensor calibrations
    sensors: {
        mapADC: "{{MAP_SENSOR_CALIBRATION}}",
        baroADC: "{{BARO_SENSOR_CALIBRATION}}",
        matADC: "{{MAT_SENSOR_CALIBRATION}}",
        cltADC: "{{CLT_SENSOR_CALIBRATION}}",
        tpsADC: "{{TPS_CALIBRATION}}",
        egoADC: "{{EGO_SENSOR_CALIBRATION}}",
        o2_sensor: "{{WIDEBAND_CALIBRATION}}",
        batADC: "255,1020,255,1020",
        mapmin: "10",
        mapmax: "{{MAP_SENSOR_MAX}}",
        mapType: "{{MAP_SENSOR_TYPE}}"
    },
    
    // Advanced settings
    advanced: {
        eaeLoad: "1",
        batteryVoltageCorrection: "1",
        injectorStagingEnabled: "0",
        nCylinders: "{{NUMBER_OF_CYLINDERS}}",
        nInjectors: "{{NUMBER_OF_INJECTORS}}",
        engineType: "{{ENGINE_TYPE}}",
        firingOrder: "{{FIRING_ORDER}}",
        flexFuel: "0",
        launchControl: "0",
        antiLagALS: "0",
        boostControl: "0",
        waterInjection: "0",
        shiftLight: "1",
        fanControl: "1",
        acIdle: "0"
    }
};

// MSQ File Generator Class
class MSQGenerator {
    constructor() {
        this.template = JSON.parse(JSON.stringify(msqTemplate)); // Deep copy
    }
    
    // Main generation function
    generateMSQ(tuneData, componentSpecs) {
        console.log('Generating MSQ with data:', tuneData);
        
        // Calculate all required parameters
        const calculatedParams = this.calculateAllParameters(tuneData, componentSpecs);
        
        // Populate template with calculated values
        const populatedMSQ = this.populateTemplate(calculatedParams);
        
        // Convert to MSQ file format
        const msqContent = this.convertToMSQFormat(populatedMSQ);
        
        return {
            content: msqContent,
            filename: this.generateFilename(tuneData),
            parameters: calculatedParams
        };
    }
    
    // Calculate all parameters from tune data
    calculateAllParameters(tuneData, componentSpecs) {
        const params = {};
        
        // Core fuel calculations
     params.requiredFuel=calculateRequiredFuel(tuneData.displacement||306,tuneData.cylinders||8,(componentSpecs.injector?.size||tuneData.customInjectorSize||34),tuneData.fuelPressure||43.5);

        
        // Injector settings
        const injectorSettings = calculateInjectorSettings(componentSpecs.injector, tuneData.fuelPressure);
        params.injectorDeadtime = injectorSettings.deadtime;
        params.batteryCorrection = injectorSettings.batteryCorrection;
        
        // Generate VE table
        const veTable = generateVETable(tuneData);
        params.veRpmBins = veTable.rpmBins.join(',');
        params.veLoadBins = veTable.loadBins.join(',');
        params.veTableData = this.formatTableData(veTable.data);
        
        // Generate AFR table
        const afrTable = generateAFRTable(tuneData, tuneData.afrProfile);
        params.afrRpmBins = afrTable.rpmBins.join(',');
        params.afrLoadBins = afrTable.loadBins.join(',');
        params.afrTableData = this.formatTableData(afrTable.data);
        
        // Generate timing table
        const timingTable = generateTimingTable(tuneData, tuneData.timingProfile);
        params.sparkRpmBins = timingTable.rpmBins.join(',');
        params.sparkLoadBins = timingTable.loadBins.join(',');
        params.sparkTableData = this.formatTableData(timingTable.data);
        
        // Safety and rev limit settings
        const safetySettings = calculateSafetySettings(tuneData);
        params.hardRevLimit = safetySettings.hardRevLimit;
        params.softRevLimit = safetySettings.softRevLimit;
        
        // Idle control settings
        const idleSettings = calculateIdleSettings(tuneData);
        params.iacStartupSteps = idleSettings.iacStartupSteps;
        params.fastIdleTemp = idleSettings.fastIdleTemp;
        params.idleTimingAdvance = idleSettings.idleTimingAdvance;
        
        // Enrichment tables
        const enrichmentTables = generateEnrichmentTables(tuneData);
        params.crankingTempBins = enrichmentTables.cranking.temperatures.join(',');
        params.crankingEnrichmentValues = enrichmentTables.cranking.enrichment.join(',');
        params.afterstartTempBins = enrichmentTables.afterStart.temperatures.join(',');
        params.afterstartEnrichmentValues = enrichmentTables.afterStart.enrichment.join(',');
        params.warmupTempBins = enrichmentTables.warmup.temperatures.join(',');
        params.warmupEnrichmentValues = enrichmentTables.warmup.enrichment.join(',');
        
        // Acceleration enrichment
        params.tpsAccelAmount = enrichmentTables.acceleration.tpsAmount;
        params.mapAccelAmount = enrichmentTables.acceleration.mapAmount;
        params.accelTime = enrichmentTables.acceleration.decayTime;
        
        // Ignition settings from coil specs
        if (componentSpecs.coil) {
            params.dwellTime = componentSpecs.coil.dwellTime;
            params.dwellControl = componentSpecs.coil.settings.dwellControl === 'dwell_time' ? '1' : '0';
            params.sparkOutput = componentSpecs.coil.settings.sparkOutput === 'going_high' ? '1' : '0';
            params.sparkMode = this.getSparkModeFromCoil(componentSpecs.coil.type);
        } else {
            params.dwellTime = 4.0;
            params.dwellControl = '0';
            params.sparkOutput = '1';
            params.sparkMode = '0';
        }
        
        // Sensor calibrations
        params.mapSensorCalibration = this.getMapSensorCalibration(tuneData.mapSensor);
        params.mapSensorMax = this.getMapSensorMax(tuneData.mapSensor);
        params.mapSensorType = '0'; // Standard MPX4250
        
        if (componentSpecs.wideband) {
            params.widebandCalibration = this.getWidebandCalibration(componentSpecs.wideband);
        } else {
            params.widebandCalibration = '255,255,255,1023'; // Narrowband default
        }
        
        // Engine configuration
        params.numberOfCylinders = tuneData.cylinders;
        params.numberOfInjectors = tuneData.cylinders; // Assume port injection
        params.engineType = '0'; // Even fire
        params.firingOrder = this.getFiringOrder(tuneData.cylinders, tuneData.engineFamily);
        params.triggerAngle = '0'; // Will be adjusted during setup
        
        // Cranking pulsewidth
        params.crankingPulsewidth = (params.requiredFuel * 1.5).toFixed(1);
        
        return params;
    }
    
    // Populate template with calculated parameters
    populateTemplate(params) {
        let msqString = JSON.stringify(this.template);
        
        // Replace all template variables
        const replacements = {
            '{{REQUIRED_FUEL}}': params.requiredFuel,
            '{{INJECTOR_DEADTIME}}': params.injectorDeadtime,
            '{{BATTERY_CORRECTION}}': params.batteryCorrection,
            '{{IAC_STARTUP_STEPS}}': params.iacStartupSteps,
            '{{FAST_IDLE_TEMP}}': params.fastIdleTemp,
            '{{DWELL_TIME}}': params.dwellTime,
            '{{DWELL_CONTROL}}': params.dwellControl,
            '{{SPARK_MODE}}': params.sparkMode,
            '{{SPARK_OUTPUT}}': params.sparkOutput,
            '{{IDLE_TIMING_ADVANCE}}': params.idleTimingAdvance,
            '{{HARD_REV_LIMIT}}': params.hardRevLimit,
            '{{SOFT_REV_LIMIT}}': params.softRevLimit,
            '{{VE_RPM_BINS}}': params.veRpmBins,
            '{{VE_LOAD_BINS}}': params.veLoadBins,
            '{{VE_TABLE_DATA}}': params.veTableData,
            '{{AFR_RPM_BINS}}': params.afrRpmBins,
            '{{AFR_LOAD_BINS}}': params.afrLoadBins,
            '{{AFR_TABLE_DATA}}': params.afrTableData,
            '{{SPARK_RPM_BINS}}': params.sparkRpmBins,
            '{{SPARK_LOAD_BINS}}': params.sparkLoadBins,
            '{{SPARK_TABLE_DATA}}': params.sparkTableData,
            '{{CRANKING_PULSEWIDTH}}': params.crankingPulsewidth,
            '{{CRANKING_TEMP_BINS}}': params.crankingTempBins,
            '{{CRANKING_ENRICHMENT_VALUES}}': params.crankingEnrichmentValues,
            '{{AFTERSTART_TEMP_BINS}}': params.afterstartTempBins,
            '{{AFTERSTART_ENRICHMENT_VALUES}}': params.afterstartEnrichmentValues,
            '{{WARMUP_TEMP_BINS}}': params.warmupTempBins,
            '{{WARMUP_ENRICHMENT_VALUES}}': params.warmupEnrichmentValues,
            '{{TPS_ACCEL_AMOUNT}}': params.tpsAccelAmount,
            '{{MAP_ACCEL_AMOUNT}}': params.mapAccelAmount,
            '{{ACCEL_TIME}}': params.accelTime,
            '{{MAP_SENSOR_CALIBRATION}}': params.mapSensorCalibration,
            '{{BARO_SENSOR_CALIBRATION}}': params.mapSensorCalibration,
            '{{MAT_SENSOR_CALIBRATION}}': '32,158,177,121,239,90,252,68',
            '{{CLT_SENSOR_CALIBRATION}}': '32,158,177,121,239,90,252,68',
            '{{TPS_CALIBRATION}}': '159,921,159,921',
            '{{EGO_SENSOR_CALIBRATION}}': '159,921,123,123',
            '{{WIDEBAND_CALIBRATION}}': params.widebandCalibration,
            '{{MAP_SENSOR_MAX}}': params.mapSensorMax,
            '{{MAP_SENSOR_TYPE}}': params.mapSensorType,
            '{{NUMBER_OF_CYLINDERS}}': params.numberOfCylinders,
            '{{NUMBER_OF_INJECTORS}}': params.numberOfInjectors,
            '{{ENGINE_TYPE}}': params.engineType,
            '{{FIRING_ORDER}}': params.firingOrder,
            '{{TRIGGER_ANGLE}}': params.triggerAngle
        };
        
        Object.keys(replacements).forEach(key => {
            msqString = msqString.replace(new RegExp(key, 'g'), replacements[key]);
        });
        
        return JSON.parse(msqString);
    }
    
    // Convert populated template to MSQ file format
    convertToMSQFormat(populatedTemplate) {
        const msqLines = [];
        
        // MSQ header
        msqLines.push('[MegaSquirt]');
        msqLines.push(`signature=${populatedTemplate.header.signature}`);
        msqLines.push(`fileVersion=${populatedTemplate.header.fileVersion}`);
        msqLines.push(`writeProtect=${populatedTemplate.header.writeProtect}`);
        msqLines.push('');
        
        // Constants section
        msqLines.push('[Constants]');
        
        // Add all fuel parameters
        Object.keys(populatedTemplate.fuel).forEach(key => {
            msqLines.push(`${key}=${populatedTemplate.fuel[key]}`);
        });
        
        // Add ignition parameters
        Object.keys(populatedTemplate.ignition).forEach(key => {
            msqLines.push(`${key}=${populatedTemplate.ignition[key]}`);
        });
        
        // Add sensor calibrations
        Object.keys(populatedTemplate.sensors).forEach(key => {
            msqLines.push(`${key}=${populatedTemplate.sensors[key]}`);
        });
        
        // Add advanced settings
        Object.keys(populatedTemplate.advanced).forEach(key => {
            msqLines.push(`${key}=${populatedTemplate.advanced[key]}`);
        });
        
        // Add enrichment parameters
        Object.keys(populatedTemplate.enrichment).forEach(key => {
            msqLines.push(`${key}=${populatedTemplate.enrichment[key]}`);
        });
        
        msqLines.push('');
        
        // VE Table
        msqLines.push('[VETable1]');
        msqLines.push(`xBins=${populatedTemplate.ve_table1.rpmBins}`);
        msqLines.push(`yBins=${populatedTemplate.ve_table1.loadBins}`);
        msqLines.push(`zBins=${populatedTemplate.ve_table1.data}`);
        msqLines.push('');
        
        // AFR Table
        msqLines.push('[AFRTable1]');
        msqLines.push(`xBins=${populatedTemplate.afr_table1.rpmBins}`);
        msqLines.push(`yBins=${populatedTemplate.afr_table1.loadBins}`);
        msqLines.push(`zBins=${populatedTemplate.afr_table1.data}`);
        msqLines.push('');
        
        // Spark Table
        msqLines.push('[SparkTable1]');
        msqLines.push(`xBins=${populatedTemplate.spark_table1.rpmBins}`);
        msqLines.push(`yBins=${populatedTemplate.spark_table1.loadBins}`);
        msqLines.push(`zBins=${populatedTemplate.spark_table1.data}`);
        msqLines.push('');
        
        // Footer
        msqLines.push(`# Generated by MS2/Extra Tune Generator v1.0`);
        msqLines.push(`# Generated on: ${new Date().toLocaleString()}`);
        msqLines.push(`# SAFETY WARNING: This is a baseline tune. Professional tuning recommended.`);
        
        return msqLines.join('\n');
    }
    
    // Utility functions
    formatTableData(tableData) {
        return tableData.map(row => row.join(',')).join(',');
    }
    
    getSparkModeFromCoil(coilType) {
        const sparkModes = {
            'Distributor': '0',
            'Waste spark': '1',
            'Coil on plug': '2',
            'Single coil': '0'
        };
        return sparkModes[coilType] || '0';
    }
    
    getMapSensorCalibration(mapSensorType) {
        const calibrations = {
            '1bar': '255,255,255,1023',
            '2bar': '10,245,200,1023',
            '3bar': '5,245,300,1023',
            '4bar': '3,245,400,1023'
        };
        return calibrations[mapSensorType] || calibrations['1bar'];
    }
    
    getMapSensorMax(mapSensorType) {
        const maxValues = {
            '1bar': '105',
            '2bar': '200',
            '3bar': '300',
            '4bar': '400'
        };
        return maxValues[mapSensorType] || '105';
    }
    
    getWidebandCalibration(widebandSpecs) {
        if (!widebandSpecs.settings) {
            return '255,255,255,1023'; // Default narrowband
        }
        
        const { lowVoltage, highVoltage, lowAFR, highAFR } = widebandSpecs.settings;
        const lowADC = Math.round(lowVoltage * 204.8); // Convert 0-5V to 0-1023 ADC
        const highADC = Math.round(highVoltage * 204.8);
        
        return `${lowADC},${highADC},${Math.round(lowAFR * 10)},${Math.round(highAFR * 10)}`;
    }
    
    getFiringOrder(cylinders, engineFamily) {
        const firingOrders = {
            4: '1,3,4,2,0,0,0,0',
            6: '1,5,3,6,2,4,0,0',
            8: {
                'Ford_302': '1,5,4,2,6,3,7,8',
                'GM_LS1': '1,8,7,2,6,5,4,3',
                'Chevy_350': '1,8,4,3,6,5,7,2',
                'default': '1,8,4,3,6,5,7,2'
            }
        };
        
        if (cylinders === 8) {
            return firingOrders[8][engineFamily] || firingOrders[8].default;
        }
        
        return firingOrders[cylinders] || firingOrders[8].default;
    }
    
    generateFilename(tuneData) {
        const date = new Date().toISOString().slice(0, 10);
        const engine = `${tuneData.engineFamily}_${tuneData.displacement}ci`;
        const setup = `${tuneData.camProfile}_${tuneData.injectorSize}lb`;
        
        return `${date}_${engine}_${setup}_baseline`.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
}

// File download functionality
function downloadMSQFile(msqContent, filename) {
    const blob = new Blob([msqContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename + '.msq';
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Documentation generator
function generateTuneDocumentation(tuneData, validationResults, calculatedParams) {
    const doc = `
# 🚀 MS2/Extra Tune Documentation
**Generated:** ${new Date().toLocaleString()}

## 🏎️ Engine Configuration
- **Engine:** ${tuneData.displacement}${tuneData.displacementUnit} ${tuneData.cylinders}-cylinder ${tuneData.engineFamily}
- **Compression Ratio:** ${tuneData.compression}:1
- **Camshaft:** ${tuneData.camProfile}
- **Cylinder Heads:** ${tuneData.cylinderHeads || 'Stock'}
- **Intake Manifold:** ${tuneData.intakeManifold || 'Stock'}

## ⛽ Fuel System
- **Injectors:** ${tuneData.injectorSize}lb/hr ${tuneData.injectorType || 'Unknown type'}
- **Fuel Pressure:** ${tuneData.fuelPressure} psi
- **Fuel Type:** ${tuneData.fuelType} octane
- **Fuel Pump:** ${tuneData.fuelPump || 'Stock/Unknown'}
- **Intended Use:** ${tuneData.intendedUse}

## ⚡ Ignition System
- **Coil Type:** ${tuneData.ignitionCoil || 'Stock/Unknown'}
- **Rev Limit:** ${calculatedParams.hardRevLimit} RPM
- **Timing Strategy:** ${tuneData.timingProfile} (${tuneData.safetyLevel} safety level)

## 📊 Calculated Parameters
- **RequiredFuel:** ${calculatedParams.requiredFuel}ms
- **Injector Deadtime:** ${calculatedParams.injectorDeadtime}ms
- **Battery Correction:** ${calculatedParams.batteryCorrection}ms/V
- **IAC Startup Steps:** ${calculatedParams.iacStartupSteps}
- **Target Idle:** ${calculatedParams.fastIdleTemp}°F fast idle threshold

## 🔧 Initial Setup Procedure
### 1. Hardware Setup
- Install wideband O2 sensor (${tuneData.widebandSensor || 'NONE - INSTALL RECOMMENDED'})
- Verify all sensor connections
- Check fuel pressure: ${tuneData.fuelPressure} psi

### 2. Base Timing Setup
- **Disconnect** timing control from ECU
- Set base timing to **10° BTDC** at idle with timing light
- Rev to 3000 RPM, verify **34° total timing**
- Reconnect timing control

### 3. First Start
- Flash this tune to MS2/Extra ECU
- Prime fuel system (turn key on/off 3 times)
- Start engine and warm up **slowly**
- Monitor AFR readings closely
- Check for smooth idle operation

## 📈 Tuning Progression
### Phase 1: VE Table Tuning (CRITICAL FIRST STEP)
1. **Drive normally** while logging with TunerStudio
2. Use **VE Analyze Live** to correct VE table
3. Target **stoichiometric AFR (14.7)** in all cells
4. **Repeat until VE corrections are minimal**

### Phase 2: AFR Target Refinement
1. Adjust AFR targets based on your goals:
   - **Economy:** Higher AFR values (15.0-15.5 cruise)
   - **Performance:** Lower AFR values (12.0-12.5 WOT)
2. Re-log and verify AFR tracking

### Phase 3: Timing Optimization
1. **Start conservative** - this tune uses safe timing
2. **Add 1-2°** at a time in low/mid load areas
3. **Monitor for knock** constantly
4. **Back off immediately** if knock detected
5. **Never exceed 35°** timing without knock monitoring

### Phase 4: Fine Tuning
- Acceleration enrichment adjustment
- Idle quality optimization
- Cold start refinement
- Part-throttle drivability

## ⚠️ SAFETY WARNINGS
${validationResults.warnings.length > 0 ? validationResults.warnings.map(w => `- ${w}`).join('\n') : '- No specific warnings for this configuration'}

## 💡 Suggestions
${validationResults.suggestions.length > 0 ? validationResults.suggestions.map(s => `- ${s}`).join('\n') : '- Configuration looks good!'}

## 🎯 Important Notes
- **This is a BASELINE tune** - further refinement required
- **ALWAYS monitor AFR** during initial testing
- **Professional dyno tuning recommended** for maximum optimization
- **Keep timing conservative** until proven safe on your setup
- **Log everything** - data is critical for safe tuning

## 📞 Support & Resources
- MegaSquirt forums: https://www.msextra.com/forums/
- TunerStudio documentation
- Local MS tuning experts
- Wideband O2 sensor is ESSENTIAL for safe tuning

---
**Generated by MS2/Extra Tune Generator v1.0**
**🚨 USE AT YOUR OWN RISK - TUNING CAN BE DANGEROUS 🚨**
    `.trim();
    
    return doc;
}
function generateTuneDocumentation(tuneData,validationResults,calculatedParams){return`# Generated Tune Documentation\nGenerated: ${new Date().toLocaleString()}\n\nEngine: ${tuneData.displacement}ci ${tuneData.cylinders}-cylinder\nRequiredFuel: ${calculatedParams.requiredFuel}ms\nRev Limit: ${calculatedParams.hardRevLimit} RPM\n\nSAFETY: This is a baseline tune. Professional tuning recommended.\n`;}



// Export the generator class
window.MSQGenerator = MSQGenerator;
