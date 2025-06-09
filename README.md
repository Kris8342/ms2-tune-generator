# 🚀 MS2/Extra Tune Generator

**Professional baseline tune generator for MegaSquirt MS2/Extra engine management systems**

Generate safe, calculated, and optimized baseline tunes for your MegaSquirt setup in minutes instead of hours. No more dangerous copy/paste tunes or guesswork - this tool uses proven algorithms and component databases to create professional-quality starting points for any engine combination.

![MS2/Extra Tune Generator](https://img.shields.io/badge/Version-1.0-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Platform](https://img.shields.io/badge/Platform-Web-orange)

## ⚡ **Key Features**

### 🎯 **Intelligent Tune Generation**
- **Proven algorithms** calculate RequiredFuel, VE tables, AFR targets, and timing maps
- **Component database** with 100+ injectors, coils, widebands, and fuel pumps
- **Known combo library** featuring community-proven engine setups
- **Smart defaults** estimate missing parameters so generation never fails

### 🛡️ **Safety First Approach**
- **Conservative baselines** designed for immediate safe operation
- **Real-time validation** with warnings for dangerous configurations
- **Professional documentation** with step-by-step setup procedures
- **Rev limit alignment** ensures all tables match safety settings

### 🔧 **Professional Features**
- **Multi-step interface** guides users through complex configuration
- **Auto-populated specs** eliminate manual lookup and errors
- **Complete .msq generation** ready for TunerStudio/MegaTune
- **Comprehensive documentation** includes tuning progression guide

### 📊 **Advanced Calculations**
- **Engine-specific VE tables** based on displacement, cam, and compression
- **Fuel-optimized AFR maps** tailored to octane and intended use
- **Temperature compensation** for cranking, warm-up, and acceleration
- **Sensor calibrations** for MAP, TPS, temperature sensors, and widebands

## 🚀 **Quick Start**

### **Option 1: Use Online (Recommended)**
1. **Visit the live tool:** [Your GitHub Pages URL]
2. **Select your setup type** (Quick or Detailed)
3. **Fill in your specifications** 
4. **Download your custom .msq file**
5. **Flash to your MS2/Extra and start tuning!**

### **Option 2: Run Locally**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ms2-tune-generator.git
   cd ms2-tune-generator
   ```

2. **Open in web browser:**
   ```bash
   # Simply open index.html in your browser
   open index.html  # macOS
   start index.html # Windows
   ```

3. **Or use a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server
   ```

## 📋 **How to Use**

### **Step 1: Choose Setup Method**
- **⚡ Quick Setup:** Basic specs for fast, safe tune generation
- **🔧 Detailed Setup:** Complete component specification for optimized results

### **Step 2: Engine Specifications**
- Enter displacement, cylinders, compression ratio
- Select from popular known combinations or custom setup
- Specify camshaft profile and engine internals

### **Step 3: Fuel System**
- Choose injectors from database or enter custom specs
- Select fuel pump, pressure, and fuel type
- Specify intended use (street, performance, track, etc.)

### **Step 4: Ignition System**
- Select ignition coil from comprehensive database
- Set rev limit and safety level
- Review timing setup guidance

### **Step 5: Sensor System**
- Choose wideband O2 controller (highly recommended)
- Configure MAP sensor range
- Set temperature sensor types

### **Step 6: Generate & Download**
- Review configuration summary
- Address any warnings or suggestions
- Download your custom .msq file and setup documentation

## ⚠️ **IMPORTANT SAFETY INFORMATION**

### **🚨 CRITICAL WARNINGS**
- **This tool generates BASELINE tunes only** - further tuning required
- **ALWAYS monitor AFR** during initial testing with a wideband O2 sensor
- **Professional dyno tuning recommended** for maximum performance and safety
- **Start conservative** - advance timing gradually while monitoring for knock
- **Verify all sensor calibrations** before relying on readings

### **🔧 Initial Setup Procedure**
1. **Set base timing** to 10° BTDC at idle with timing light
2. **Verify timing at 3000 RPM** shows ~34° total (24° mechanical + 10° base)
3. **Start engine and warm slowly** while monitoring AFR readings
4. **Check idle quality** and basic operation before driving
5. **Begin VE table tuning** using TunerStudio's VE Analyze Live

### **📈 Recommended Tuning Progression**
1. **VE Table Tuning** (CRITICAL FIRST STEP)
2. **AFR Target Refinement**
3. **Timing Optimization** (add 1-2° at a time)
4. **Acceleration Enrichment Fine-tuning**

## 🏗️ **Technical Details**

### **Supported Systems**
- **MegaSquirt 2** with MS2/Extra firmware
- **MS2/Extra versions 3.0+** (tested with 3.4.0)
- **TunerStudio** and **MegaTune** compatible

### **File Structure**

