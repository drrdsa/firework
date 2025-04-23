// --- Basic Setup ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// --- Mode Switching Elements ---
const modeToggleButton = document.getElementById('modeToggleButton');
const settingsPanelContainer = document.getElementById('settingsContainer'); // Free play panel container
const plannerPanelContainer = document.getElementById('plannerContainer'); // Planner panel container
const helpButton = document.getElementById('helpButton');
const helpModal = document.getElementById('helpModal');
const closeHelpButton = document.getElementById('closeHelpButton');
// --- Free Play Settings Elements ---
const controlsPanel = document.getElementById('controls'); // The actual controls div inside settingsContainer
const toggleSettingsButton = document.getElementById('toggleSettingsButton');
const toggleAdvancedButton = document.getElementById('toggleAdvancedButton');
const advancedControlsPanel = document.getElementById('advancedControls');
const presetBar = document.getElementById('presetBar');
const togglePresetBarButton = document.getElementById('togglePresetBar');
// Basic Controls
const particleCountInput = document.getElementById('particleCount');
const gravityInput = document.getElementById('gravity');
const particleFrictionInput = document.getElementById('particleFriction');
const trailFadeInput = document.getElementById('trailFade');
const hueCyclingInput = document.getElementById('hueCycling');

// Basic Value Spans
const particleCountValueSpan = document.getElementById('particleCountValue');
const gravityValueSpan = document.getElementById('gravityValue');
const particleFrictionValueSpan = document.getElementById('particleFrictionValue');
const trailFadeValueSpan = document.getElementById('trailFadeValue');
// Advanced Controls
const autoLaunchInput = document.getElementById('autoLaunch');
const launchFrequencyInput = document.getElementById('launchFrequency');
const rocketAccelerationInput = document.getElementById('rocketAcceleration');
const rocketTrailLengthInput = document.getElementById('rocketTrailLength');
const particleTrailLengthInput = document.getElementById('particleTrailLength');
const particleDecayInput = document.getElementById('particleDecay');
// Advanced Value Spans
const launchFrequencyValueSpan = document.getElementById('launchFrequencyValue');
const rocketAccelerationValueSpan = document.getElementById('rocketAccelerationValue');
const rocketTrailLengthValueSpan = document.getElementById('rocketTrailLengthValue');
const particleTrailLengthValueSpan = document.getElementById('particleTrailLengthValue');
const particleDecayValueSpan = document.getElementById('particleDecayValue');
// Firework Type Checkboxes
const fireworkTypeCheckboxes = document.querySelectorAll('#advancedControls input[type="checkbox"][value]');


// --- Planner Elements ---
const showStepsList = document.getElementById('showStepsList');
const stepCountSpan = document.getElementById('stepCount');
const stepTimeInput = document.getElementById('stepTime');
const stepXInput = document.getElementById('stepX');
const stepYInput = document.getElementById('stepY');
const stepTypeInput = document.getElementById('stepType');
const stepHueInput = document.getElementById('stepHue');
const stepHueValueSpan = document.getElementById('stepHueValue');
const addStepButton = document.getElementById('addStepButton');
const playShowButton = document.getElementById('playShowButton');
const clearSequenceButton = document.getElementById('clearSequenceButton');
const saveShowButton = document.getElementById('saveShowButton');
const loadShowButton = document.getElementById('loadShowButton');
const showStatusSpan = document.getElementById('showStatus');
// Need reference to the clear button if it's used outside planner
const clearButton = document.getElementById('clearButton');


// --- Global State ---
let fireworks = [];
let particles = [];
let hue = 120;
let currentMode = 'free-play'; // 'free-play' or 'planner'
let isPlayingShow = false;
let showStartTime = 0;
let showSequence = []; // Array of { time, x, y, type, hue, launched } objects
let animationFrameId = null; // To control the animation loop
const SHOW_STORAGE_KEY = 'fireworkShowData';

// ===========================================================
// PRESET SEQUENCE DATA - Contains all sequences defined so far
// ===========================================================
const presetSequences = {
    // --- Flamboyant + Crazy Sequences ---
    rainingJewelsOverload: [
        { time: 50,  x: 50, y: 25, type: 'burst', hue: 0 }, { time: 150, x: 35, y: 30, type: 'burst', hue: 240 }, { time: 150, x: 65, y: 30, type: 'burst', hue: 120 }, { time: 300, x: 50, y: 20, type: 'ring', hue: 60 }, { time: 400, x: 40, y: 35, type: 'glitter', hue: 45 }, { time: 400, x: 60, y: 35, type: 'glitter', hue: 200 }, { time: 500, x: 25, y: 15, type: 'leaves', hue: 300 }, { time: 500, x: 75, y: 15, type: 'leaves', hue: 180 }, { time: 650, x: 30, y: 25, type: 'glitter', hue: 0 }, { time: 650, x: 70, y: 25, type: 'glitter', hue: 240 }, { time: 800, x: 50, y: 40, type: 'burst', hue: 60 }, { time: 900, x: 45, y: 18, type: 'leaves', hue: 120 }, { time: 900, x: 55, y: 18, type: 'leaves', hue: 30 }, { time: 1000, x: 35, y: 30, type: 'glitter', hue: 300 }, { time: 1000, x: 65, y: 30, type: 'glitter', hue: 180 }, { time: 1150, x: 50, y: 25, type: 'crackle', hue: 45 }, { time: 1300, x: 20, y: 20, type: 'glitter', hue: 0 }, { time: 1300, x: 80, y: 20, type: 'glitter', hue: 240 }, { time: 1400, x: 50, y: 15, type: 'burst', hue: 200 }, { time: 1500, x: 15, y: 25, type: 'glitter', hue: 45 }, { time: 1500, x: 85, y: 25, type: 'glitter', hue: 200 }, { time: 1600, x: 30, y: 20, type: 'glitter', hue: 0 }, { time: 1600, x: 70, y: 20, type: 'glitter', hue: 120 }, { time: 1700, x: 45, y: 15, type: 'glitter', hue: 240 }, { time: 1700, x: 55, y: 15, type: 'glitter', hue: 300 }, { time: 1800, x: 50, y: 20, type: 'strobeGlitter', hue: 60 }, { time: 1900, x: 40, y: 30, type: 'crackle', hue: 45 }, { time: 1900, x: 60, y: 30, type: 'crackle', hue: 200 }, { time: 2000, x: 50, y: 10, type: 'burst', hue: 60 },
    ],
    cyberneticFury: [ // PixelSpray Dominance
        { time: 50,  x: 10, y: 10, type: 'pixelSpray', hue: 180 }, { time: 50,  x: 90, y: 10, type: 'pixelSpray', hue: 300 }, { time: 100, x: 50, y: 5,  type: 'strobeGlitter', hue: 200}, { time: 150, x: 10, y: 40, type: 'pixelSpray', hue: 90 }, { time: 150, x: 90, y: 40, type: 'pixelSpray', hue: 60 }, { time: 250, x: 5,  y: 25, type: 'pixelSpray', hue: 180 }, { time: 300, x: 95, y: 25, type: 'pixelSpray', hue: 300 }, { time: 400, x: 30, y: 10, type: 'pixelSpray', hue: 90 }, { time: 400, x: 70, y: 10, type: 'pixelSpray', hue: 60 }, { time: 500, x: 50, y: 30, type: 'pixelSpray', hue: 180}, { time: 600, x: 10, y: 5,  type: 'pixelSpray', hue: 240}, { time: 600, x: 90, y: 45, type: 'pixelSpray', hue: 0 }, { time: 700, x: 90, y: 5,  type: 'pixelSpray', hue: 120}, { time: 700, x: 10, y: 45, type: 'pixelSpray', hue: 300 }, { time: 850, x: 50, y: 20, type: 'strobeGlitter', hue: 200},
        { time: 1000, x: 10, y: 10, type: 'pixelSpray', hue: 180 }, { time: 1000, x: 30, y: 10, type: 'pixelSpray', hue: 90 }, { time: 1000, x: 50, y: 10, type: 'pixelSpray', hue: 300 }, { time: 1000, x: 70, y: 10, type: 'pixelSpray', hue: 180 }, { time: 1000, x: 90, y: 10, type: 'pixelSpray', hue: 90 }, { time: 1150, x: 10, y: 25, type: 'pixelSpray', hue: 60 }, { time: 1150, x: 30, y: 25, type: 'pixelSpray', hue: 240 }, { time: 1150, x: 50, y: 25, type: 'pixelSpray', hue: 0 }, { time: 1150, x: 70, y: 25, type: 'pixelSpray', hue: 120 }, { time: 1150, x: 90, y: 25, type: 'pixelSpray', hue: 300 }, { time: 1300, x: 10, y: 40, type: 'pixelSpray', hue: 180 }, { time: 1300, x: 30, y: 40, type: 'pixelSpray', hue: 90 }, { time: 1300, x: 50, y: 40, type: 'pixelSpray', hue: 300 }, { time: 1300, x: 70, y: 40, type: 'pixelSpray', hue: 180 }, { time: 1300, x: 90, y: 40, type: 'pixelSpray', hue: 90 }, { time: 1500, x: 50, y: 5,  type: 'strobeGlitter', hue: 200}, { time: 1600, x: 20, y: 15, type: 'pixelSpray', hue: 180 }, { time: 1600, x: 80, y: 35, type: 'pixelSpray', hue: 300 }, { time: 1700, x: 80, y: 15, type: 'pixelSpray', hue: 90 }, { time: 1700, x: 20, y: 35, type: 'pixelSpray', hue: 60 }, { time: 1900, x: 50, y: 25, type: 'pixelSpray', hue: 0 }, { time: 2000, x: 30, y: 20, type: 'pixelSpray', hue: 180 }, { time: 2000, x: 70, y: 30, type: 'pixelSpray', hue: 180 }, { time: 2100, x: 30, y: 30, type: 'pixelSpray', hue: 90 }, { time: 2100, x: 70, y: 20, type: 'pixelSpray', hue: 90 },
        { time: 2500, x: 10, y: 10, type: 'pixelSpray', hue: 180 }, { time: 2500, x: 90, y: 10, type: 'pixelSpray', hue: 300 }, { time: 2600, x: 30, y: 40, type: 'pixelSpray', hue: 90 }, { time: 2600, x: 70, y: 40, type: 'pixelSpray', hue: 60 }, { time: 2700, x: 50, y: 5,  type: 'pixelSpray', hue: 200 }, { time: 2800, x: 10, y: 25, type: 'pixelSpray', hue: 240 }, { time: 2800, x: 90, y: 25, type: 'pixelSpray', hue: 0 }, { time: 2900, x: 50, y: 45, type: 'pixelSpray', hue: 120 }, { time: 3000, x: 20, y: 15, type: 'strobeGlitter', hue: 180 }, { time: 3000, x: 80, y: 35, type: 'strobeGlitter', hue: 300 }, { time: 3100, x: 40, y: 30, type: 'pixelSpray', hue: 45 }, { time: 3100, x: 60, y: 20, type: 'pixelSpray', hue: 210 }, { time: 3300, x: 50, y: 25, type: 'burst', hue: 60 }, { time: 3500, x: 50, y: 25, type: 'pixelSpray', hue: 180 }, { time: 3600, x: 50, y: 25, type: 'pixelSpray', hue: 90 }, { time: 3700, x: 50, y: 25, type: 'pixelSpray', hue: 300 }, { time: 3900, x: 50, y: 25, type: 'strobeGlitter', hue: 200}
    ],

    moltenCoreEruption: [ // Lava Hell Version
        { time: 10, x: 50, y: 85, type: 'groundBloom', hue: 0 }, { time: 10, x: 25, y: 88, type: 'groundBloom', hue: 10 }, { time: 10, x: 75, y: 88, type: 'groundBloom', hue: 10 }, { time: 20, x: 10, y: 80, type: 'crackle', hue: 15 }, { time: 20, x: 90, y: 80, type: 'crackle', hue: 15 }, { time: 30, x: 30, y: 75, type: 'crackle', hue: 20 }, { time: 30, x: 70, y: 75, type: 'crackle', hue: 25 }, { time: 40, x: 50, y: 70, type: 'ring', hue: 5 }, { time: 50, x: 50, y: 72, type: 'ring', hue: 20 }, { time: 60, x: 15, y: 65, type: 'directionalWave', hue: 0}, { time: 60, x: 85, y: 65, type: 'directionalWave', hue: 0}, { time: 80, x: 40, y: 60, type: 'burst', hue: 30}, { time: 80, x: 60, y: 60, type: 'burst', hue: 35}, { time: 100, x: 50, y: 55, type: 'crackle', hue: 45}, { time: 120, x: 45, y: 58, type: 'crackle', hue: 50}, { time: 120, x: 55, y: 58, type: 'crackle', hue: 50}, { time: 150, x: 50, y: 50, type: 'burst', hue: 55},
        { time: 300, x: 50, y: 10, type: 'leaves', hue: 0}, { time: 300, x: 30, y: 12, type: 'leaves', hue: 15}, { time: 300, x: 70, y: 12, type: 'leaves', hue: 15}, { time: 310, x: 15, y: 15, type: 'leaves', hue: 30}, { time: 310, x: 85, y: 15, type: 'leaves', hue: 30}, { time: 320, x: 40, y: 8,  type: 'glitter', hue: 45}, { time: 320, x: 60, y: 8,  type: 'glitter', hue: 45},
        { time: 350, x: 50, y: 40, type: 'directionalWave', hue: 0}, { time: 350, x: 45, y: 45, type: 'crackle', hue: 45 }, { time: 350, x: 55, y: 45, type: 'crackle', hue: 50 }, { time: 350, x: 35, y: 35, type: 'burst', hue: 10 }, { time: 350, x: 65, y: 35, type: 'burst', hue: 10 }, { time: 350, x: 50, y: 30, type: 'burst', hue: 55},
        { time: 400, x: 50, y: 10, type: 'leaves', hue: 5}, { time: 400, x: 48, y: 48, type: 'crackle', hue: 20}, { time: 400, x: 52, y: 48, type: 'crackle', hue: 25}, { time: 450, x: 40, y: 15, type: 'palmTree', hue: 35}, { time: 450, x: 60, y: 15, type: 'palmTree', hue: 40}, { time: 500, x: 50, y: 45, type: 'directionalWave', hue: 30}, { time: 500, x: 25, y: 40, type: 'burst', hue: 0}, { time: 500, x: 75, y: 40, type: 'burst', hue: 0}, { time: 550, x: 50, y: 30, type: 'crackle', hue: 55}, { time: 550, x: 50, y: 25, type: 'crackle', hue: 60}, { time: 600, x: 30, y: 12, type: 'leaves', hue: 10}, { time: 600, x: 70, y: 12, type: 'leaves', hue: 10}, { time: 650, x: 50, y: 8,  type: 'glitter', hue: 50}, { time: 700, x: 10, y: 50, type: 'burst', hue: 0}, { time: 700, x: 90, y: 50, type: 'burst', hue: 0},
        { time: 750, x: 50, y: 40, type: 'crackle', hue: 55 }, { time: 750, x: 45, y: 45, type: 'crackle', hue: 50 }, { time: 750, x: 55, y: 45, type: 'crackle', hue: 50 }, { time: 800, x: 50, y: 20, type: 'leaves', hue: 35 }, { time: 800, x: 35, y: 25, type: 'leaves', hue: 20 }, { time: 800, x: 65, y: 25, type: 'leaves', hue: 25 }, { time: 850, x: 50, y: 35, type: 'burst', hue: 45 }, { time: 850, x: 50, y: 35, type: 'ring', hue: 50 }, { time: 900, x: 40, y: 10, type: 'glitter', hue: 55 }, { time: 900, x: 60, y: 10, type: 'glitter', hue: 55 }, { time: 1000, x: 50, y: 48, type: 'directionalWave', hue: 5}, { time: 1000, x: 25, y: 55, type: 'crackle', hue: 10}, { time: 1000, x: 75, y: 55, type: 'crackle', hue: 10},
        { time: 1100, x: 50, y: 40, type: 'crackle', hue: 60 }, { time: 1100, x: 45, y: 45, type: 'crackle', hue: 55 }, { time: 1100, x: 55, y: 45, type: 'crackle', hue: 55 }, { time: 1150, x: 50, y: 20, type: 'leaves', hue: 40 }, { time: 1150, x: 35, y: 25, type: 'leaves', hue: 30 }, { time: 1150, x: 65, y: 25, type: 'leaves', hue: 35 }, { time: 1200, x: 50, y: 35, type: 'burst', hue: 50 }, { time: 1200, x: 50, y: 35, type: 'ring', hue: 55 }, { time: 1250, x: 40, y: 10, type: 'glitter', hue: 60 }, { time: 1250, x: 60, y: 10, type: 'glitter', hue: 60 },
        { time: 1400, x: 50, y: 48, type: 'directionalWave', hue: 10},{ time: 1400, x: 25, y: 55, type: 'crackle', hue: 15},{ time: 1400, x: 75, y: 55, type: 'crackle', hue: 15},{ time: 1450, x: 50, y: 15, type: 'leaves', hue: 0 }, { time: 1500, x: 30, y: 18, type: 'leaves', hue: 30},{ time: 1500, x: 70, y: 18, type: 'leaves', hue: 35},{ time: 1600, x: 50, y: 45, type: 'burst', hue: 15 },{ time: 1600, x: 50, y: 45, type: 'ring', hue: 20 },
        { time: 1800, x: 20, y: 15, type: 'willow', hue: 0}, { time: 1800, x: 80, y: 15, type: 'willow', hue: 15}, { time: 1900, x: 30, y: 10, type: 'leaves', hue: 30}, { time: 1900, x: 70, y: 10, type: 'leaves', hue: 45}, { time: 2000, x: 50, y: 12, type: 'willow', hue: 55}, { time: 2100, x: 40, y: 18, type: 'leaves', hue: 10}, { time: 2100, x: 60, y: 18, type: 'leaves', hue: 10}, { time: 2200, x: 25, y: 25, type: 'glitter', hue: 45}, { time: 2200, x: 75, y: 25, type: 'glitter', hue: 200}, { time: 2400, x: 50, y: 20, type: 'leaves', hue: 0}, { time: 2600, x: 35, y: 30, type: 'willow', hue: 30 }, { time: 2600, x: 65, y: 30, type: 'willow', hue: 30 }, { time: 2800, x: 50, y: 60, type: 'groundBloom', hue: 5},
        { time: 3000, x: 40, y: 50, type: 'glitter', hue: 15}, { time: 3000, x: 60, y: 50, type: 'glitter', hue: 15}, { time: 3300, x: 50, y: 65, type: 'crackle', hue: 0}, { time: 3700, x: 45, y: 70, type: 'glitter', hue: 10}, { time: 3700, x: 55, y: 70, type: 'glitter', hue: 10}, { time: 3800, x: 50, y: 80, type: 'crackle', hue: 0},
        { time: 2000, x: 71.2, y: 65.0, type: 'leaves', hue: 0 }, { time: 2002, x: 70.8, y: 67.3, type: 'leaves', hue: 350 }, { time: 2004, x: 69.4, y: 69.4, type: 'leaves', hue: 340 }, { time: 2006, x: 67.1, y: 71.3, type: 'leaves', hue: 330 }, { time: 2008, x: 64.1, y: 72.7, type: 'leaves', hue: 320 }, { time: 2010, x: 60.7, y: 73.6, type: 'leaves', hue: 310 }, { time: 2012, x: 57.0, y: 73.8, type: 'leaves', hue: 300 }, { time: 2014, x: 53.2, y: 73.4, type: 'leaves', hue: 290 }, { time: 2016, x: 50.0, y: 72.5, type: 'leaves', hue: 280 }, { time: 2018, x: 46.8, y: 73.4, type: 'leaves', hue: 280 }, { time: 2020, x: 43.0, y: 73.8, type: 'leaves', hue: 275 }, { time: 2022, x: 39.3, y: 73.6, type: 'leaves', hue: 275 }, { time: 2024, x: 35.9, y: 72.7, type: 'leaves', hue: 270 }, { time: 2026, x: 32.9, y: 71.3, type: 'leaves', hue: 270 }, { time: 2028, x: 30.6, y: 69.4, type: 'leaves', hue: 280 }, { time: 2030, x: 29.2, y: 67.3, type: 'leaves', hue: 280 }, { time: 2032, x: 28.8, y: 65.0, type: 'leaves', hue: 285 }, { time: 2034, x: 29.2, y: 62.7, type: 'leaves', hue: 285 }, { time: 2036, x: 30.6, y: 60.6, type: 'leaves', hue: 290 }, { time: 2038, x: 32.9, y: 58.7, type: 'leaves', hue: 290 }, { time: 2040, x: 35.9, y: 57.3, type: 'leaves', hue: 300 }, { time: 2042, x: 39.3, y: 56.4, type: 'leaves', hue: 300 }, { time: 2044, x: 43.0, y: 56.2, type: 'leaves', hue: 310 }, { time: 2046, x: 46.8, y: 56.6, type: 'leaves', hue: 310 }, { time: 2048, x: 50.0, y: 57.5, type: 'leaves', hue: 320 }, { time: 2050, x: 53.2, y: 56.6, type: 'leaves', hue: 320 }, { time: 2052, x: 57.0, y: 56.2, type: 'leaves', hue: 330 }, { time: 2054, x: 60.7, y: 56.4, type: 'leaves', hue: 330 }, { time: 2056, x: 64.1, y: 57.3, type: 'leaves', hue: 340 }, { time: 2058, x: 67.1, y: 58.7, type: 'leaves', hue: 340 }, { time: 2060, x: 69.4, y: 60.6, type: 'leaves', hue: 0 },
        { time: 2570, x: 50, y: 45, type: 'crackle', hue: 10 }
    ],

    digitalHeartbeat: [
        // Phase 1: Draw MASSIVE Heart Outline with MULTIPLE shapeHeart Effects (50ms - 130ms)
        { time: 50, x: 34, y: 30, type: 'shapeHeart', hue: 300 }, { time: 52, x: 35.6, y: 24, type: 'shapeHeart', hue: 305 }, { time: 54, x: 37.2, y: 21, type: 'shapeHeart', hue: 310 }, { time: 56, x: 38.8, y: 20, type: 'shapeHeart', hue: 315 }, { time: 58, x: 40.4, y: 20, type: 'shapeHeart', hue: 320 }, { time: 60, x: 42, y: 20, type: 'shapeHeart', hue: 325 }, { time: 62, x: 43.6, y: 21, type: 'shapeHeart', hue: 330 }, { time: 64, x: 45.2, y: 22, type: 'shapeHeart', hue: 335 }, { time: 66, x: 46.8, y: 24, type: 'shapeHeart', hue: 340 }, { time: 68, x: 48.4, y: 26, type: 'shapeHeart', hue: 345 }, { time: 70, x: 50, y: 30, type: 'shapeHeart', hue: 350 }, { time: 72, x: 51.6, y: 26, type: 'shapeHeart', hue: 345 }, { time: 74, x: 53.2, y: 24, type: 'shapeHeart', hue: 340 }, { time: 76, x: 54.8, y: 22, type: 'shapeHeart', hue: 335 }, { time: 78, x: 56.4, y: 21, type: 'shapeHeart', hue: 330 }, { time: 80, x: 58, y: 20, type: 'shapeHeart', hue: 325 }, { time: 82, x: 59.6, y: 20, type: 'shapeHeart', hue: 320 }, { time: 84, x: 61.2, y: 20, type: 'shapeHeart', hue: 315 }, { time: 86, x: 62.8, y: 21, type: 'shapeHeart', hue: 310 }, { time: 88, x: 64.4, y: 24, type: 'shapeHeart', hue: 305 },
        { time: 90, x: 64.4, y: 39, type: 'shapeHeart', hue: 300 }, { time: 92, x: 62.8, y: 46, type: 'shapeHeart', hue: 295 }, { time: 94, x: 61.2, y: 51, type: 'shapeHeart', hue: 290 }, { time: 96, x: 59.6, y: 55, type: 'shapeHeart', hue: 285 }, { time: 98, x: 58, y: 58, type: 'shapeHeart', hue: 280 }, { time: 100, x: 56.4, y: 60, type: 'shapeHeart', hue: 275 }, { time: 102, x: 54.8, y: 61, type: 'shapeHeart', hue: 280 }, { time: 104, x: 53.2, y: 62, type: 'shapeHeart', hue: 285 }, { time: 106, x: 51.6, y: 63, type: 'shapeHeart', hue: 290 }, { time: 108, x: 50, y: 66, type: 'shapeHeart', hue: 295 },
        { time: 110, x: 48.4, y: 63, type: 'shapeHeart', hue: 300 }, { time: 112, x: 46.8, y: 62, type: 'shapeHeart', hue: 300 }, { time: 114, x: 45.2, y: 61, type: 'shapeHeart', hue: 305 }, { time: 116, x: 43.6, y: 60, type: 'shapeHeart', hue: 305 }, { time: 118, x: 42, y: 58, type: 'shapeHeart', hue: 310 }, { time: 120, x: 40.4, y: 55, type: 'shapeHeart', hue: 310 }, { time: 122, x: 38.8, y: 51, type: 'shapeHeart', hue: 315 }, { time: 124, x: 37.2, y: 46, type: 'shapeHeart', hue: 315 }, { time: 126, x: 35.6, y: 39, type: 'shapeHeart', hue: 310 }, { time: 128, x: 34, y: 30, type: 'shapeHeart', hue: 310 }, { time: 128, x: 56, y: 24, type: 'shapeHeart', hue: 320 } ,
        // Phase 2: Core Pulse & Expansion (130ms - 800ms)
        { time: 140, x: 50, y: 40, type: 'strobeGlitter', hue: 0 }, { time: 150, x: 50, y: 35, type: 'strobeGlitter', hue: 330}, { time: 160, x: 50, y: 30, type: 'strobeGlitter', hue: 45 }, { time: 250, x: 50, y: 35, type: 'ring', hue: 0 }, { time: 280, x: 50, y: 35, type: 'ring', hue: 30 }, { time: 310, x: 50, y: 35, type: 'ring', hue: 45 }, { time: 500, x: 50, y: 30, type: 'burst', hue: 60 }, { time: 520, x: 50, y: 30, type: 'crackle', hue: 45 }, { time: 550, x: 45, y: 35, type: 'crackle', hue: 200 }, { time: 550, x: 55, y: 35, type: 'crackle', hue: 200 },
        // Phase 3: Echo Hearts & Glitter Nebula (800ms - 1800ms)
        { time: 800, x: 30, y: 20, type: 'shapeHeart', hue: 310}, { time: 800, x: 70, y: 20, type: 'shapeHeart', hue: 310}, { time: 900, x: 50, y: 55, type: 'shapeHeart', hue: 45}, { time: 1000, x: 40, y: 15, type: 'glitter', hue: 0 }, { time: 1000, x: 60, y: 15, type: 'glitter', hue: 0 }, { time: 1100, x: 25, y: 30, type: 'glitter', hue: 330}, { time: 1100, x: 75, y: 30, type: 'glitter', hue: 330}, { time: 1200, x: 50, y: 35, type: 'ring', hue: 45 }, { time: 1350, x: 50, y: 32, type: 'strobeGlitter', hue: 0}, { time: 1450, x: 50, y: 20, type: 'shapeHeart', hue: 60}, { time: 1550, x: 35, y: 45, type: 'willow', hue: 300}, { time: 1550, x: 65, y: 45, type: 'willow', hue: 300}, { time: 1700, x: 50, y: 30, type: 'glitter', hue: 200},
        // Phase 4: Hyper Finale Overload (1800ms - 3000ms)
        { time: 1800, x: 50, y: 30, type: 'strobeGlitter', hue: 0 }, { time: 1840, x: 45, y: 30, type: 'strobeGlitter', hue: 330}, { time: 1840, x: 55, y: 30, type: 'strobeGlitter', hue: 45}, { time: 1880, x: 50, y: 25, type: 'strobeGlitter', hue: 200}, { time: 1920, x: 50, y: 35, type: 'strobeGlitter', hue: 310}, { time: 2000, x: 50, y: 28, type: 'shapeHeart', hue: 0}, { time: 2050, x: 50, y: 30, type: 'glitter', hue: 45}, { time: 2100, x: 50, y: 30, type: 'crackle', hue: 60}, { time: 2200, x: 30, y: 20, type: 'glitter', hue: 0},{ time: 2200, x: 70, y: 20, type: 'glitter', hue: 0},{ time: 2300, x: 20, y: 35, type: 'crackle', hue: 330},{ time: 2300, x: 80, y: 35, type: 'crackle', hue: 330},{ time: 2400, x: 40, y: 15, type: 'glitter', hue: 45},{ time: 2400, x: 60, y: 15, type: 'glitter', hue: 45},{ time: 2500, x: 50, y: 45, type: 'crackle', hue: 200},{ time: 2600, x: 40, y: 25, type: 'willow', hue: 200}, { time: 2600, x: 60, y: 25, type: 'willow', hue: 200},{ time: 2800, x: 50, y: 30, type: 'glitter', hue: 60},
        { time: 2650, x: 34, y: 30, type: 'shapeHeart', hue: 300 },
        { time: 2652, x: 35.6, y: 24, type: 'shapeHeart', hue: 305 },
        { time: 2654, x: 37.2, y: 21, type: 'shapeHeart', hue: 310 },
        { time: 2656, x: 38.8, y: 20, type: 'shapeHeart', hue: 315 },
        { time: 2658, x: 40.4, y: 20, type: 'shapeHeart', hue: 320 },
        { time: 2660, x: 42, y: 20, type: 'shapeHeart', hue: 325 },
        { time: 2662, x: 43.6, y: 21, type: 'shapeHeart', hue: 330 },
        { time: 2664, x: 45.2, y: 22, type: 'shapeHeart', hue: 335 },
        { time: 2666, x: 46.8, y: 24, type: 'shapeHeart', hue: 340 },
        { time: 2668, x: 48.4, y: 26, type: 'shapeHeart', hue: 345 },
        { time: 2670, x: 50, y: 30, type: 'shapeHeart', hue: 350 }, // Center Point - Pinkish
        { time: 2672, x: 51.6, y: 26, type: 'shapeHeart', hue: 345 },
        { time: 2674, x: 53.2, y: 24, type: 'shapeHeart', hue: 340 },
        { time: 2676, x: 54.8, y: 22, type: 'shapeHeart', hue: 335 },
        { time: 2678, x: 56.4, y: 21, type: 'shapeHeart', hue: 330 },
        { time: 2680, x: 58, y: 20, type: 'shapeHeart', hue: 325 },
        { time: 2682, x: 59.6, y: 20, type: 'shapeHeart', hue: 320 },
        { time: 2684, x: 61.2, y: 20, type: 'shapeHeart', hue: 315 },
        { time: 2686, x: 62.8, y: 21, type: 'shapeHeart', hue: 310 },
        { time: 2688, x: 64.4, y: 24, type: 'shapeHeart', hue: 305 },
        { time: 2690, x: 64.4, y: 39, type: 'shapeHeart', hue: 300 },
        { time: 2692, x: 62.8, y: 46, type: 'shapeHeart', hue: 295 }, // Start going towards purple
        { time: 2694, x: 61.2, y: 51, type: 'shapeHeart', hue: 290 },
        { time: 2696, x: 59.6, y: 55, type: 'shapeHeart', hue: 285 },
        { time: 2698, x: 58, y: 58, type: 'shapeHeart', hue: 280 },
        { time: 2700, x: 56.4, y: 60, type: 'shapeHeart', hue: 275 },
        { time: 2702, x: 54.8, y: 61, type: 'shapeHeart', hue: 280 },
        { time: 2704, x: 53.2, y: 62, type: 'shapeHeart', hue: 285 },
        { time: 2706, x: 51.6, y: 63, type: 'shapeHeart', hue: 290 },
        { time: 2708, x: 50, y: 66, type: 'shapeHeart', hue: 295 }, // Tip - Purple-ish
        { time: 2710, x: 48.4, y: 63, type: 'shapeHeart', hue: 300 },
        { time: 2712, x: 46.8, y: 62, type: 'shapeHeart', hue: 300 },
        { time: 2714, x: 45.2, y: 61, type: 'shapeHeart', hue: 305 },
        { time: 2716, x: 43.6, y: 60, type: 'shapeHeart', hue: 305 },
        { time: 2718, x: 42, y: 58, type: 'shapeHeart', hue: 310 },
        { time: 2720, x: 40.4, y: 55, type: 'shapeHeart', hue: 310 },
        { time: 2722, x: 38.8, y: 51, type: 'shapeHeart', hue: 315 },
        { time: 2724, x: 37.2, y: 46, type: 'shapeHeart', hue: 315 },
        { time: 2726, x: 35.6, y: 39, type: 'shapeHeart', hue: 310 },
        { time: 2728, x: 34, y: 30, type: 'shapeHeart', hue: 310 },
        { time: 2725, x: 56, y: 24, type: 'shapeHeart', hue: 320 } ,
        {time: 2725, x:66, y: 30, type: 'shapeHeart', hue: 320 }
    ],

        echoOfOblivion: [
            // Phase 1: Unsettling Calm & Tendril Infestation (0 - 1500ms)
            // Start Tendril Rain Wave 1 - Sweeping Top Edge
             { call: 'launchTendrilWave', startTime: 100, duration: 500, density: 25, hueRange: [270, 285], satRange: [15, 30], briRange: [18, 28], xRange: [5, 50] }, // Purple Left Sweep
             { call: 'launchTendrilWave', startTime: 150, duration: 500, density: 25, hueRange: [350, 10], satRange: [25, 40], briRange: [15, 25], xRange: [50, 95] }, // Red Right Sweep
             { call: 'launchTendrilWave', startTime: 200, duration: 500, density: 20, hueRange: [100, 115], satRange: [10, 20], briRange: [20, 30], xRange: [30, 70] }, // Green Center Sweep
            // Low ominous effects build
            { time: 300, x: 50, y: 85, type: 'groundBloom', hue: 280, brightness: 15 },
            { time: 400, x: 50, y: 65, type: 'ring', hue: 0, brightness: 25, radius: 6},
            { time: 500, x: 40, y: 75, type: 'crackle', hue: 275, brightness: 30, decayMultiplier: 1.8 },
            { time: 500, x: 60, y: 75, type: 'crackle', hue: 275, brightness: 30, decayMultiplier: 1.8 },
            // Tendril Rain Wave 2 - Coming from Sides
            { call: 'launchTendrilWave', startTime: 550, duration: 500, density: 30, hueRange: [95, 110], satRange: [15, 25], briRange: [25, 30], xRange: [5, 15], yRange: [10, 50] }, // Green from Left Side
            { call: 'launchTendrilWave', startTime: 600, duration: 500, density: 30, hueRange: [280, 295], satRange: [18, 30], briRange: [15, 25], xRange: [85, 95], yRange: [10, 50] }, // Purple from Right Side
            { time: 800, x: 50, y: 55, type: 'voidCore', size: 'Medium' },
            { time: 1000, x: 50, y: 60, type: 'ring', hue: 280, brightness: 20, radius: 10},
            // Tendril Rain Wave 3 - Pulsing Top Center
            { call: 'launchTendrilWave', startTime: 1050, duration: 400, density: 40, hueRange: [350, 15], satRange: [30, 45], briRange: [18, 28], xRange: [40, 60] }, // Dense Red/Orange Top Center

            // Phase 2: First Sigil & Increasing Chaos (1500ms - 4000ms) -> Shortened duration slightly
             // Tendril Rain Wave 4 - FULL Top Edge Barrage
            { call: 'launchTendrilWave', startTime: 1500, duration: 950, density: 70, hueRange: [0, 15], satRange: [40, 55], briRange: [25, 35], xRange: [5, 95]},     // Intense Red/Orange Full Width
            { call: 'launchTendrilWave', startTime: 1550, duration: 950, density: 60, hueRange: [270, 290], satRange: [20, 35], briRange: [20, 30], xRange: [5, 95] },    // Overlapping Purple Full Width

             // Tendril Strafing Run 1 (Left to Right, Low) - Keep this manual pattern
            { time: 1700, x: 10, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1720, x: 18, y: 66, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1740, x: 26, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1760, x: 34, y: 64, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1780, x: 42, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1800, x: 50, y: 66, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1820, x: 58, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1840, x: 66, y: 64, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1860, x: 74, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1880, x: 82, y: 66, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35}, { time: 1900, x: 90, y: 65, type: 'whisperingTendrils', hue: 0, saturation: 50, brightness: 35},

             // SIGIL BURST 1: Jagged Star (Leaves - Moved earlier for more chaos)
             { time: 2000, x: 50, y: 20, type: 'leaves', hue: 0 }, { time: 2005, x: 70, y: 35, type: 'leaves', hue: 355}, { time: 2010, x: 65, y: 55, type: 'leaves', hue: 350}, { time: 2015, x: 35, y: 55, type: 'leaves', hue: 350}, { time: 2020, x: 30, y: 35, type: 'leaves', hue: 355}, { time: 2025, x: 50, y: 30, type: 'leaves', hue: 5}, { time: 2030, x: 60, y: 40, type: 'leaves', hue: 0}, { time: 2035, x: 55, y: 50, type: 'leaves', hue: 350}, { time: 2040, x: 45, y: 50, type: 'leaves', hue: 350}, { time: 2045, x: 40, y: 40, type: 'leaves', hue: 0},
             { time: 2050, x: 50, y: 40, type: 'crackle', hue: 10 },

             // Void pulses and contrast flashes OVER the sigil and tendrils
            { time: 2200, x: 50, y: 40, type: 'voidCore', size: 'Large'},
            { time: 2400, x: 30, y: 25, type: 'burst', hue: 180, brightness: 100},
            { time: 2400, x: 70, y: 25, type: 'burst', hue: 180, brightness: 100},
             // Tendril Rain Wave 6 - Diagonal Sweeps
            { call: 'launchTendrilWave', startTime: 2500, duration: 1450, density: 80, hueRange: [275, 295], satRange: [15, 30], briRange: [15, 28], xRange: [5, 35], yRange:[5, 15] }, // Purple top-left origin
            { call: 'launchTendrilWave', startTime: 2550, duration: 1400, density: 80, hueRange: [90, 110], satRange: [10, 25], briRange: [20, 35], xRange: [65, 95], yRange:[5, 15] }, // Green top-right origin

            // --- Phase 3: CORRUPTION & SECOND SIGIL (4000ms - 7000ms) -> Compressed time
             // Tendril Rain Wave 7 - Dark and Full Width
            { call: 'launchTendrilWave', startTime: 4000, duration: 2950, density: 120, hueRange: [0, 10], satRange: [40, 60], briRange: [15, 25], xRange:[5, 95] },     // Intense Red/Dark Red
            { call: 'launchTendrilWave', startTime: 4050, duration: 2900, density: 100, hueRange: [270, 285], satRange: [10, 25], briRange: [12, 22], xRange:[5, 95] },   // Overlapping Dark Purple

            // Tendril Strafing Run 2 (Right to Left, High) - Keep manual
             { time: 4200, x: 95, y: 15, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4215, x: 85, y: 16, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4230, x: 75, y: 15, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4245, x: 65, y: 14, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4260, x: 55, y: 15, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4275, x: 45, y: 16, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4290, x: 35, y: 15, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4305, x: 25, y: 14, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4320, x: 15, y: 15, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30}, { time: 4335, x: 5, y: 16, type: 'whisperingTendrils', hue: 5, saturation: 45, brightness: 30},

            // Expanding Void Pulses Overlap Sigil 2
            { time: 4400, x: 50, y: 50, type: 'voidCore', size: 'Medium'},
            { time: 4600, x: 50, y: 45, type: 'voidCore', size: 'Large'},
            { time: 4800, x: 50, y: 40, type: 'voidCore', size: 'Very Large', duration: 'Long'},

            // SIGIL BURST 2: Broken Rune (Leaves - Offset 60, 50) - Launches amidst void
            { time: 4900, x: 60, y: 35, type: 'leaves', hue: 0 }, { time: 4905, x: 75, y: 40, type: 'leaves', hue: 355 }, { time: 4910, x: 65, y: 50, type: 'leaves', hue: 350 }, { time: 4915, x: 70, y: 60, type: 'leaves', hue: 280 }, { time: 4920, x: 55, y: 65, type: 'leaves', hue: 285 }, { time: 4925, x: 45, y: 55, type: 'leaves', hue: 290 }, { time: 4930, x: 50, y: 45, type: 'leaves', hue: 0 }, { time: 4935, x: 40, y: 38, type: 'leaves', hue: 5 }, { time: 4940, x: 68, y: 48, type: 'leaves', hue: 350}, { time: 4945, x: 52, y: 58, type: 'leaves', hue: 280},
            { time: 4950, x: 60, y: 50, type: 'voidCore', size: 'Medium' }, // Void consumes center of Sigil 2

            // Pixel Corruption Spreads WIDELY
            { time: 5000, x: 20, y: 20, type: 'pixelSpray', hue: 100}, { time: 5000, x: 80, y: 60, type: 'pixelSpray', hue: 280},
            { time: 5100, x: 80, y: 20, type: 'pixelSpray', hue: 0}, { time: 5100, x: 20, y: 60, type: 'pixelSpray', hue: 270},
            { time: 5200, x: 50, y: 15, type: 'pixelSpray', hue: 180}, { time: 5200, x: 50, y: 65, type: 'pixelSpray', hue: 90},
            { time: 5300, x: 35, y: 35, type: 'pixelSpray', hue: 45 }, { time: 5300, x: 65, y: 45, type: 'pixelSpray', hue: 300},

             // Piercing Strobes CUT through AGAIN
            { time: 5400, x: 50, y: 40, type: 'strobeGlitter', hue: 180, brightness: 100},
            { time: 5500, x: 50, y: 40, type: 'strobeGlitter', hue: 60, brightness: 100},


            // --- Phase 4: Final Onslaught & Fade (5500ms - 8000ms) --- Approx 7.5s now
             // --- FINAL TENDRIL OVERLOAD (Wave 8 - Max Density/Darkness) ---
            { call: 'launchTendrilWave', startTime: 5500, duration: 2450, density: 200, hueRange: [270, 290], satRange: [5, 15], briRange: [10, 20] }, // MAX DARK PURPLE
            { call: 'launchTendrilWave', startTime: 5550, duration: 2400, density: 200, hueRange: [350, 10], satRange: [5, 20], briRange: [8, 18] }, // MAX DARK RED/BLACK
            { call: 'launchTendrilWave', startTime: 5600, duration: 2350, density: 150, hueRange: [90, 110], satRange: 0, brightness: 15 }, // MAX DESATURATED GREEN/GREY

            // Final Massive Void Pulse
            { time: 5800, x: 50, y: 40, type: 'voidCore', size: 'Very Large', duration: 'Long'}, // CONSUMING VOID START EARLY

            // Final chaotic flashes WITHIN the void/tendrils
            { time: 6000, x: 40, y: 30, type: 'burst', hue: 60, brightness: 100, decayMultiplier: 4},
            { time: 6050, x: 60, y: 50, type: 'crackle', hue: 0, brightness: 50, decayMultiplier: 3},
            { time: 6150, x: 50, y: 20, type: 'strobeGlitter', hue: 180, decayMultiplier: 4},
            { time: 6300, x: 35, y: 55, type: 'burst', hue: 60, brightness: 100, decayMultiplier: 4},
            { time: 6350, x: 65, y: 25, type: 'crackle', hue: 0, brightness: 50, decayMultiplier: 3},
            { time: 6500, x: 50, y: 40, type: 'voidCore', size: 'Very Large', duration: 'Long'}, // Reinforce void

             // The Very End - Let tendrils fade, final sounds
             { time: 7000, x: 50, y: 50, type: 'crackle', hue: 0, brightness: 15, decayMultiplier: 2},
             { time: 7500, x: 50, y: 60, type: 'crackle', hue: 0, brightness: 10, decayMultiplier: 3},
             { time: 7900, x: 50, y: 40, type: 'crackle', hue: 0, brightness: 5, decayMultiplier: 4} // Faintest last crackle

        ], // <-- Check comma if needed
};

// --- Settings Object ---
const settings = {
    // Basic
    particleCount: parseInt(particleCountInput.value),
    gravity: parseFloat(gravityInput.value),
    particleFriction: parseFloat(particleFrictionInput.value),
    trailFade: parseFloat(trailFadeInput.value),
    hueCycling: hueCyclingInput.checked,
    // Advanced
    launchFrequency: parseFloat(launchFrequencyInput.value),
    autoLaunch: autoLaunchInput.checked,
    rocketAcceleration: parseFloat(rocketAccelerationInput.value),
    rocketTrailLength: parseInt(rocketTrailLengthInput.value),
    particleTrailLength: parseInt(particleTrailLengthInput.value),
    particleDecay: parseFloat(particleDecayInput.value),
    allowedFireworkTypes: getSelectedFireworkTypes(),
};

// --- Helper Functions ---
function random(min, max) { return Math.random() * (max - min) + min; }
function calculateDistance(p1x, p1y, p2x, p2y) { const xDistance = p1x - p2x; const yDistance = p1y - p2y; return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)); }
function getSelectedFireworkTypes() {
    const types = [];
    if (fireworkTypeCheckboxes && fireworkTypeCheckboxes.length > 0) {
         fireworkTypeCheckboxes.forEach(cb => {
            if (cb.checked) types.push(cb.value);
        });
    }
    return types.length > 0 ? types : ['standard']; // Fallback
}

// --- Firework Class ---
class Firework {
    constructor(startX, startY, endX, endY, type = 'standard', specificHue = null) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.distanceToTarget = calculateDistance(startX, startY, endX, endY);
        this.distanceTraveled = 0;
        this.cumulativeDistanceTraveled = 0; // Initialize cumulative distance
        this.coordinates = [];
        this.coordinateCount = settings.rocketTrailLength;
        for (let i = 0; i < this.coordinateCount; i++) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(endY - startY, endX - startX);
        this.speed = random(2, 5);
        this.acceleration = settings.rocketAcceleration;
        this.brightness = random(50, 75);
        this.targetRadius = 1;
        this.hue = specificHue !== null ? specificHue : hue;
        this.type = type;
    }

    update(index) {
        this.coordinateCount = settings.rocketTrailLength;
        this.acceleration = settings.rocketAcceleration;
        if(this.coordinates.length > 0) this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        while (this.coordinates.length > this.coordinateCount) this.coordinates.pop();

        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        const prevX = this.x; const prevY = this.y;
        this.x += vx; this.y += vy;
        const distThisFrame = calculateDistance(prevX, prevY, this.x, this.y);
        this.cumulativeDistanceTraveled += distThisFrame;

        if (this.cumulativeDistanceTraveled >= this.distanceToTarget || this.y < 0 || this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
            // console.log(`Firework ${index} exploding! Reason: Dist ${this.cumulativeDistanceTraveled.toFixed(1)} >= Target ${this.distanceToTarget.toFixed(1)} OR Offscreen Y=${this.y.toFixed(0)}`); // DEBUG LOG
            try {
                // Pass potential options from the sequence step to createParticles
                const options = this.options || {}; // Assuming options could be attached to firework if needed
                createParticles(this.endX, this.endY, this.hue, this.type, options); // EXPLODE!
                fireworks.splice(index, 1);
            } catch (e) {
                console.error("Error during explosion:", e, " Firework Data:", this);
                 if(fireworks[index] === this) { fireworks.splice(index, 1); }
            }
        }
    }

    draw() {
       if (this.coordinates.length < 2) return;
        ctx.beginPath();
        const oldestIndex = Math.max(0, this.coordinates.length - 1);
        ctx.moveTo(this.coordinates[oldestIndex][0], this.coordinates[oldestIndex][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        ctx.lineWidth = random(1, 2.5);
        ctx.stroke();
    }
}

// --- Particle Class (Includes separate draw methods & option handling) ---
class Particle {
    constructor(x, y, baseHue, options = {}) {
        this.x = x; this.y = y; this.options = options; this.coordinates = [];
        this.coordinateCount = options.coordinateCount ?? settings.particleTrailLength;
        for (let i = 0; i < this.coordinateCount; i++) { this.coordinates.push([this.x, this.y]); }
        this.angle = options.angle ?? random(0, Math.PI * 2);
        this.speed = options.speed ?? random(1, 12);
        this.friction = options.friction ?? settings.particleFriction;
        this.gravityMultiplier = options.gravityMultiplier ?? 1;
        this.gravity = settings.gravity * this.gravityMultiplier;
        this.hue = options.hue ?? random(baseHue - 25, baseHue + 25);
        this.saturation = options.saturation ?? 100;
        this.brightness = options.brightness ?? random(55, 75); // Lowered default brightness
        this.alpha = options.alpha ?? 1;
        this.lineWidth = options.lineWidth ?? random(1, 2);
        this.decayMultiplier = options.decayMultiplier ?? 1;
        this.decay = (settings.particleDecay * this.decayMultiplier * random(0.8, 1.2));
        this.isCrackleSource = options.isCrackleSource ?? false;
        this.crackleChance = options.crackleChance ?? 0.08;
        this.canCrackle = this.isCrackleSource;
        this.particleType = options.particleType || 'normal';

         if (this.particleType === 'pixel') { this.draw = this.drawPixel; }
         else if (this.particleType === 'void') { this.draw = this.drawVoid; }
         else { this.draw = this.drawTrail; }
    }

    update(index) {
        this.coordinateCount = this.options?.coordinateCount ?? settings.particleTrailLength;
        if (this.coordinates.length > 0) this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        while (this.coordinates.length > this.coordinateCount) this.coordinates.pop();

        this.friction = this.options?.friction ?? settings.particleFriction;
        this.gravity = settings.gravity * this.gravityMultiplier;
        this.decay = (settings.particleDecay * this.decayMultiplier * random(0.8, 1.2));

        this.speed *= this.friction;
        if (this.particleType === 'tendril') { this.angle += random(-0.03, 0.03); }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.canCrackle && this.alpha > 0.1 && this.speed > 0.5 && Math.random() < this.crackleChance) {
           particles.push(new Particle(this.x, this.y, this.hue + random(-20, 20), { speed: random(0.5, 1.5), gravityMultiplier: 0.8, decayMultiplier: 5, brightness: random(80, 100), lineWidth: 0.5, coordinateCount: 2, alpha: Math.min(this.alpha * 1.5, 1.0) }));
        }

        if (this.alpha <= this.decay || this.y > canvas.height + 50 || this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
            particles.splice(index, 1);
        }
    }

    drawTrail() {
        if (this.coordinates.length < 2) return;
         ctx.beginPath(); const oldestIndex = Math.max(0, this.coordinates.length - 1);
         ctx.moveTo(this.coordinates[oldestIndex][0], this.coordinates[oldestIndex][1]); ctx.lineTo(this.x, this.y);
         ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
         ctx.lineWidth = this.lineWidth; ctx.stroke();
    }
    drawPixel() {
         const size = this.options?.pixelSize ?? 6; ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha})`;
         ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
    }
    drawVoid() {
        const size = this.options?.voidSize ?? 20; ctx.save(); ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha * 0.8})`; ctx.beginPath(); ctx.arc(this.x, this.y, size * this.alpha, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
    }
    draw = this.drawTrail; // Default assignment
} // End Particle Class

// --- Create Particles (Includes ALL types and options parameter) ---
function createParticles(x, y, baseHue, type, options = {}) { // Added options parameter
    const count = settings.particleCount;

    switch (type) {
        case 'glitter':
             for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(1, 6), gravityMultiplier: 1.3, decayMultiplier: 1.5, brightness: random(60, 90) })); }
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, baseHue + random(-10, 10), { speed: random(0.5, 2), gravityMultiplier: 0.8, decayMultiplier: 2.5, brightness: random(70, 95), lineWidth: 0.5, coordinateCount: 2 })); }
            break;
        case 'ring': {
            const ringRadius = options.radius ?? random(1.5, 3); const thickness = options.thickness ?? 0.8;
            const angleIncrement = (Math.PI * 2) / count; console.log(`Creating Ring: radius=${ringRadius}, thickness=${thickness}`);
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { angle: angleIncrement * i, speed: ringRadius + random(-thickness / 2, thickness / 2), gravityMultiplier: options.gravityMultiplier ?? 0.7, decayMultiplier: options.decayMultiplier ?? 0.9 })); }
            break;
        }
        case 'burst':
             for (let i = 0; i < count * 1.2; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(8, 18), gravityMultiplier: 0.9, decayMultiplier: 1.1, brightness: random(70, 90), lineWidth: random(1.5, 2.5) })); }
            break;
        case 'leaves':
            for (let i = 0; i < count * 0.8; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(0.5, 2.5), gravityMultiplier: 0.3, decayMultiplier: 0.6, angle: random(Math.PI * 0.4, Math.PI * 0.6), brightness: random(40, 60), lineWidth: random(1.5, 3) })); }
            break;
        case 'fish':
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(5, 15), gravityMultiplier: 0.3, decayMultiplier: 0.9, brightness: random(60, 80), lineWidth: random(1, 2.5) })); }
            break;
        case 'doubleRing': {
            const ringRadius1 = options.radius1 ?? random(1.5, 3); const ringRadius2 = options.radius2 ?? random(4, 6); const thickness1 = options.thickness1 ?? 0.8; const thickness2 = options.thickness2 ?? 1.0;
            const innerParticleCount = Math.floor(count * (options.density1 ?? 0.6)); const outerParticleCount = Math.floor(count * (options.density2 ?? 0.6));
            const angleIncrementInner = (Math.PI * 2) / innerParticleCount; const angleIncrementOuter = (Math.PI * 2) / outerParticleCount; console.log(`Creating Double Ring: r1=${ringRadius1}, r2=${ringRadius2}`);
            const innerHue = options.hue1 ?? baseHue + random(-10, 10);
            for (let i = 0; i < innerParticleCount; i++) { particles.push(new Particle(x, y, innerHue, { angle: angleIncrementInner * i, speed: ringRadius1 + random(-thickness1 / 2, thickness1 / 2), gravityMultiplier: 0.7, decayMultiplier: 0.9, brightness: random(60, 80) })); }
            const outerHue = options.hue2 ?? (baseHue + 90 + random(-20, 20)) % 360;
            for (let i = 0; i < outerParticleCount; i++) { particles.push(new Particle(x, y, outerHue, { angle: angleIncrementOuter * i + random(-0.05, 0.05), speed: ringRadius2 + random(-thickness2 / 2, thickness2 / 2), gravityMultiplier: 0.8, decayMultiplier: 1.0, brightness: random(50, 70) })); }
            break;
        }
        case 'palmTree': {
             const trunkHue = random(50, 70); for (let i = 0; i < count * 0.1; i++) { particles.push(new Particle(x, y, trunkHue, { angle: random(-Math.PI * 0.55, -Math.PI * 0.45), speed: random(8, 15), gravityMultiplier: 0.5, decayMultiplier: 2.0, brightness: random(75, 95), coordinateCount: 4 })); }
             const frondHue = random(45, 55); for (let i = 0; i < count * 0.9; i++) { particles.push(new Particle(x, y, frondHue, { angle: random(Math.PI * 0.1, Math.PI * 0.9), speed: random(2, 6), gravityMultiplier: 1.6, decayMultiplier: 0.6, brightness: random(50, 70), lineWidth: random(1, 2.5) })); }
            break;
        }
        case 'chrysanthemumPistil': {
            const pistilHue = random(0, 360); for (let i = 0; i < count * 0.3; i++) { particles.push(new Particle(x, y, pistilHue, { speed: random(1, 4), gravityMultiplier: 0.8, decayMultiplier: 2.0, brightness: random(90, 100), coordinateCount: 3 })); }
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(4, 10), gravityMultiplier: 1.0, decayMultiplier: 1.0, brightness: random(60, 80) })); }
            break;
        }
        case 'biColorSplit': {
            const hue1 = baseHue; const hue2 = (baseHue + 180 + random(-20, 20)) % 360; const splitAngle = random(0, Math.PI * 2);
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, hue1, { angle: splitAngle + random(0, Math.PI), speed: random(5, 11), brightness: random(65, 85) })); }
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, hue2, { angle: splitAngle + Math.PI + random(0, Math.PI), speed: random(5, 11), brightness: random(65, 85) })); }
            break;
        }
         case 'starPattern': {
            const starAngles = [0, 0.4 * Math.PI, 0.8 * Math.PI, 1.2 * Math.PI, 1.6 * Math.PI]; const particlesPerPoint = Math.floor(count * 0.2);
            for (let i = 0; i < 5; i++) { const targetAngle = starAngles[i]; for (let j = 0; j < particlesPerPoint; j++) { particles.push(new Particle(x, y, baseHue, { angle: targetAngle + random(-0.08, 0.08), speed: random(8, 15), gravityMultiplier: 0.7, decayMultiplier: 1.1, brightness: random(70, 90) })); } }
             for (let i = 0; i < count * 0.1; i++) { particles.push(new Particle(x, y, baseHue + random(-20, 20), { speed: random(1, 4), decayMultiplier: 1.5, brightness: random(50,70) })); }
            break;
        }
        case 'groundBloom': {
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { angle: random(-Math.PI, 0), speed: random(4, 9), gravityMultiplier: 0.9, decayMultiplier: 1.0, brightness: random(60, 80) })); }
            break;
        }
         case 'crackle':
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(3, 8), gravityMultiplier: 1.0, decayMultiplier: 1.0, brightness: random(60, 85), isCrackleSource: true, crackleChance: 0.1 })); }
            break;
        case 'fractalBurst': {
            const generations = 3; const particlesPerGen = Math.max(5, Math.floor(count / (generations * 3))); let currentParticles = [new Particle(x, y, baseHue, { speed: random(1, 3), alpha: 0 })];
            for (let gen = 0; gen < generations; gen++) { let nextGenParticles = []; currentParticles.forEach(parent => { const spawnX = (gen === 0) ? x : parent.x; const spawnY = (gen === 0) ? y : parent.y; const parentAngle = (gen === 0) ? random(0, Math.PI * 2) : parent.angle; for (let i = 0; i < particlesPerGen; i++) { const newOptions = { angle: parentAngle + random(-Math.PI / 4 / (gen + 1), Math.PI / 4 / (gen + 1)), speed: random(4 - gen, 8 - gen * 1.5), hue: (baseHue + gen * 45 + random(-15, 15)) % 360, brightness: random(60 + gen * 5, 90 + gen * 5), decayMultiplier: 1.0 + gen * 0.2, gravityMultiplier: 0.8 + gen * 0.1, lineWidth: Math.max(0.5, 2 - gen * 0.5) }; const newP = new Particle(spawnX, spawnY, newOptions.hue , newOptions); particles.push(newP); nextGenParticles.push(newP); } }); if (particles.length > 2000) { console.warn("Fractal particle limit reached"); break; } currentParticles = nextGenParticles; }
            break;
        }
        case 'chronoStutter': {
            const freezeColor = 200; const burstColor = baseHue; const freezeDuration = 0.5;
            for (let i = 0; i < count * 0.6; i++) { particles.push(new Particle(x, y, freezeColor, { speed: random(0.1, 0.8), gravityMultiplier: 0.1, decayMultiplier: 5 / freezeDuration, brightness: random(95, 100), lineWidth: random(1, 2.5), coordinateCount: 2 })); }
            setTimeout(() => { for (let i = 0; i < count * 0.8; i++) { particles.push(new Particle(x, y, burstColor, { speed: random(5, 15), brightness: random(70, 90) })); } }, freezeDuration * 500 );
            break;
        }
        case 'pixelSpray': {
             const size = Math.max(3, Math.floor(random(4, 10))); const colors = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, colors[i % colors.length], { particleType: 'pixel', pixelSize: size, speed: random(1, 8), gravityMultiplier: 0.6, decayMultiplier: 1.5, brightness: random(70, 90) })); }
             break;
         }
         case 'shapeHeart': { // Paints a heart shape
            const scale = random(0.8, 1.5); // Size of heart
            const particlesForShape = count * 1.5; // Need more particles for density
            for(let i = 0; i < particlesForShape; i++) {
                const t = random(0, Math.PI * 2); // Angle for parametric equation
                // Heart parametric equations
                const heartX = scale * 1.6 * Math.pow(Math.sin(t), 3);
                const heartY = scale * -(1.3 * Math.cos(t) - 0.5 * Math.cos(2*t) - 0.2 * Math.cos(3*t) - 0.1 * Math.cos(4*t));

                // Map parametric coords to speed/angle - simplistic approach
                const angle = Math.atan2(heartY, heartX);
                const speed = Math.sqrt(heartX*heartX + heartY*heartY) * random(1.5, 2.5); // Speed related to distance

                 particles.push(new Particle(x, y, baseHue, {
                    angle: angle,
                    speed: speed,
                    gravityMultiplier: 0.5, // Lower gravity to hold shape longer
                    decayMultiplier: 0.8, // Last slightly longer
                    brightness: random(55, 75),
                    lineWidth: random(1, 2)
                }));
            }
            break;
        }
        case 'directionalWave': {
             const sweepAngle = options.angle ?? random(0, Math.PI * 2); // Use provided angle or default random
             const spread = options.spread ?? Math.PI / 3;
             for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { angle: sweepAngle + random(-spread / 2, spread / 2), speed: random(6, 16), gravityMultiplier: 0.4, decayMultiplier: 1.2, brightness: random(65, 85) })); }
             break;
        }
               // Inside the switch(type) in createParticles:

               case 'whisperingTendrils': { // Existing type - Keep as is, OR ensure physics support options well
                for (let i = 0; i < (options.densityMultiplier ? count * options.densityMultiplier : count * 0.6) ; i++) {
                    particles.push(new Particle(x, y, baseHue, {
                       particleType: 'tendril',
                       angle: options.angle ?? random(0, Math.PI * 2), // Allow angle override
                       speed: options.speed ?? random(0.5, 1.8),
                       gravityMultiplier: options.gravityMultiplier ?? random(0.05, 0.25),
                       decayMultiplier: options.decayMultiplier ?? random(0.08, 0.25),
                       saturation: options.saturation ?? random(20, 40),
                       brightness: options.brightness ?? random(25, 45),
                       lineWidth: options.lineWidth ?? random(0.2, 0.8),
                       coordinateCount: options.coordinateCount ?? random(15, 30)
                    }));
                }
               break;
           }
   
           // --- NEW Type: Tendrils launching UPWARDS ---
           case 'tendrilsUp': {
                for (let i = 0; i < count * 0.8; i++) { // High density for upward rush
                    particles.push(new Particle(x, y, baseHue, {
                       particleType: 'tendril',
                       angle: options.angle ?? random(-Math.PI * 0.7, -Math.PI * 0.3), // Aim primarily UP (-PI/2 is straight up)
                       speed: options.speed ?? random(2, 5), // Faster initial upward speed
                       // Use NEGATIVE gravity or low positive gravity to fight falling back down too fast
                       gravityMultiplier: options.gravityMultiplier ?? random(-0.1, 0.2),
                       decayMultiplier: options.decayMultiplier ?? random(0.3, 0.6), // Don't last *as* long as falling ones
                       saturation: options.saturation ?? random(20, 40),
                       brightness: options.brightness ?? random(30, 50), // Slightly brighter?
                       lineWidth: options.lineWidth ?? random(0.5, 1.2),
                       coordinateCount: options.coordinateCount ?? random(8, 15) // Shorter trail maybe
                    }));
                }
               break;
           }
   
           // --- NEW Type: Simple outward burst OF tendrils ---
           case 'tendrilBurst': {
               for (let i = 0; i < count; i++) { // Launch a full count of tendrils
                   particles.push(new Particle(x, y, baseHue, {
                       particleType: 'tendril',
                       // Standard radial burst angles
                       angle: random(0, Math.PI * 2),
                       speed: options.speed ?? random(1, 4), // Slow outward expansion speed
                       gravityMultiplier: options.gravityMultiplier ?? random(0.1, 0.4), // Low gravity hang time
                       decayMultiplier: options.decayMultiplier ?? random(0.2, 0.5), // Linger fairly long
                       saturation: options.saturation ?? random(30, 50),
                       brightness: options.brightness ?? random(35, 55),
                       lineWidth: options.lineWidth ?? random(0.3, 1.0),
                       coordinateCount: options.coordinateCount ?? random(10, 20)
                    }));
                }
               break;
            }
   
           // --- Keep other necessary types: voidCore, leaves, ring, crackle, strobeGlitter, burst, etc. ---
        case 'voidCore': {
             const voidSize = options.size === 'Large' ? 40 : (options.size === 'Small' ? 15 : 25);
             for (let i = 0; i < count * 0.1; i++) { particles.push(new Particle(x, y, 0, { particleType: 'void', voidSize: voidSize, angle: random(0, Math.PI * 2), speed: random(0.5, 2), gravityMultiplier: 0, decayMultiplier: options.duration === 'Long' ? 0.4 : 1.0, brightness: 0, alpha: 0.9, coordinateCount: 1 })); }
             break;
        }
        case 'strobeGlitter': { // Define strobeGlitter type
             for (let i = 0; i < count * 0.8; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(1, 6), gravityMultiplier: 1.2, decayMultiplier: 1.3, brightness: random(50, 75) })); }
             for (let i = 0; i < count * 0.3; i++) { particles.push(new Particle(x, y, baseHue + random(-10, 10), { speed: random(1, 4), gravityMultiplier: 1.0, decayMultiplier: 2.0, brightness: random(90, 100), lineWidth: random(1, 2), coordinateCount: 3 })); }
             break;
        }
        // --- Default Case ---
        case 'standard':
        default:
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, {})); }
            break;
    } // End Switch
}


// --- Animation Loop ---
function loop(timestamp) {
    animationFrameId = requestAnimationFrame(loop); // Request next frame first

    // --- Clear Canvas ---
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${settings.trailFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1; // Reset default

    // --- Update Global Hue ---
    if (settings.hueCycling && (currentMode === 'free-play' || !isPlayingShow)) {
        hue += 0.5;
        if (hue >= 360) hue -= 360;
    }

    // --- Update and Draw Fireworks & Particles ---
    try {
        let i = fireworks.length; while (i--) { if(fireworks[i]) fireworks[i].update(i); if(fireworks[i]) fireworks[i].draw(); } // Add checks
        let j = particles.length; while (j--) { if(particles[j]) particles[j].update(j); if(particles[j]) particles[j].draw(); } // Add checks
    } catch (e) {
        console.error("Error during update/draw loop:", e);
        // Optionally stop the loop on error to prevent spamming
        // if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    // --- Handle Show Playback ---
    if (isPlayingShow) {
        const elapsedSeconds = (timestamp - showStartTime) / 1000;
        if(showStatusSpan) showStatusSpan.textContent = `Status: Playing (${elapsedSeconds.toFixed(1)}s)`;
        let allLaunched = true;
        for (let k = 0; k < showSequence.length; k++) {
            const step = showSequence[k];
            if (step && !step.launched && elapsedSeconds >= step.time) { // Add check for step existence
                launchFirework(
                    random(canvas.width * 0.4, canvas.width * 0.6), canvas.height,
                    canvas.width * (step.x / 100), canvas.height * (step.y / 100),
                    step.type, step.hue, step // Pass the whole step as options
                );
                step.launched = true;
            }
            if (step && !step.launched) allLaunched = false;
        }
        if (allLaunched) {
             const lastStepTime = showSequence.length > 0 ? showSequence.reduce((max, step) => step ? Math.max(max, step.time) : max, 0) : 0;
             if (elapsedSeconds > lastStepTime + 5.0) stopShow();
        }
    }
    // --- Handle Auto Launch (only in free play) ---
    else if (currentMode === 'free-play' && settings.autoLaunch && random(0, 100) < settings.launchFrequency) {
        const startX = random(canvas.width * 0.4, canvas.width * 0.6);
        const startY = canvas.height;
        const endX = random(0, canvas.width); const endY = random(0, canvas.height * 0.6);
        const allowedTypes = settings.allowedFireworkTypes;
        if (allowedTypes.length > 0) {
             const type = allowedTypes[Math.floor(random(0, allowedTypes.length))];
             launchFirework(startX, startY, endX, endY, type, null);
        }
    }
}

// --- Launch Function (Pass options object) ---
function launchFirework(startX, startY, endX, endY, type, specificHue = null, options = {}) { // Added options
     endX = Math.max(0, Math.min(canvas.width, endX));
     endY = Math.max(0, Math.min(canvas.height, endY));
     const fw = new Firework(startX, startY, endX, endY, type, specificHue);
     fw.options = options; // Attach sequence step options to the firework itself
     fireworks.push(fw);
}

// --- Show Planner Functions ---
function addStepToShow() {
    if (!stepTimeInput || !stepXInput || !stepYInput || !stepTypeInput || !stepHueInput) { console.error("Planner input elements not found!"); return; }
    const time = parseFloat(stepTimeInput.value); const x = parseInt(stepXInput.value); const y = parseInt(stepYInput.value); const type = stepTypeInput.value; const hueVal = parseInt(stepHueInput.value);
    if (isNaN(time) || time < 0 || isNaN(x) || x < 0 || x > 100 || isNaN(y) || y < 0 || y > 100 || !type || isNaN(hueVal) || hueVal < 0 || hueVal > 360) { alert("Please enter valid values for all fields.\nTime >= 0\nX, Y between 0-100\nHue between 0-360"); return; }
    const newStep = { time, x, y, type, hue: hueVal, launched: false };
    showSequence.push(newStep);
    showSequence.sort((a, b) => a.time - b.time); renderShowList();
    stepTimeInput.value = (time + 1.0).toFixed(1);
}
function removeStepFromShow(index) { if (index >= 0 && index < showSequence.length) { showSequence.splice(index, 1); renderShowList(); } }
function renderShowList() {
    if (!showStepsList || !stepCountSpan) return; showStepsList.innerHTML = ''; stepCountSpan.textContent = showSequence.length;
    showSequence.forEach((step, index) => {
        const li = document.createElement('li'); li.dataset.index = index;
        const detailsSpan = document.createElement('span'); detailsSpan.className = 'step-details'; detailsSpan.textContent = `${step.time.toFixed(1)}s - ${step.type} @ (${step.x}%, ${step.y}%) `;
        const colorSpan = document.createElement('span'); colorSpan.className = 'step-color'; colorSpan.style.backgroundColor = `hsl(${step.hue}, 100%, 50%)`; detailsSpan.appendChild(colorSpan);
        const removeBtn = document.createElement('button'); removeBtn.className = 'remove-step'; removeBtn.textContent = 'X'; removeBtn.onclick = (e) => { e.stopPropagation(); removeStepFromShow(index); };
        li.appendChild(detailsSpan); li.appendChild(removeBtn); showStepsList.appendChild(li);
    });
}
function saveShow() { if (isPlayingShow) { alert("Cannot save while show is playing."); return; } try { const sequenceToSave = showSequence.map(({ launched, ...rest }) => rest); localStorage.setItem(SHOW_STORAGE_KEY, JSON.stringify(sequenceToSave)); alert(`Show saved (${showSequence.length} steps).`); } catch (e) { console.error("Error saving show:", e); alert("Could not save show. Local storage might be full or disabled."); } }
function loadShow() { if (isPlayingShow) { alert("Cannot load while show is playing."); return; } try { const savedData = localStorage.getItem(SHOW_STORAGE_KEY); if (savedData) { const loadedSequence = JSON.parse(savedData); showSequence = loadedSequence.map(step => ({ ...step, launched: false })); renderShowList(); alert(`Show loaded (${showSequence.length} steps).`); } else { alert("No saved show found."); } } catch (e) { console.error("Error loading show:", e); alert("Could not load show. Saved data might be corrupted."); showSequence = []; renderShowList(); } }
function clearSequence() { if (isPlayingShow) { alert("Cannot clear while show is playing."); return; } if (confirm("Are you sure you want to clear the current sequence? This cannot be undone.")) { showSequence = []; renderShowList(); } }
function playShow() {
    if (isPlayingShow) return; if (showSequence.length === 0) { alert("Sequence is empty."); return; }
    isPlayingShow = true; if(showStatusSpan) showStatusSpan.textContent = 'Status: Playing (0.0s)';
    if(playShowButton) playShowButton.disabled = true; if(modeToggleButton) modeToggleButton.disabled = true;
    if(settingsPanelContainer) settingsPanelContainer.style.pointerEvents = 'none'; if(plannerPanelContainer) plannerPanelContainer.style.pointerEvents = 'none';
    showSequence.forEach(step => step.launched = false);
    fireworks = []; particles = []; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    showStartTime = performance.now(); console.log("Starting show playback...");
}
function stopShow() {
    isPlayingShow = false; if (showStatusSpan) showStatusSpan.textContent = 'Status: Idle';
    if (playShowButton) playShowButton.disabled = false; if (modeToggleButton) modeToggleButton.disabled = false;
    if(settingsPanelContainer) settingsPanelContainer.style.pointerEvents = 'auto'; if(plannerPanelContainer) plannerPanelContainer.style.pointerEvents = 'auto';
    console.log("Show playback stopped/finished.");
}


// --- Event Listeners ---
function setupEventListeners() {
    // Mode Toggle
    if (modeToggleButton) { modeToggleButton.addEventListener('click', () => { if (isPlayingShow) return; const panelToHide = (currentMode === 'free-play') ? settingsPanelContainer : plannerPanelContainer; const panelToShow = (currentMode === 'free-play') ? plannerPanelContainer : settingsPanelContainer; if (panelToHide) panelToHide.classList.add('hidden'); if (panelToShow) panelToShow.classList.remove('hidden'); if (panelToHide) panelToHide.classList.remove('hidden-by-toggle'); if (panelToShow) panelToShow.classList.remove('hidden-by-toggle'); currentMode = (currentMode === 'free-play') ? 'planner' : 'free-play'; modeToggleButton.textContent = (currentMode === 'free-play') ? 'Switch to Show Planner' : 'Switch to Free Play'; fireworks = []; particles = []; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }); } else { console.error("Mode toggle button not found"); }
    // Main Settings/Planner Panel Toggle
    if (toggleSettingsButton && settingsPanelContainer && plannerPanelContainer) { toggleSettingsButton.addEventListener('click', () => { const activePanel = (currentMode === 'free-play') ? settingsPanelContainer : plannerPanelContainer; activePanel.classList.toggle('hidden-by-toggle'); if (activePanel.classList.contains('hidden-by-toggle')) { toggleSettingsButton.innerHTML = '👁️'; toggleSettingsButton.title = "Show Panel"; } else { toggleSettingsButton.innerHTML = '⚙️'; toggleSettingsButton.title = "Hide Panel"; } console.log("Active Panel Classes after toggle:", activePanel.classList); }); } else { console.error("Could not find #toggleSettingsButton or panel containers"); }
    // Advanced Settings Toggle
    if (toggleAdvancedButton && advancedControlsPanel) { toggleAdvancedButton.addEventListener('click', () => { advancedControlsPanel.classList.toggle('hidden'); toggleAdvancedButton.textContent = advancedControlsPanel.classList.contains('hidden') ? 'Show Advanced Settings' : 'Hide Advanced Settings'; }); } else { console.error("Could not find #toggleAdvancedButton or #advancedControls"); }
    // Preset Bar Toggle
    if (togglePresetBarButton && presetBar) { togglePresetBarButton.addEventListener('click', () => { presetBar.classList.toggle('hidden'); if (presetBar.classList.contains('hidden')) { togglePresetBarButton.innerHTML = '▲'; togglePresetBarButton.title = "Show Preset Bar"; } else { togglePresetBarButton.innerHTML = '▼'; togglePresetBarButton.title = "Hide Preset Bar"; } console.log("Preset Bar Classes:", presetBar.classList); }); } else { console.error("Could not find #togglePresetBar or #presetBar"); }
    // Free Play Input Listeners
    if (particleCountInput) particleCountInput.addEventListener('input', (e) => { settings.particleCount = parseInt(e.target.value); particleCountValueSpan.textContent = e.target.value; });
    if (gravityInput) gravityInput.addEventListener('input', (e) => { settings.gravity = parseFloat(e.target.value); gravityValueSpan.textContent = parseFloat(e.target.value).toFixed(2); });
    if (particleFrictionInput) particleFrictionInput.addEventListener('input', (e) => { settings.particleFriction = parseFloat(e.target.value); particleFrictionValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });
    if (trailFadeInput) trailFadeInput.addEventListener('input', (e) => { settings.trailFade = parseFloat(e.target.value); trailFadeValueSpan.textContent = parseFloat(e.target.value).toFixed(2); });
    if (hueCyclingInput) hueCyclingInput.addEventListener('change', (e) => { settings.hueCycling = e.target.checked; });
    if (autoLaunchInput) autoLaunchInput.addEventListener('change', (e) => { settings.autoLaunch = e.target.checked; });
    if (launchFrequencyInput) launchFrequencyInput.addEventListener('input', (e) => { settings.launchFrequency = parseFloat(e.target.value); launchFrequencyValueSpan.textContent = parseFloat(e.target.value).toFixed(1); });
    if (rocketAccelerationInput) rocketAccelerationInput.addEventListener('input', (e) => { settings.rocketAcceleration = parseFloat(e.target.value); rocketAccelerationValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });
    if (rocketTrailLengthInput) rocketTrailLengthInput.addEventListener('input', (e) => { settings.rocketTrailLength = parseInt(e.target.value); rocketTrailLengthValueSpan.textContent = e.target.value; });
    if (particleTrailLengthInput) particleTrailLengthInput.addEventListener('input', (e) => { settings.particleTrailLength = parseInt(e.target.value); particleTrailLengthValueSpan.textContent = e.target.value; });
    if (particleDecayInput) particleDecayInput.addEventListener('input', (e) => { settings.particleDecay = parseFloat(e.target.value); particleDecayValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });
    if (fireworkTypeCheckboxes && fireworkTypeCheckboxes.length > 0) { fireworkTypeCheckboxes.forEach(checkbox => { checkbox.addEventListener('change', () => { settings.allowedFireworkTypes = getSelectedFireworkTypes(); }); }); }
    // Canvas Click Listener
    canvas.addEventListener('click', (e) => { if (currentMode === 'free-play' && !isPlayingShow) { const startX = random(canvas.width * 0.4, canvas.width * 0.6); const startY = canvas.height; const endX = e.clientX; const endY = e.clientY; const allowedTypes = settings.allowedFireworkTypes; if (allowedTypes.length > 0) { const type = allowedTypes[Math.floor(random(0, allowedTypes.length))]; launchFirework(startX, startY, endX, endY, type, null); } } });
    // Planner Listeners
    if (addStepButton) addStepButton.addEventListener('click', addStepToShow);
    if (playShowButton) playShowButton.addEventListener('click', playShow);
    if (clearSequenceButton) clearSequenceButton.addEventListener('click', clearSequence);
    if (saveShowButton) saveShowButton.addEventListener('click', saveShow);
    if (loadShowButton) loadShowButton.addEventListener('click', loadShow);
    if (stepHueInput && stepHueValueSpan) { stepHueInput.addEventListener('input', (e) => { const hueVal = e.target.value; stepHueValueSpan.textContent = hueVal; stepHueValueSpan.style.backgroundColor = `hsl(${hueVal}, 100%, 50%)`; }); }
    // Clear Button Listener
    if (clearButton) { clearButton.addEventListener('click', () => { if (isPlayingShow) return; fireworks = []; particles = []; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }); }
    // Window Resize Listener
    window.addEventListener('resize', () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); canvas.width = window.innerWidth; canvas.height = window.innerHeight; fireworks = []; particles = []; if (!isPlayingShow) { startAnimation(); } else { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); animationFrameId = requestAnimationFrame(loop); } });

     // Preset Button Listeners (Initial setup)
    setupPresetButtons(); // Call the function that sets up these buttons
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            // helpModal.style.display = 'block'; // Simple show
            helpModal.classList.add('visible'); // Show using class for transitions
            console.log("Help modal opened");
        });
    } else {
        console.error("Help button or modal not found.");
    }

    if (closeHelpButton && helpModal) {
        closeHelpButton.addEventListener('click', () => {
            // helpModal.style.display = 'none'; // Simple hide
            helpModal.classList.remove('visible'); // Hide using class
             console.log("Help modal closed via button");
        });
    } else {
        console.error("Close help button or modal not found.");
    }

    // Optional: Close modal if clicking outside the content box
    if (helpModal) {
        helpModal.addEventListener('click', (event) => {
            // Check if the click target is the modal background itself
            if (event.target === helpModal) {
                 // helpModal.style.display = 'none'; // Simple hide
                 helpModal.classList.remove('visible'); // Hide using class
                 console.log("Help modal closed via background click");
            }
        });
    }

} // End setupEventListeners

 // --- Function to Setup Preset Buttons ---
 function setupPresetButtons() {
    const presetButtonContainer = document.querySelector('#presetBar .preset-buttons');
    if (!presetButtonContainer) { console.warn("Preset button container not found."); return; }

    const presetButtons = presetButtonContainer.querySelectorAll('.preset-button[data-sequence]');

    if (presetButtons && presetButtons.length > 0) {
         presetButtons.forEach(button => {
            const sequenceName = button.dataset.sequence;
            if (presetSequences.hasOwnProperty(sequenceName)) {
                // Remove any old listener before adding a new one (safety measure)
                button.replaceWith(button.cloneNode(true)); // Simple way to remove all listeners
                const newButton = presetButtonContainer.querySelector(`.preset-button[data-sequence="${sequenceName}"]`); // Get the new button reference
                if(newButton) {
                    newButton.addEventListener('click', () => {
                        triggerPresetSequence(sequenceName);
                    });
                }
            } else {
                console.warn(`Sequence "${sequenceName}" for button not found.`);
                button.style.opacity = '0.5'; button.style.cursor = 'not-allowed'; button.disabled = true;
            }
        });
        console.log(`Added listeners for ${presetButtons.length} preset buttons with defined sequences.`);
    } else {
         console.warn("No preset buttons found/defined in HTML to add listeners.");
    }
}

// --- Start Animation Function ---
function startAnimation() {
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
     ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    animationFrameId = requestAnimationFrame(loop);
}


// --- Initial Setup ---
function init() {
    console.log("Initializing Fireworks...");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    // Set initial text spans
    if (particleCountValueSpan) particleCountValueSpan.textContent = settings.particleCount;
    if (gravityValueSpan) gravityValueSpan.textContent = settings.gravity.toFixed(2);
    if (particleFrictionValueSpan) particleFrictionValueSpan.textContent = settings.particleFriction.toFixed(3);
    if (trailFadeValueSpan) trailFadeValueSpan.textContent = settings.trailFade.toFixed(2);
    if (launchFrequencyValueSpan) launchFrequencyValueSpan.textContent = settings.launchFrequency.toFixed(1);
    if (rocketAccelerationValueSpan) rocketAccelerationValueSpan.textContent = settings.rocketAcceleration.toFixed(3);
    if (rocketTrailLengthValueSpan) rocketTrailLengthValueSpan.textContent = settings.rocketTrailLength;
    if (particleTrailLengthValueSpan) particleTrailLengthValueSpan.textContent = settings.particleTrailLength;
    if (particleDecayValueSpan) particleDecayValueSpan.textContent = settings.particleDecay.toFixed(3);

    // Initial UI state
    if (advancedControlsPanel) advancedControlsPanel.classList.add('hidden');
    if (toggleAdvancedButton) toggleAdvancedButton.textContent = 'Show Advanced Settings';
    if (stepHueInput && stepHueValueSpan) { stepHueValueSpan.textContent = stepHueInput.value; stepHueValueSpan.style.backgroundColor = `hsl(${stepHueInput.value}, 100%, 50%)`; }
    if (plannerPanelContainer) plannerPanelContainer.classList.add('hidden');
    if (settingsPanelContainer) settingsPanelContainer.classList.remove('hidden');
    if (settingsPanelContainer) settingsPanelContainer.classList.remove('hidden-by-toggle');
    if (toggleSettingsButton) { toggleSettingsButton.innerHTML = '⚙️'; toggleSettingsButton.title = "Hide Panel"; }
    if (presetBar) presetBar.classList.remove('hidden');
    if (togglePresetBarButton) { togglePresetBarButton.innerHTML = '▼'; togglePresetBarButton.title = "Hide Preset Bar"; }
    currentMode = 'free-play';
    if (modeToggleButton) modeToggleButton.textContent = 'Switch to Show Planner';

    renderShowList();
    setupEventListeners(); // Call function to attach ALL listeners (including presets)
    startAnimation();
    console.log("Initialization Complete. Animation Started.");
}
// --- NEW HELPER FUNCTION for Spamming Tendrils ---
// --- ENHANCED HELPER FUNCTION for Spamming Tendrils ---
// --- ENHANCED HELPER FUNCTION for Spamming Tendrils/Effects ---
function launchTendrilWave(startTime, duration, density, hueRange, satRange, briRange, xRange = [5, 95], yRange = [5, 50], angleOverride = null, effectType = 'whisperingTendrils', options = {}) {
    // console.log(`Scheduling wave: type=${effectType}, start=${startTime}, dur=${duration}, dens=${density}, xR=${xRange}, yR=${yRange}`);

    for (let i = 0; i < density; i++) {
        const launchTime = startTime + random(0, duration);
        const xPosPercent = random(xRange[0], xRange[1]);
        const yPosPercent = random(yRange[0], yRange[1]);
        const hue = random(hueRange[0], hueRange[1]);
        const saturation = random(satRange[0], satRange[1]);
        const brightness = random(briRange[0], briRange[1]);

        // Merge base options with per-tendril variations
        const finalOptions = {
            saturation: saturation,
            brightness: brightness,
            decayMultiplier: random(0.08, 0.20), // Default tendril options
            speed: random(0.3, 1.2),
            gravityMultiplier: random(0.02, 0.15),
            ...options // Allow sequence step to override defaults
        };
        // If an angle is specifically passed (e.g., for side waves), use it
        if (angleOverride !== null) {
             finalOptions.angle = angleOverride + random(-0.2, 0.2); // Add small variance
        }

        setTimeout(() => {
            launchFirework(
                random(canvas.width * 0.4, canvas.width * 0.6), canvas.height,
                canvas.width * (xPosPercent / 100),
                canvas.height * (yPosPercent / 100),
                effectType, // Use specified type
                hue,
                finalOptions // Pass the merged options
            );
        }, launchTime);
    }
}
// --- Trigger Preset Sequence ---
// --- Modify the triggerPresetSequence function ---
function triggerPresetSequence(sequenceName) {
    if (currentMode !== 'free-play' || isPlayingShow) {
        console.log("Preset trigger blocked: Mode is not free-play or show is playing."); return;
    }
    const sequence = presetSequences[sequenceName];
    if (!sequence) { console.error(`ERROR: Sequence data for "${sequenceName}" not found!`); return; }

    console.log(`SUCCESS: Found sequence "${sequenceName}". Processing ${sequence.length} steps.`);

    // --- PROCESS SEQUENCE STEPS ---
    sequence.forEach((step, index) => {
        // Check if this step is a special 'call' type for our helper
        if (step.call === 'launchTendrilWave') {
            console.log(`Processing step ${index}: Calling launchTendrilWave`);
            // Call the helper function, passing the parameters defined in the step
            launchTendrilWave(
                step.startTime,
                step.duration,
                step.density,
                step.hueRange,
                step.satRange,
                step.briRange
            );
        }
        // --- Else, handle normal firework launch steps ---
        else if (step.type) { // Check if it's a standard firework step
             // SPECIAL HANDLING for Heart Outline (or remove if not needed anymore)
             if (sequenceName === 'digitalHeartbeat_UserEq_Deprecated') { // Deprecated example name
                  // Skip normal processing for outline steps if calculated elsewhere
                 return;
             }

            // Standard Timeout scheduling for single fireworks
            setTimeout(() => {
                const targetX = canvas.width * (step.x / 100);
                const targetY = canvas.height * (step.y / 100);
                const startX = random(canvas.width * 0.4, canvas.width * 0.6);
                const startY = canvas.height;
                // Pass the whole step as 'options' to launchFirework -> Firework -> createParticles
                launchFirework(startX, startY, targetX, targetY, step.type, step.hue, step);
            }, step.time);
        } else {
            console.warn(`Step ${index} in sequence "${sequenceName}" has no type or call - skipping.`);
        }
    });
}


// --- DOM Ready Check ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}