// MS2/Extra Tune Generator - Main Application Logic
// Handles UI interactions, form validation, and tune generation orchestration
// Add new UI features and form handlers at the bottom

// ===== MAIN APPLICATION CLASS =====

class TuneGeneratorApp {
    constructor() {
        // Application state
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.componentSpecs = {};
        this.validationResults = { warnings: [], suggestions: [], errors: [] };
        this.msqGenerator = new MSQGenerator();
        this.setupType = 'detailed'; // 'quick' or 'detailed'
        
        // Initialize the application
        this.initializeApp();
    }
    
    // ===== INITIALIZATION =====
    
    initializeApp() {
        console.log('🚀 MS2/Extra Tune Generator Initializing...');
        this.updateProgress();
        this.attachEventListeners();
        this.loadDefaultValues();
    }
    
    attachEventListeners() {
        // Form input change handlers
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select')) {
                this.handleInputChange(e.target);
            }
        });
        
        // Real-time validation on input
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="number"]')) {
                this.handleInputChange(e.target);
            }
        });
        
        // Prevent form submission
        document.addEventListener('submit', (e) => e.preventDefault());
    }
    
    loadDefaultValues() {
        // Set intelligent defaults
        if (document.getElementById('displacement')) document.getElementById('displacement').value = 350;
        if (document.getElementById('cylinders')) document.getElementById('cylinders').value = 8;
        if (document.getElementById('compression')) document.getElementById('compression').value = 9.0;
        if (document.getElementById('fuelPressure')) document.getElementById('fuelPressure').value = 43.5;
        if (document.getElementById('revLimit')) document.getElementById('revLimit').value = 6500;
    }
    
    // ===== STEP NAVIGATION =====
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Validate current step before proceeding
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateNavigation();
                
                // Special handling for final step
                if (this.currentStep === this.totalSteps) {
                    this.prepareFinalStep();
                }
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigation();
        }
    }
    
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update step labels
        document.querySelectorAll('.step-label').forEach((label, index) => {
            label.classList.toggle('active', index + 1 === stepNumber);
        });
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progressPercent = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
                nextBtn.textContent = this.currentStep === this.totalSteps - 1 ? 'Review →' : 'Next →';
            }
        }
    }
    
    // ===== SETUP TYPE SELECTION =====
    
    selectSetupType(type) {
        this.setupType = type;
        console.log(`Setup type selected: ${type}`);
        
        // Show/hide detailed sections based on setup type
        const detailedSections = document.querySelectorAll('#detailedEngineSpecs');
        detailedSections.forEach(section => {
            section.style.display = type === 'detailed' ? 'block' : 'none';
        });
        
        // Auto-advance to next step
        setTimeout(() => this.nextStep(), 300);
    }
    
    // ===== KNOWN COMBO LOADING =====
    
    loadKnownCombo() {
        const comboSelect = document.getElementById('engineCombo');
        if (!comboSelect) return;
        
        const comboKey = comboSelect.value;
        
        if (!comboKey || comboKey === 'custom') {
            const comboInfo = document.getElementById('knownComboInfo');
            if (comboInfo) comboInfo.style.display = 'none';
            return;
        }
        
        const combo = knownCombos[comboKey];
        if (!combo) return;
        
        console.log(`Loading known combo: ${comboKey}`, combo);
        
        // Populate engine specs
        if (document.getElementById('displacement')) document.getElementById('displacement').value = combo.engine.displacement;
        if (document.getElementById('cylinders')) document.getElementById('cylinders').value = combo.engine.cylinders;
        if (document.getElementById('compression')) document.getElementById('compression').value = combo.engine.compression;
        if (document.getElementById('engineFamily')) document.getElementById('engineFamily').value = combo.engine.family;
        
        // Populate fuel specs
        if (document.getElementById('injectorModel')) document.getElementById('injectorModel').value = combo.fuel.injectorModel;
        if (document.getElementById('fuelPressure')) document.getElementById('fuelPressure').value = combo.fuel.fuelPressure;
        if (document.getElementById('fuelType')) document.getElementById('fuelType').value = combo.fuel.fuelType;
        
        // Populate ignition specs
        if (document.getElementById('ignitionCoil')) document.getElementById('ignitionCoil').value = combo.ignition.coilType;
        if (document.getElementById('revLimit')) document.getElementById('revLimit').value = combo.ignition.revLimit;
        
        // Populate camshaft specs
        if (document.getElementById('camProfile')) document.getElementById('camProfile').value = combo.camshaft.profile;
        
        // Load component specs
        this.loadInjectorSpecs();
        this.loadCoilSpecs();
        
        // Show combo info
        const comboInfo = document.getElementById('knownComboInfo');
        if (comboInfo) {
            comboInfo.style.display = 'block';
            comboInfo.innerHTML = `
                <p>✅ Loaded proven combo: <strong>${comboKey.replace(/_/g, ' ')}</strong></p>
                <small>${combo.tuneParams.notes}</small>
            `;
        }
        
        // Store combo data
        this.formData.knownCombo = comboKey;
        this.formData.comboData = combo;
    }
    
    // ===== COMPONENT SPECIFICATION LOADING =====
    
    loadInjectorSpecs() {
        const injectorSelect = document.getElementById('injectorModel');
        if (!injectorSelect) return;
        
        const customSpecs = document.getElementById('customInjectorSpecs');
        const specsDisplay = document.getElementById('injectorSpecs');
        
        // Handle custom injector selection
        if (injectorSelect.value === 'custom') {
            if (customSpecs) customSpecs.style.display = 'block';
            if (specsDisplay) specsDisplay.innerHTML = '';
            
            // Set custom injector specs
            const customSize = document.getElementById('customInjectorSize');
            this.componentSpecs.injector = {
                size: parseFloat(customSize?.value) || 34,
                type: 'Custom',
                deadtime: 0.6,
                batteryCorrection: 0.15
            };
            return;
        }
        
        // Handle unknown injector selection
        if (injectorSelect.value === 'unknown' || !injectorSelect.value) {
            if (customSpecs) customSpecs.style.display = 'none';
            if (specsDisplay) specsDisplay.innerHTML = '<p><strong>Unknown injectors:</strong> Using estimated 34lb specs.</p>';
            
            // Set default injector specs
            this.componentSpecs.injector = {
                size: 34,
                type: 'Estimated',
                deadtime: 0.6,
                batteryCorrection: 0.15
            };
            return;
        }
        
        // Hide custom specs section
        if (customSpecs) customSpecs.style.display = 'none';
        
        // Load injector from database
        const injectorData = injectorDatabase[injectorSelect.value];
        if (injectorData) {
            this.componentSpecs.injector = injectorData;
            
            if (specsDisplay) {
                specsDisplay.innerHTML = `
                    <h4>📋 ${injectorData.size}lb/hr ${injectorData.type} Injector Specs</h4>
                    <ul>
                        <li><strong>Type:</strong> ${injectorData.type} (${injectorData.impedance})</li>
                        <li><strong>Deadtime:</strong> ${injectorData.deadtime}ms</li>
                        <li><strong>Max HP:</strong> ~${injectorData.maxHP}hp</li>
                        <li><strong>Recommended Use:</strong> ${injectorData.recommendedUse.join(', ')}</li>
                        <li><strong>Notes:</strong> ${injectorData.notes}</li>
                    </ul>
                `;
            }
            
            this.validateInjectorSizing();
        } else {
            // Fallback to default specs
            this.componentSpecs.injector = {
                size: 34,
                type: 'Default',
                deadtime: 0.6,
                batteryCorrection: 0.15
            };
        }
    }
    
    loadCoilSpecs() {
        const coilSelect = document.getElementById('ignitionCoil');
        if (!coilSelect) return;
        
        const specsDisplay = document.getElementById('coilSpecs');
        
        if (!coilSelect.value || coilSelect.value === 'unknown') {
            if (specsDisplay) specsDisplay.innerHTML = '<p><strong>Unknown coil:</strong> Will use conservative ignition settings.</p>';
            return;
        }
        
        const coilData = coilDatabase[coilSelect.value];
        if (!coilData) return;
        
        this.componentSpecs.coil = coilData;
        
        if (specsDisplay) {
            specsDisplay.innerHTML = `
                <h4>⚡ ${coilData.type} Coil Specs</h4>
                <ul>
                    <li><strong>Type:</strong> ${coilData.type}</li>
                    <li><strong>Dwell Time:</strong> ${coilData.dwellTime}ms</li>
                    <li><strong>Max RPM:</strong> ${coilData.maxRPM} RPM</li>
                    <li><strong>Spark Energy:</strong> ${coilData.sparkEnergy}</li>
                    <li><strong>Notes:</strong> ${coilData.notes}</li>
                </ul>
            `;
        }
        
        // Auto-adjust rev limit based on coil capability
        const revLimitInput = document.getElementById('revLimit');
        if (revLimitInput && revLimitInput.value > coilData.maxRPM) {
            revLimitInput.value = coilData.maxRPM;
            this.showTemporaryMessage(`Rev limit adjusted to ${coilData.maxRPM} RPM (coil limitation)`, 'warning');
        }
    }
    
    loadWidebandSpecs() {
        const widebandSelect = document.getElementById('widebandSensor');
        if (!widebandSelect) return;
        
        const specsDisplay = document.getElementById('widebandSpecs');
        const warningBox = document.getElementById('widebandWarning');
        
        if (widebandSelect.value === 'none') {
            if (specsDisplay) specsDisplay.innerHTML = '';
            if (warningBox) warningBox.style.display = 'block';
            return;
        }
        
        if (warningBox) warningBox.style.display = 'none';
        
        if (!widebandSelect.value || widebandSelect.value === 'unknown') {
            if (specsDisplay) specsDisplay.innerHTML = '<p><strong>Unknown wideband:</strong> Will use default O2 sensor calibration.</p>';
            return;
        }
        
        const widebandData = widebandDatabase[widebandSelect.value];
        if (!widebandData) return;
        
        this.componentSpecs.wideband = widebandData;
        
        if (specsDisplay) {
            specsDisplay.innerHTML = `
                <h4>📊 ${widebandData.type} Wideband Specs</h4>
                <ul>
                    <li><strong>Sensor:</strong> ${widebandData.type}</li>
                    <li><strong>Output:</strong> ${widebandData.voltage}</li>
                    <li><strong>AFR Range:</strong> ${widebandData.afrRange}</li>
                    <li><strong>Accuracy:</strong> ${widebandData.accuracy}</li>
                    <li><strong>Notes:</strong> ${widebandData.notes}</li>
                </ul>
            `;
        }
    }
    
    loadPumpSpecs() {
        const pumpSelect = document.getElementById('fuelPump');
        if (!pumpSelect || !pumpSelect.value || !fuelPumpDatabase[pumpSelect.value]) return;
        
        const pumpData = fuelPumpDatabase[pumpSelect.value];
        this.componentSpecs.fuelPump = pumpData;
        console.log('Loaded fuel pump specs:', pumpData);
    }
    
    // ===== INPUT CHANGE HANDLER =====
    
    handleInputChange(input) {
        const value = input.type === 'number' ? parseFloat(input.value) : input.value;
        this.formData[input.id] = value;
        
        // Handle special cases
        switch (input.id) {
            case 'engineCombo':
                this.loadKnownCombo();
                break;
            case 'injectorModel':
                this.loadInjectorSpecs();
                break;
            case 'ignitionCoil':
                this.loadCoilSpecs();
                break;
            case 'widebandSensor':
                this.loadWidebandSpecs();
                break;
            case 'fuelPump':
                this.loadPumpSpecs();
                break;
            case 'fuelType':
                this.updateTimingRecommendation();
                break;
            case 'intendedUse':
                this.updateAFRRecommendation();
                break;
            case 'camProfile':
                this.toggleCustomCam();
                break;
        }
        
        // Real-time validation
        this.validateInput(input);
    }
    
    // ===== TOGGLE FUNCTIONS =====
    
    toggleCustomCam() {
        const camProfile = document.getElementById('camProfile');
        const customSpecs = document.getElementById('customCamSpecs');
        
        if (camProfile && customSpecs) {
            customSpecs.style.display = camProfile.value === 'custom' ? 'block' : 'none';
        }
    }
    
    toggleUnknown(fieldName) {
        const checkbox = document.getElementById(`${fieldName}Unknown`);
        const input = document.getElementById(fieldName);
        
        if (checkbox && input) {
            if (checkbox.checked) {
                input.disabled = true;
                input.value = '';
                input.placeholder = 'Will be estimated';
            } else {
                input.disabled = false;
                input.placeholder = input.getAttribute('data-original-placeholder') || '';
            }
        }
    }
    
    // ===== VALIDATION FUNCTIONS =====
    
    validateCurrentStep() {
        let isValid = true;
        
        switch (this.currentStep) {
            case 2: // Engine specs
                isValid = this.validateEngineSpecs();
                break;
            case 3: // Fuel system
                isValid = this.validateFuelSystem();
                break;
            case 4: // Ignition
                isValid = this.validateIgnitionSystem();
                break;
            case 5: // Sensors
                isValid = this.validateSensorSystem();
                break;
        }
        
        return isValid;
    }
    
    validateEngineSpecs() {
        const displacement = parseFloat(document.getElementById('displacement')?.value);
        const compression = parseFloat(document.getElementById('compression')?.value);
        
        if (!displacement || displacement < 50 || displacement > 2000) {
            this.showValidationError('Please enter a valid displacement (50-2000 cubic inches)');
            return false;
        }
        
        const compressionUnknown = document.getElementById('compressionUnknown');
        if (!compressionUnknown?.checked) {
            if (!compression || compression < 6 || compression > 20) {
                this.showValidationError('Please enter a valid compression ratio (6:1 - 20:1)');
                return false;
            }
        }
        
        return true;
    }
    
    validateFuelSystem() {
        const fuelPressure = parseFloat(document.getElementById('fuelPressure')?.value);
        
        if (!fuelPressure || fuelPressure < 20 || fuelPressure > 100) {
            this.showValidationError('Please enter a valid fuel pressure (20-100 psi)');
            return false;
        }
        
        return true;
    }
    
    validateIgnitionSystem() {
        const revLimit = parseFloat(document.getElementById('revLimit')?.value);
        
        if (!revLimit || revLimit < 3000 || revLimit > 10000) {
            this.showValidationError('Please enter a valid rev limit (3000-10000 RPM)');
            return false;
        }
        
        return true;
    }
    
    validateSensorSystem() {
        // Sensors are mostly optional, so always return true
        return true;
    }
    
    validateInput(input) {
        // Individual input validation with real-time feedback
        input.classList.remove('error', 'warning');
        
        if (input.type === 'number') {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            
            if (input.value && (isNaN(value) || (min && value < min) || (max && value > max))) {
                input.classList.add('error');
                return false;
            }
        }
        
        return true;
    }
    
    validateInjectorSizing() {
        const displacement = parseFloat(document.getElementById('displacement')?.value);
        const injectorSize = this.componentSpecs.injector?.size;
        
        if (!displacement || !injectorSize) return;
        
        const estimatedHP = displacement * 1.3; // Conservative HP estimate
        const maxHP = injectorSize * 10; // 10hp per lb/hr rule of thumb
        
        if (estimatedHP > maxHP * 0.8) {
            this.showTemporaryMessage(
                `⚠️ Injectors may be undersized for ${Math.round(estimatedHP)}hp. Consider ${Math.ceil(estimatedHP / 10)}lb+ injectors.`,
                'warning'
            );
        }
        
        if (injectorSize > estimatedHP / 5) {
            this.showTemporaryMessage(
                '⚠️ Large injectors may hurt idle quality. Consider smaller injectors for better drivability.',
                'warning'
            );
        }
    }
    
    // ===== RECOMMENDATION UPDATES =====
    
    updateTimingRecommendation() {
        const fuelType = document.getElementById('fuelType')?.value;
        const recommendationBox = document.getElementById('timingRecommendation');
        
        if (!recommendationBox) return;
        
        const recommendations = {
            '87': '⚠️ Regular fuel selected - timing will be conservative. Consider premium fuel for better performance.',
            '91': '✅ Premium fuel selected - good for moderate timing advance.',
            '93': '✅ High octane selected - allows for aggressive timing optimization.',
            '100': '🏁 Race gas selected - maximum timing potential available.',
            '110': '🏁 High octane race fuel - extreme timing advance possible.',
            'E85': '🌽 E85 selected - excellent knock resistance, cold start considerations apply.'
        };
        
        recommendationBox.innerHTML = `<p>${recommendations[fuelType] || ''}</p>`;
    }
    
    updateAFRRecommendation() {
        const intendedUse = document.getElementById('intendedUse')?.value;
        const afrProfile = afrProfiles[intendedUse?.replace('_', '')] || afrProfiles.street_performance;
        
        // Show AFR targets somewhere in UI if needed
        console.log(`AFR targets for ${intendedUse}:`, afrProfile);
    }
    
    // ===== FINAL STEP PREPARATION =====
    
    prepareFinalStep() {
        this.collectAllFormData();
        this.runFinalValidation();
        this.generateTuneSummary();
    }
    
    collectAllFormData() {
        // Collect all form data
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                this.formData[input.id] = input.checked;
            } else if (input.type === 'number') {
                this.formData[input.id] = parseFloat(input.value) || 0;
            } else {
                this.formData[input.id] = input.value;
            }
        });
        
        // Apply smart defaults for unknown values
        const smartDefaults = calculateSmartDefaults(this.formData);
        Object.keys(smartDefaults).forEach(key => {
            if (!this.formData[key] || this.formData[key + 'Unknown']) {
                this.formData[key] = smartDefaults[key];
                this.formData[key + '_estimated'] = true;
            }
        });
        
        console.log('Final form data:', this.formData);
        console.log('Component specs:', this.componentSpecs);
    }
    
    runFinalValidation() {
        this.validationResults = validateConfiguration(this.formData);
        this.displayValidationResults();
    }
    
    displayValidationResults() {
        const resultsContainer = document.getElementById('validationResults');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = '';
        
        // Display warnings
        this.validationResults.warnings.forEach(warning => {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'validation-warning';
            warningDiv.innerHTML = `<strong>Warning:</strong> ${warning}`;
            resultsContainer.appendChild(warningDiv);
        });
        
        // Display suggestions
        this.validationResults.suggestions.forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'validation-suggestion';
            suggestionDiv.innerHTML = `<strong>Suggestion:</strong> ${suggestion}`;
            resultsContainer.appendChild(suggestionDiv);
        });
        
        // Display errors (if any)
        this.validationResults.errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.innerHTML = `<strong>Error:</strong> ${error}`;
            resultsContainer.appendChild(errorDiv);
        });
    }
    
    generateTuneSummary() {
        const summaryContainer = document.getElementById('tuneSummary');
        if (!summaryContainer) return;
        
        // Calculate preview parameters
        const requiredFuel = calculateRequiredFuel(
            this.formData.displacement,
            this.formData.cylinders,
            this.componentSpecs.injector?.size || this.formData.customInjectorSize || 34,
            this.formData.fuelPressure
        );
        
        summaryContainer.innerHTML = `
            <h3>📋 Tune Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <strong>Engine:</strong> ${this.formData.displacement}${this.formData.displacementUnit || 'ci'} ${this.formData.cylinders}-cyl<br>
                    <strong>Compression:</strong> ${this.formData.compression}:1${this.formData.compression_estimated ? ' (estimated)' : ''}
                </div>
                <div class="summary-item">
                    <strong>Fuel:</strong> ${this.componentSpecs.injector?.size || this.formData.customInjectorSize || 'Est.'}lb injectors<br>
                    <strong>RequiredFuel:</strong> ${requiredFuel}ms
                </div>
                <div class="summary-item">
                    <strong>Ignition:</strong> ${this.componentSpecs.coil?.type || 'Standard'} coil<br>
                    <strong>Rev Limit:</strong> ${this.formData.revLimit} RPM
                </div>
                <div class="summary-item">
                    <strong>Fuel Type:</strong> ${this.formData.fuelType} octane<br>
                    <strong>Intended Use:</strong> ${this.formData.intendedUse?.replace('_', ' ') || 'Street'}
                </div>
            </div>
        `;
    }
    
    // ===== MAIN TUNE GENERATION =====
    
// In the TuneGeneratorApp class, update the generateTune() method:

generateTune() {
    const generateBtn = document.getElementById('generateBtn');
    const resultsContainer = document.getElementById('generationResults');
    
    if (!generateBtn || !resultsContainer) return;
    
    // Show loading state
    generateBtn.innerHTML = '<span class="loading"></span> Generating Tune...';
    generateBtn.disabled = true;
    
    try {
        // Ensure we have the XML exporter available
        if (typeof MSQXmlExporter === 'undefined') {
            throw new Error('MSQ XML Exporter not loaded. Please refresh the page.');
        }
        
        // Generate the MSQ file
        const result = this.msqGenerator.generateMSQ(this.formData, this.componentSpecs);
        
        // Generate documentation if requested
        let documentation = '';
        const includeDocsCheckbox = document.getElementById('includeDocumentation');
        if (includeDocsCheckbox?.checked) {
            documentation = generateTuneDocumentation(this.formData, this.validationResults, result.parameters);
        }
        
        // Show success message
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="success-message">
                <h3>🎉 MS2/Extra Tune Generated Successfully!</h3>
                <p>Your baseline tune has been generated in proper MS2/Extra XML format.</p>
                <p><strong>Signature:</strong> MS2Extra comms342hP</p>
                <p><strong>File Format:</strong> XML (5.0)</p>
                <div class="download-buttons">
                    <button onclick="app.downloadMSQ('${result.filename}', \`${btoa(result.content)}\`)" class="download-btn">
                        📥 Download ${result.filename}.msq
                    </button>
                    ${documentation ? `
                    <button onclick="app.downloadDocumentation('${result.filename}', \`${btoa(documentation)}\`)" class="download-btn">
                        📄 Download Setup Guide
                    </button>
                    ` : ''}
                </div>
                <div class="next-steps">
                    <h4>🚀 Next Steps:</h4>
                    <ol>
                        <li>Open TunerStudio and load this .msq file</li>
                        <li>Flash tune to your MS2/Extra ECU</li>
                        <li>Set base timing to 10° BTDC at idle</li>
                        <li>Start engine and warm up slowly</li>
                        <li>Monitor AFR readings closely</li>
                        <li>Begin VE table tuning</li>
                    </ol>
                    <p><strong>✅ COMPATIBILITY:</strong> This file is compatible with MS2/Extra 3.4.x and TunerStudio.</p>
                    <p><strong>⚠️ SAFETY REMINDER:</strong> This is a baseline tune. Professional tuning recommended for optimal performance and safety.</p>
                </div>
            </div>
        `;
        
        // Auto-download files
        setTimeout(() => {
            this.downloadMSQ(result.filename, btoa(result.content));
            if (documentation) {
                setTimeout(() => {
                    this.downloadDocumentation(result.filename, btoa(documentation));
                }, 1000);
            }
        }, 500);
        
    } catch (error) {
        console.error('Tune generation error:', error);
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="error-message">
                <h3>❌ Generation Error</h3>
                <p>There was an error generating your tune. Please check your inputs and try again.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Note:</strong> Make sure all required files are loaded properly.</p>
            </div>
        `;
    } finally {
        // Restore button
        generateBtn.innerHTML = '🚀 Generate MSQ File';
        generateBtn.disabled = false;
    }
}

    
    // ===== FILE DOWNLOAD FUNCTIONS =====
    
    downloadMSQ(filename, base64Content) {
        const content = atob(base64Content);
        downloadMSQFile(content, filename);
    }
    
    downloadDocumentation(filename, base64Content) {
        const content = atob(base64Content);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename + '_setup_guide.txt';
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    showValidationError(message) {
        alert('⚠️ ' + message); // Could be replaced with a nicer modal
    }
    
    showTemporaryMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `temporary-message ${type}`;
        messageDiv.innerHTML = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'warning' ? '#fff3cd' : '#d4edda'};
            border: 1px solid ${type === 'warning' ? '#ffeaa7' : '#c3e6cb'};
            border-radius: 8px;
            color: ${type === 'warning' ? '#856404' : '#155724'};
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 4000);
    }
}

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK HANDLERS =====

// These functions allow HTML elements to call class methods
function selectSetupType(type) {
    if (window.app) window.app.selectSetupType(type);
}

function nextStep() {
    if (window.app) window.app.nextStep();
}

function prevStep() {
    if (window.app) window.app.prevStep();
}

function generateTune() {
    if (window.app) window.app.generateTune();
}

function loadKnownCombo() {
    if (window.app) window.app.loadKnownCombo();
}

function toggleCustomCam() {
    if (window.app) window.app.toggleCustomCam();
}

function toggleUnknown(fieldName) {
    if (window.app) window.app.toggleUnknown(fieldName);
}

function loadInjectorSpecs() {
    if (window.app) window.app.loadInjectorSpecs();
}

function loadCoilSpecs() {
    if (window.app) window.app.loadCoilSpecs();
}

function loadWidebandSpecs() {
    if (window.app) window.app.loadWidebandSpecs();
}

function loadPumpSpecs() {
    if (window.app) window.app.loadPumpSpecs();
}

function updateTimingRecommendation() {
    if (window.app) window.app.updateTimingRecommendation();
}

function updateAFRRecommendation() {
    if (window.app) window.app.updateAFRRecommendation();
}

// ===== APPLICATION INITIALIZATION =====

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initializing MS2/Extra Tune Generator...');
    window.app = new TuneGeneratorApp();
    console.log('✅ Application initialized successfully!');
});

// Global error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    alert('An unexpected error occurred. Please refresh the page and try again.');
});

// ===== ADD NEW FEATURES HERE =====

// Example: Add new validation functions
/*
function validateNewFeature(formData) {
    // Your validation logic here
    return { isValid: true, message: '' };
}
*/

// Example: Add new component loading functions
/*
TuneGeneratorApp.prototype.loadNewComponentSpecs = function() {
    // Your component loading logic here
};
*/

// Application ready
console.log('🚀 MS2/Extra Tune Generator v1.0 - Ready to create professional tunes!');
