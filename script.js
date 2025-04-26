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
const checkAllTypesButton = document.getElementById('checkAllTypesButton');
const uncheckAllTypesButton = document.getElementById('uncheckAllTypesButton');
const finaleButton = document.getElementById('finaleButton');

// --- Free Play Settings Elements ---
const controlsPanel = document.getElementById('controls'); // The actual controls div inside settingsContainer
const toggleSettingsButton = document.getElementById('toggleSettingsButton');
const toggleAdvancedButton = document.getElementById('toggleAdvancedButton');
const advancedControlsPanel = document.getElementById('advancedControls');
const presetBar = document.getElementById('presetBar');
const togglePresetBarButton = document.getElementById('togglePresetBar');
// --- Add near other Element References ---
const startSpeechButton = document.getElementById('startSpeechButton');
const speechStatusSpan = document.getElementById('speechStatus');
// --- End Add ---
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
//Cursor elements:
const cursorTrailInput = document.getElementById('cursorTrail');
const toggleCursorOptionsButton = document.getElementById('toggleCursorOptions');
const cursorOptionsDiv = document.getElementById('cursorOptions');
const cursorTrailDensityInput = document.getElementById('cursorTrailDensity');
const cursorTrailHueInput = document.getElementById('cursorTrailHue');
//Weather Elements
const enableRainCheckbox = document.getElementById('enableRain');
const rainDensityControl = document.getElementById('rainDensityControl'); // Container div
const rainDensityInput = document.getElementById('rainDensity');
const rainDensityValueSpan = document.getElementById('rainDensityValue');
const enableSnowCheckbox = document.getElementById('enableSnow');
const snowDensityControl = document.getElementById('snowDensityControl'); // Container div
const snowDensityInput = document.getElementById('snowDensity');
const snowDensityValueSpan = document.getElementById('snowDensityValue');
const windSpeedInput = document.getElementById('windSpeed');
const windSpeedValueSpan = document.getElementById('windSpeedValue');
let ripples = [];          // Array to store active ripple objects
let waterTime = 0;        // Timer for water surface animation
const waterSurface = [];  // Array to store calculated water surface Y-offsets
// Spans for value display
const cursorTrailDensityValueSpan = document.getElementById('cursorTrailDensityValue');
const cursorTrailHueValueSpan = document.getElementById('cursorTrailHueValue');

// Need reference to the clear button if it's used outside planner
const clearButton = document.getElementById('clearButton');
const showSilhouetteInput = document.getElementById('showSilhouette');
const showReflectionInput = document.getElementById('showReflection');

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
let mouse = { x: -1, y: -1, onCanvas: false };
let activeBlackHoles = [];
//Speech recognition
let recognition = null; // Holds the SpeechRecognition object
let isListening = false; // Tracks if recognition is active
let shouldBeListening = false; 
//Weather states
let raindrops = [];
let snowflakes = [];
const MAX_WEATHER_PARTICLES = 500; //Caps performance

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
         { call: 'launchTendrilWave', startTime: 100, duration: 500, density: 15, hueRange: [270, 285], satRange: [15, 30], briRange: [18, 28], xRange: [5, 50] }, // Purple Left Sweep
         { call: 'launchTendrilWave', startTime: 150, duration: 500, density: 15, hueRange: [350, 10], satRange: [25, 40], briRange: [15, 25], xRange: [50, 95] }, // Red Right Sweep
         { call: 'launchTendrilWave', startTime: 200, duration: 500, density: 10, hueRange: [100, 115], satRange: [10, 20], briRange: [20, 30], xRange: [30, 70] }, // Green Center Sweep
        // Low ominous effects build
        { time: 300, x: 50, y: 85, type: 'groundBloom', hue: 280, brightness: 15 },
        { time: 400, x: 50, y: 65, type: 'ring', hue: 0, brightness: 25, radius: 6},
        { time: 500, x: 40, y: 75, type: 'crackle', hue: 275, brightness: 30, decayMultiplier: 1.8 },
        { time: 500, x: 60, y: 75, type: 'crackle', hue: 275, brightness: 30, decayMultiplier: 1.8 },
        // Tendril Rain Wave 2 - Coming from Sides
        { call: 'launchTendrilWave', startTime: 550, duration: 500, density: 20, hueRange: [95, 110], satRange: [15, 25], briRange: [25, 30], xRange: [5, 15], yRange: [10, 50] }, // Green from Left Side
        { call: 'launchTendrilWave', startTime: 600, duration: 500, density: 20, hueRange: [280, 295], satRange: [18, 30], briRange: [15, 25], xRange: [85, 95], yRange: [10, 50] }, // Purple from Right Side
        { time: 800, x: 50, y: 55, type: 'voidCore', size: 'Medium' },
        { time: 1000, x: 50, y: 60, type: 'ring', hue: 280, brightness: 20, radius: 10},
        // Tendril Rain Wave 3 - Pulsing Top Center
        { call: 'launchTendrilWave', startTime: 1050, duration: 400, density: 40, hueRange: [350, 15], satRange: [30, 45], briRange: [18, 28], xRange: [40, 60] }, // Dense Red/Orange Top Center

        // Phase 2: First Sigil & Increasing Chaos (1500ms - 4000ms) -> Shortened duration slightly
         // Tendril Rain Wave 4 - FULL Top Edge Barrage
        { call: 'launchTendrilWave', startTime: 1500, duration: 950, density: 40, hueRange: [0, 15], satRange: [40, 55], briRange: [25, 35], xRange: [5, 95]},     // Intense Red/Orange Full Width
        { call: 'launchTendrilWave', startTime: 1550, duration: 950, density: 30, hueRange: [270, 290], satRange: [20, 35], briRange: [20, 30], xRange: [5, 95] },    // Overlapping Purple Full Width

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
        { call: 'launchTendrilWave', startTime: 2500, duration: 1450, density: 40, hueRange: [275, 295], satRange: [15, 30], briRange: [15, 28], xRange: [5, 35], yRange:[5, 15] }, // Purple top-left origin
       
        // --- Phase 3: CORRUPTION & SECOND SIGIL (4000ms - 7000ms) -> Compressed time
         // Tendril Rain Wave 7 - Dark and Full Width
        { call: 'launchTendrilWave', startTime: 4000, duration: 2950, density: 40, hueRange: [0, 10], satRange: [40, 60], briRange: [15, 25], xRange:[5, 95] },     // Intense Red/Dark Red
     
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
        { call: 'launchTendrilWave', startTime: 5500, duration: 2450, density: 20, hueRange: [270, 290], satRange: [5, 15], briRange: [10, 20] }, // MAX DARK PURPLE
        { call: 'launchTendrilWave', startTime: 5550, duration: 2400, density: 20, hueRange: [350, 10], satRange: [5, 20], briRange: [8, 18] }, // MAX DARK RED/BLACK
        { call: 'launchTendrilWave', startTime: 5600, duration: 2350, density: 20, hueRange: [90, 110], satRange: 0,  briRange: [8, 18],brightness: 15 }, // MAX DESATURATED GREEN/GREY

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
         { time: 7900, x: 50, y: 40, type: 'crackle', hue: 0, brightness: 5, decayMultiplier: 4}, // Faintest last crackle
         { time : 100,  x : 40,  y : 40,  type :  'blackHole' ,  size :  'Small',  strength : 1,  duration : 10000 },
       { time : 100,  x : 60,  y : 40,  type :  'blackHole' ,  size :  'Small' ,  strength : 1.8,  duration : 10000 },
       { time : 1000,  x : 40,  y : 40,  type :  'blackHole' ,  size :  'Large' ,  strength : 0.8,  duration : 10000 },
       { time : 1000,  x : 60,  y : 40,  type :  'blackHole' ,  size :  'Medium' ,  strength : 0.8,  duration : 10000 },
       { time : 2800,  x : 40,  y : 40,  type :  'blackHole' ,  size :  'Small' ,  strength : 0.8,  duration : 10000 },
           {  time : 2800,  x : 60,  y : 40,  type :  'blackHole' ,  size :  'Small' ,  strength : 1.8,  duration : 10000 },
           {  time : 4400,  x : 50,  y : 40,  type :  'blackHole' ,  size : 'Large' ,  strength : 1.8,  duration : 10000 },
           {  time : 4500,  x : 50,  y : 50,  type :  'blackHole' ,  size :  'Very Large' ,  strength : 5.8,  duration : 10000 }


        
        ]
    ,
        // ANTIMATTER COLLAPSE
        // Find this key in presetSequences:
        // Find this key in presetSequences:
        antiMatterCollapse: [
            // Phase 1: Formation of the Disk & Initial Infall (0 - 2500ms)
            { time: 100, x: 50, y: 45, type: 'ring', hue: 280, radius: 3, brightness: 15, decayMultiplier: 2.0 }, // Dim Purple marker for center

            // Wave 1: Slow, Wide Outer Spiral (Dark Red/Purple Tendrils)
            { call: 'launchInwardWave', startTime: 200, duration: 2000, density: 300,
              centerX: 50, centerY: 45, hueRange: [280, 10], // Purple to Red
              effectType: 'whisperingTendrils',
              minRadiusPercent: 80, maxRadiusPercent: 110, // Far out
              speedRange: [2, 4], // Slow initial speed
              spiralFactor: 0.9, // Strong initial spiral
              particleOptions: { decayMultiplier: 0.3, saturation: 30, brightness: 25 } // Long life, dim
            },
            // First Line Wave Sweep (Tangential Gold)
            { call: 'launchLineEffect', startTime: 500, duration: 800, density: 80,
              startX: 5, startY: 20, endX: 95, endY: 30, // Sweeps across top-ish
              effectType: 'glitter', hue: 45, // Gold Glitter Line
              particleOptions: { decayMultiplier: 1.5, speed: 15} // Faster line
            },
            // Wave 2: Faster, Closer Spiral (Orange/Yellow Glitter)
            { call: 'launchInwardWave', startTime: 1000, duration: 1500, density: 400,
              centerX: 50, centerY: 45, hueRange: [20, 55], // Orange to Yellow
              effectType: 'glitter',
              minRadiusPercent: 60, maxRadiusPercent: 90, // Closer in
              speedRange: [5, 9], // Faster speed
              spiralFactor: 0.7, // Less spiral, more inward
              particleOptions: { decayMultiplier: 0.8, brightness: random(70, 90) } // Brighter, shorter life
            },
            // Second Line Wave Sweep (Opposite Tangential)
            { call: 'launchLineEffect', startTime: 1300, duration: 800, density: 80,
              startX: 95, startY: 70, endX: 5, endY: 60, // Sweeps across bottom-ish
              effectType: 'glitter', hue: 50, // Yellow Glitter Line
              particleOptions: { decayMultiplier: 1.5, speed: 15}
            },

            // --- Phase 2: Accretion Disk Heating Up - Red Zone (2500ms - 5000ms) ---
            // Wave 3: Dense Red/Orange Leaves Spiraling Tighter
            { call: 'launchInwardWave', startTime: 2500, duration: 2000, density: 600, // High Density
              centerX: 50, centerY: 45, hueRange: [0, 30], // Red to Orange
              effectType: 'leaves',
              minRadiusPercent: 40, maxRadiusPercent: 70, // Even closer
              speedRange: [7, 12], // Faster still
              spiralFactor: 0.5, // More direct infall
              particleOptions: { decayMultiplier: 0.6, brightness: random(55, 75)} // Good visibility leaves
            },
            // Line Waves Arc INWARDS towards center (Red/White Crackle)
            { call: 'launchLineEffect', startTime: 2800, duration: 500, density: 100,
              startX: 10, startY: 10, endX: 60, endY: 60, // Arc In Top Left
              effectType: 'crackle', hue: 0, // Red Crackle
              particleOptions: { decayMultiplier: 2.0 }
            },
            { call: 'launchLineEffect', startTime: 2900, duration: 500, density: 100,
              startX: 90, startY: 10, endX: 40, endY: 60, // Arc In Top Right
              effectType: 'strobeGlitter', hue: 60, // White Strobe
              particleOptions: { decayMultiplier: 2.0, brightness: 100 }
            },
            { call: 'launchLineEffect', startTime: 3000, duration: 500, density: 100,
              startX: 10, startY: 80, endX: 60, endY: 30, // Arc In Bottom Left
              effectType: 'crackle', hue: 30, // Orange Crackle
              particleOptions: { decayMultiplier: 2.0 }
            },
            { call: 'launchLineEffect', startTime: 3100, duration: 500, density: 100,
              startX: 90, startY: 80, endX: 40, endY: 30, // Arc In Bottom Right
              effectType: 'strobeGlitter', hue: 45, // Gold Strobe
              particleOptions: { decayMultiplier: 2.0, brightness: 100 }
            },
            // Intense Central Crackle builds
            { time: 3500, x: 50, y: 45, type: 'crackle', hue: 15 }, { time: 3600, x: 47, y: 43, type: 'crackle', hue: 25 }, { time: 3700, x: 53, y: 47, type: 'crackle', hue: 35 }, { time: 3800, x: 50, y: 45, type: 'crackle', hue: 45 },

            // --- Phase 3: Event Horizon Simulation & Collapse (5000ms - 7500ms) ---
            // Wave 4: FINAL, FASTEST Inward Rush - Concentrated Red/Orange/Yellow Glitter/Crackle
            { call: 'launchInwardWave', startTime: 4970, duration: 1500, density: 800, // MAX DENSITY
              centerX: 50, centerY: 45, hueRange: [0, 0], 
              effectType: 'glitter', // Primarily Glitter
              minRadiusPercent: 20, maxRadiusPercent: 50, // VERY CLOSE start radius
              speedRange: [15, 30], // VERY FAST speed
              spiralFactor: 0.3, // Almost straight in
              particleOptions: { decayMultiplier: 1.5, brightness: random(50, 70)} // Bright & shorter life
            },
            // Add Crackle Wave overlapping the glitter
            { call: 'launchInwardWave', startTime: 4970, duration: 1400, density: 2000,
              centerX: 50, centerY: 45, hueRange: [0, 5], effectType: 'crackle',
              minRadiusPercent: 25, maxRadiusPercent: 55,
              speedRange: [12, 25], spiralFactor: 0.4,
              particleOptions: { decayMultiplier: 1.8, brightness: random(70, 80)}
            },
            // Final Line Waves form an 'X' through the center - White/Cyan Strobes
            { call: 'launchLineEffect', startTime: 5500, duration: 400, density: 80,
              startX: 10, startY: 10, endX: 90, endY: 80, // Diagonal TL to BR
              effectType: 'strobeGlitter', hue: 60, particleOptions: {brightness: 100, decayMultiplier: 2}
            },
            { call: 'launchLineEffect', startTime: 5600, duration: 400, density: 80,
              startX: 90, startY: 10, endX: 10, endY: 80, // Diagonal TR to BL
              effectType: 'strobeGlitter', hue: 240, particleOptions: {brightness: 100, decayMultiplier: 2}
            },
             // Climax burst / fade
             { call: 'launchInwardWave', startTime: 6500, duration: 700, density: 700, // HIGH DENSITY
                centerX: 50, centerY: 45, hueRange: [0, 50], // Red-Orange-Gold
                effectType: 'glitter', // Use bright glitter for the main disk
                minRadiusPercent: 20, maxRadiusPercent: 55, // Concentrated closer now
                speedRange: [8, 18], // Faster infall speed
                spiralFactor: 0.6, // Moderate spiral
                particleOptions: { decayMultiplier: 1.0, brightness: random(75, 95) } // Bright, medium life
              },
              // Add some Leaf texture to the disk
               { call: 'launchInwardWave', startTime: 6600, duration: 700, density: 300,
                centerX: 50, centerY: 45, hueRange: [10, 40], // Orange/Yellow focused
                effectType: 'leaves',
                minRadiusPercent: 25, maxRadiusPercent: 50,
                speedRange: [6, 14], spiralFactor: 0.5,
                particleOptions: { decayMultiplier: 0.8, brightness: random(60, 80)}
              },
  
              // Layer 2: The Crossing Jets (Blue/White Contrasting Colors) - Use Lines
              { call: 'launchLineEffect', startTime: 6700, duration: 600, density: 120,
                startX: 10, startY: 10, endX: 90, endY: 80, // Diagonal TL to BR
                effectType: 'burst', // Use bright burst for jet
                hue: 10, // Red Color
                particleOptions: { decayMultiplier: 1.2, brightness: 100, lineWidth: 2.5 } // Thick, bright jet
              },
              { call: 'launchLineEffect', startTime: 6750, duration: 600, density: 120,
                startX: 90, startY: 10, endX: 10, endY: 80, // Diagonal TR to BL
                effectType: 'burst', // Use strobe for other jet texture
                hue: 280, // White/Yellow Color
                particleOptions: { decayMultiplier: 1.2, brightness: 100, lineWidth: 2.5 } // Thick, bright jet
              },
  
              // Layer 3: Outer Defining Ring (Shockwave / Edge of Influence)
              // Layer 3: Outer Defining Ring (Shockwave / Edge of Influence)
            { time: 7000, x: 50, y: 45, type: 'ring', hue: 0, radius: 25, thickness: 5.0, brightness: 100, decayMultiplier: 1.0, particleCount: 1000 }, // << ADD particleCount
            { time: 7000, x: 50, y: 45, type: 'ring', hue: 0, radius: 30, thickness: 5, brightness: 100, decayMultiplier: 1.2, particleCount: 2000 }, // << ADD particleCount (even more for outer?)

               // Layer 4: Intense Core Pulse Continues
               { time: 7000, x: 50, y: 45, type: 'crackle', hue: 45 }, // Gold Crackle
               { time: 7200, x: 50, y: 45, type: 'strobeGlitter', hue: 55 }, // Yellow Strobe
               { time: 7400, x: 50, y: 45, type: 'burst', hue: 60, brightness: 100 }, // Final White Flash
             // End ~7.5 seconds
        ], // <-- Check comma
                // Add this key inside presetSequences = { ... };
         // Find or add this key in presetSequences:
            // Find or add this key in presetSequences:
        // Find this key in presetSequences:
        fireDragon: [
            // Phase 1: Serpent Emerges & Coils (0 - 7500ms)
            { call: 'drawDragonPath', // This call handles the body segments up to time: 7500
              waypoints: [
                [100,  15, 70], [700,  45, 40], [1300, 75, 30], [1900, 85, 55],
                [2500, 60, 65], [3100, 35, 55], [3700, 20, 40], [4300, 40, 25],
                [4900, 70, 28], [5500, 75, 45], [6100, 60, 55], [6700, 40, 50],
                [7500, 30, 30] // End near (30, 30)
              ],
              segmentDuration: 150, // Slightly faster segments?
              pointsPerSegment: 20, // Denser body
              effectType: 'crackle', hue: 30,
              auraEffectType: 'glitter', auraHue: random(40,60), auraDensityFactor: 0.3,
              headEffectType: 'strobeGlitter', headHue: 55
            },
             // Add Head Flare right as path ends
             { time: 7400, x: 30, y: 30, type: 'strobeGlitter', hue: 55, brightness: 100},
             { time: 7550, x: 30, y: 30, type: 'crackle', hue: 45, brightness: 90},

            // --- Phase 2: FIRE BREATHING ONSLAUGHT (Starts DURING end of path ~7400ms - 10000ms) ---
            // Head is near (30, 30), let's aim breath forward/right (angle ~ 0 to PI/6)
            { time: 7400, x: 32, y: 31, type: 'fireBreath', hue: 0, // Start slightly before path ends
              angle: 0.1, spread: Math.PI/2, speed: 20, effectMix: 'leaves', // Red/Orange Leaves - Narrow cone RIGHT
              particleOptions: { gravityMultiplier: 0.5, decayMultiplier: 1.5 } // Adjust physics
            },
            { time: 7400, x: 33, y: 32, type: 'crackle', hue: 30}, // Crackle near mouth
            { time: 7550, x: 28, y: 28, type: 'crackle', hue: 40},

            { time: 7400, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
              angle: 0.0, spread: Math.PI/2, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
              particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
            },
            { time: 7500, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                angle: 0.0, spread: Math.PI/4, speed: 22, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
              },
              { time: 7550, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                angle: 0.0, spread: Math.PI/3, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
              },
              { time: 7650, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                angle: 0.0, spread: Math.PI/2, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
              },
              { time: 7450, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                angle: 0.0, spread: Math.PI/2, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
              },
              { time: 7350, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                  angle: 0.0, spread: Math.PI/5, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                  particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
                },
                { time: 7450, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                  angle: 0.0, spread: Math.PI/4, speed: 12, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                  particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
                },
                { time: 7700, x: 31, y: 30, type: 'fireBreath', hue: 0, // Yellow/Orange breath
                  angle: 0.0, spread: Math.PI/3, speed: 22, effectMix: 'glitter', // GOLD Glitter - Very narrow cone RIGHT
                  particleOptions: { gravityMultiplier: 0.4, decayMultiplier: 1.8, brightness: 85 }
                },
            { time: 7500, x: 30, y: 30, type: 'burst', hue: 45, brightness: 90, decayMultiplier: 2.0}, // Small Gold burst accent

            { time: 7300, x: 32, y: 31, type: 'fireBreath', hue: 5, // Deep Red Leaves again
              angle: 0.2, spread: Math.PI/5, speed: 19, effectMix: 'leaves',
              particleOptions: { gravityMultiplier: 0.6, decayMultiplier: 1.4 }
            },
            { time: 8200, x: 34, y: 33, type: 'crackle', hue: 15}, { time: 8200, x: 28, y: 27, type: 'crackle', hue: 15}, // Wider crackle

            { time: 7500, x: 31, y: 30, type: 'fireBreath', hue: 0, // Final Gold/Yellow Breath
              angle: 0.1, spread: Math.PI/6, speed: 25, effectMix: 'mixed', // Fastest, mixed leaves/glitter
              particleOptions: { gravityMultiplier: 0.5, decayMultiplier: 1.6 }
            },
             { time: 8600, x: 30, y: 30, type: 'crackle', hue: 50}, { time: 8650, x: 30, y: 30, type: 'crackle', hue: 55}, // Final breath crackle


            // --- Phase 3: Dragon Self-Immolation Finale (Starts EARLIER ~9000ms - 11500ms) ---
            // Launch bursts along the path waypoints
            { time: 9000, x: 15, y: 70, type: 'burst', hue: 0}, { time: 9050, x: 45, y: 40, type: 'burst', hue: 15}, { time: 9100, x: 75, y: 30, type: 'burst', hue: 30}, { time: 9150, x: 85, y: 55, type: 'burst', hue: 45}, { time: 9200, x: 60, y: 65, type: 'burst', hue: 30}, { time: 9250, x: 35, y: 55, type: 'burst', hue: 10}, { time: 9300, x: 20, y: 40, type: 'burst', hue: 355}, { time: 9350, x: 40, y: 25, type: 'burst', hue: 350}, { time: 9400, x: 70, y: 28, type: 'burst', hue: 340}, { time: 9450, x: 75, y: 45, type: 'burst', hue: 330}, { time: 9500, x: 60, y: 55, type: 'burst', hue: 320}, { time: 9550, x: 40, y: 50, type: 'burst', hue: 310}, { time: 9600, x: 30, y: 30, type: 'burst', hue: 300}, // Head location burst

            // Massive Glitter/Crackle overlay - Use launchInwardWave for dense fill
            { call: 'launchInwardWave', startTime: 9700, duration: 1500, density: 700, centerX: 50, centerY: 45, hueRange: [0, 60], effectType: 'glitter', minRadiusPercent: 10, maxRadiusPercent: 90, speedRange: [2, 8], spiralFactor: 0.1},
            { call: 'launchInwardWave', startTime: 9800, duration: 1300, density: 500, centerX: 50, centerY: 45, hueRange: [10, 50], effectType: 'crackle', minRadiusPercent: 15, maxRadiusPercent: 80, speedRange: [3, 9], spiralFactor: 0.1},
            // Final Central flash
            { time: 11000, x: 50, y: 45, type: 'strobeGlitter', hue: 55, brightness: 100 },
            { time: 11500, x: 50, y: 45, type: 'burst', hue: 60, brightness: 100 } ,// Final White burst
            { call: 'launchLineEffect',
                startTime: 12000, // Start time for the pillar
                duration: 800,    // How long the pillar effect lasts (spawning particles)
                density: 150,     // How many firework effects total make up the line (HIGH DENSITY)
                startX: 50, startY: 95, // Start VERY LOW, Center X
                endX: 50, endY: 0,   // End VERY HIGH, Center X (Straight Up)
                effectType: 'crackle', // Use Crackle for a fiery, intense look
                hue: 30,             // Orange/Yellow base hue
                particleOptions: {   // Options FOR the crackle particles themselves
                    brightness: random(75, 95), // Bright crackle
                    speed: random(4, 8),      // Give particles some outward speed from the line
                    gravityMultiplier: 0.3,   // Slight downward drift after burst
                    decayMultiplier: 1.5      // Fade reasonably fast
                }
              },
              // Optional: Add a secondary layer with Glitter for sparks
              { call: 'launchLineEffect',
                startTime: 12000, // Start slightly after crackle starts
                duration: 700,
                density: 100,
                startX: 50, startY: 93, // Start slightly higher than crackle maybe
                endX: 50, endY: 0,
                effectType: 'glitter',
                hue: 45, // Gold glitter sparks
                particleOptions: {
                    brightness: random(70, 85),
                    speed: random(3, 7),
                    gravityMultiplier: 0.4,
                    decayMultiplier: 1.8
                }
              }
             // Total duration ~12 seconds
        ], // <-- Check comma
};


// --- Settings Object ---

const settings = {
    // Basic
    particleCount: 10, // Default from HTML input value
    gravity: 0.5,      // Default from HTML input value
    particleFriction: 0.96, // Default from HTML input value
    trailFade: 0.15,   // Default from HTML input value
    hueCycling: true,  // Default from HTML input checked state
    // Advanced
    launchFrequency: 5, // Default from HTML input value
    autoLaunch: true,   // Default from HTML input checked state
    rocketAcceleration: 1.03, // Default from HTML input value
    rocketTrailLength: 3,    // Default from HTML input value
    particleTrailLength: 5,   // Default from HTML input value
    particleDecay: 0.012,  // Default from HTML input value
    // Initialize allowed types based on default HTML checked states later in init()
    allowedFireworkTypes: [],
    // --- NEW Settings FOR SILHOUTTE AND RELFECTION (Defaults) ---
    showSilhouette: false, // Default value (will be updated from input in init)
    showReflection: false, // Default value (will be updated from input in init)
    //CURSOR TRAIL
    cursorTrailEnabled: cursorTrailInput ? cursorTrailInput.checked : false, // Add cursor trail setting
    cursorTrailHue: 200, // Example: Bluish/Silver color for trail
    cursorTrailDensity: 3, // Higher = more particles per movement

    // Define sky colors
    skyColorTop: '#000015',
    skyColorBottom: '#000015',
    silhouetteColor: '#000015',
    waterlineYPercent: 80,

    reflectionAlpha: 0.05,

    //Default WETHAER
    rainEnabled: false, // Default off
    rainDensity: 3,     // Default density
    snowEnabled: false, // Default off
    snowDensity: 3,     // Default density
    rainEnabled: false, rainDensity: 3, snowEnabled: false, snowDensity: 3,
    windSpeedX: 1.0, // Default slight wind to the right
    
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
        // Update trail coordinates
        this.coordinateCount = settings.rocketTrailLength; // Get current setting
        this.acceleration = settings.rocketAcceleration; // Get current setting
        if(this.coordinates.length > 0) this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        while (this.coordinates.length > this.coordinateCount) this.coordinates.pop();

        // Apply acceleration and move
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        const prevX = this.x;
        const prevY = this.y;
        this.x += vx;
        this.y += vy;

        // Update distance travelled this frame
        const distThisFrame = calculateDistance(prevX, prevY, this.x, this.y);
        this.cumulativeDistanceTraveled += distThisFrame;

        // Check explosion conditions
        const reachedTarget = this.cumulativeDistanceTraveled >= this.distanceToTarget;
        // Slightly more robust out-of-bounds check
        const outOfBounds = this.y < -10 || this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50;

        if (reachedTarget || outOfBounds) {
            // console.log(`--- Firework ${index} Exploding! Reason: ${reachedTarget ? 'Target Reached' : 'Out Of Bounds'} ---`); // Debug log

            try {
                // --- *** CORRECTION IS HERE *** ---
                // Explode at the CURRENT position when condition is met,
                // UNLESS it specifically reached the target, then use endX/endY for precision.
                const explosionX = reachedTarget ? this.endX : this.x;
                const explosionY = reachedTarget ? this.endY : this.y;
                // --- *** END CORRECTION *** ---

                const options = this.options || {}; // Get sequence options if any
                createParticles(explosionX, explosionY, this.hue, this.type, options); // EXPLODE!

                // Remove the firework AFTER creating particles
                if (fireworks[index] === this) { // Double-check we are removing the right one
                    fireworks.splice(index, 1);
                } else {
                    console.warn("Attempted to remove firework at index", index, "but it wasn't the expected object. Searching...");
                    // Find and remove manually if mismatch detected (safety net)
                    const actualIndex = fireworks.indexOf(this);
                    if (actualIndex > -1) {
                        fireworks.splice(actualIndex, 1);
                        console.log("   Removed firework via manual search at index", actualIndex);
                    } else {
                        console.error("   Could not find the firework object to remove it!");
                    }
                }

            } catch (e) {
                console.error("Error during explosion:", e, " Firework Data:", this);
                // Attempt removal even on error
                if (fireworks[index] === this) {
                    fireworks.splice(index, 1);
                } else {
                    const actualIndex = fireworks.indexOf(this);
                    if (actualIndex > -1) fireworks.splice(actualIndex, 1);
                }
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

        // --- Find the Particle.update method ---
        update(index) {
            // --- 1. Trail Coordinate Management (Keep Existing) ---
            this.coordinateCount = this.options?.coordinateCount ?? settings.particleTrailLength;
            if (this.coordinates.length > 0) this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            while (this.coordinates.length > this.coordinateCount) this.coordinates.pop();
    
            // --- 2. Update Physics Properties (Keep Existing) ---
            this.friction = this.options?.friction ?? settings.particleFriction;
            this.gravity = settings.gravity * this.gravityMultiplier;
            this.decay = (settings.particleDecay * this.decayMultiplier * random(0.8, 1.2));
    
            // --- 3. Apply Friction (Keep Existing) ---
            this.speed *= this.friction;
   
            // --- 4. Calculate Base Velocity (Keep Existing) ---
            let vx = Math.cos(this.angle) * this.speed;
            let vy = Math.sin(this.angle) * this.speed;
    
            // --- 5. Black Hole Interaction Logic ---
            const currentTime = performance.now();
            let isBeingPulled = false; // Flag if affected THIS FRAME

             // Check against ALL active black holes
             if(activeBlackHoles.length >0){}
             activeBlackHoles.forEach(bh => {
                 // Check if the BH is still active (using the startTime and duration)
                 if (currentTime < bh.startTime + bh.duration) {
                     const dx = bh.x - this.x;
                     const dy = bh.y - this.y;
                     const distSq = dx * dx + dy * dy;

                     // Define the radius within which the pull happens
                     const pullRadiusSq = bh.radius * bh.radius;
                      // Define an "event horizon" radius - particles inside get consumed quickly
                      const eventHorizonRadius = Math.max(5, bh.strength * 2); // Small radius, scales slightly with strength
                      const eventHorizonSq = eventHorizonRadius * eventHorizonRadius;

                      if (distSq < pullRadiusSq && distSq > eventHorizonSq) { // If within pull radius BUT outside event horizon
                         isBeingPulled = true;
                         const distance = Math.sqrt(distSq);
                         if (distance === 0) return; // Avoid NaN

                         // Calculate pull strength based on distance (stronger closer) and BH strength
                         // Inverse square relationship (like gravity) might be too strong, let's use linear falloff for now
                         const pullForce = (1 - (distance / bh.radius)) * bh.strength * 0.5; // Adjust multiplier (0.5) as needed

                         const angleToCenter = Math.atan2(dy, dx);
                         const tangentialAngle = angleToCenter + (Math.PI / 2);
                         const spiralFactor = 0.6; // 0 = straight pull, 1 = pure orbit (adjust 0.4-0.8)
                         // Add pull velocity component
                         vx += Math.cos(angleToCenter) * pullForce*(1-spiralFactor);
                         vy += Math.sin(angleToCenter) * pullForce*(1-spiralFactor);
                        vx += Math.cos(tangentialAngle) * pullForce * spiralFactor;
                        vy += Math.sin(tangentialAngle) * pullForce * spiralFactor;
                         // --- Optional Visual Distortion for Pulled Particles ---
                         // (Keep this subtle or remove if too visually noisy)
                          this.hue = (this.hue + 0.5) % 360; // Slight hue shift
                          this.brightness = Math.max(40, this.brightness - 0.5); // Slightly dim
                          // this.lineWidth = Math.min(3, this.lineWidth + 0.02); // Slight thickening
                          // this.alpha *= 0.99; // Slightly faster fade?

                     } else if (distSq <= eventHorizonSq) {
                         // Particle is inside the event horizon - mark for quick removal
                         isBeingPulled = true;
                         this.alpha = Math.min(this.alpha, 0.1); // Set alpha very low
                         this.decay = Math.max(this.decay, 0.2);   // Set decay very high
                     }
                 }
             });
    
    
            // --- 6. Apply Writhing (If Tendril) (Keep Existing if you have it) ---
             if (this.particleType === 'tendril') {
                 this.angle += random(-0.03, 0.03);
             }
    
            // --- 7. Update Position (Uses potentially modified vx, vy) ---
            this.x += vx;
            this.y += vy + this.gravity; // Apply base gravity AFTER velocity changes
    
            // --- 8. Apply Alpha Decay (Keep Existing logic, maybe adjust?) ---
            // Only apply normal decay if not already rapidly fading from BH pull
            if (!isBeingPulled || this.alpha > 0.1) {
               this.alpha -= this.decay;
            } else if (this.alpha > 0) { // Ensure alpha doesn't go negative if already low
                this.alpha -= Math.min(this.alpha, this.decay); // Apply normal decay capped by current alpha
            }
    
    
            // --- 9. Removal Logic (Keep Existing) ---
            // Remove if faded, or way off-screen
            if (this.alpha <= 0 || this.y > canvas.height + 50 || this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
                 const currentIndex = particles.indexOf(this);
                 if (currentIndex === index) {
                     particles.splice(index, 1);
                 } else if (currentIndex > -1) {
                     particles.splice(currentIndex, 1);
                     console.warn("Particle removed from unexpected index during update check.");
                 }
            }
        } // --- END Particle Update Method ---

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
// --- Create Particles (Includes ALL types and options parameter, with LOWERED BRIGHTNESS) ---
function createParticles(x, y, baseHue, type, options = {}) { // Added options parameter
    const count = settings.particleCount;
    let maxCount = -1;
    switch (type) {
        // --- Existing kept types ---
        case 'glitter':
             // Lowered brightness for both glitter parts
             for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(1, 6), gravityMultiplier: 1.3, decayMultiplier: 1.5, brightness: random(55, 75) })); } // Max 75 now
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, baseHue + random(-10, 10), { speed: random(0.5, 2), gravityMultiplier: 0.8, decayMultiplier: 2.5, brightness: random(60, 80), lineWidth: 0.5, coordinateCount: 2 })); } // Max 80 for accents
            break;
        case 'ring': {
            const ringRadius = options.radius ?? random(1.5, 3); const thickness = options.thickness ?? 0.8;
            const angleIncrement = (Math.PI * 2) / count;
            // Removed debug log console.log(`Creating Ring: radius=${ringRadius}, thickness=${thickness}`);
            // Using standard brightness for rings
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { angle: angleIncrement * i, speed: ringRadius + random(-thickness / 2, thickness / 2), gravityMultiplier: options.gravityMultiplier ?? 0.7, decayMultiplier: options.decayMultiplier ?? 0.9, brightness: random(55, 75) })); } // Max 75 default
            break;
        }
        case 'burst':
             // Lowered brightness
             for (let i = 0; i < count * 1.2; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(8, 18), gravityMultiplier: 0.9, decayMultiplier: 1.1, brightness: random(60, 80), lineWidth: random(1.5, 2.5) })); } // Max 80 now
            break;
        case 'leaves':
             // Kept original lower brightness
            for (let i = 0; i < (Math.min(count,200)) * 0.8; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(0.5, 2.5), gravityMultiplier: 0.3, decayMultiplier: 0.6, angle: random(Math.PI * 0.4, Math.PI * 0.6), brightness: random(30, 40), lineWidth: random(1.5, 3) })); }
            break;
        case 'fish':
             // Lowered brightness slightly
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(5, 15), gravityMultiplier: 0.3, decayMultiplier: 0.9, brightness: random(50, 70), lineWidth: random(1, 2.5) })); } // Max 70 now
            break;
        case 'doubleRing': {
            const ringRadius1 = options.radius1 ?? random(1.5, 3); const ringRadius2 = options.radius2 ?? random(4, 6); const thickness1 = options.thickness1 ?? 0.8; const thickness2 = options.thickness2 ?? 1.0;
            const innerParticleCount = Math.floor(count * (options.density1 ?? 0.6)); const outerParticleCount = Math.floor(count * (options.density2 ?? 0.6));
            const angleIncrementInner = (Math.PI * 2) / innerParticleCount; const angleIncrementOuter = (Math.PI * 2) / outerParticleCount; // Removed log
            const innerHue = options.hue1 ?? baseHue + random(-10, 10);
             // Lowered brightness for inner ring
            for (let i = 0; i < innerParticleCount; i++) { particles.push(new Particle(x, y, innerHue, { angle: angleIncrementInner * i, speed: ringRadius1 + random(-thickness1 / 2, thickness1 / 2), gravityMultiplier: 0.7, decayMultiplier: 0.9, brightness: random(55, 75) })); } // Max 75
            const outerHue = options.hue2 ?? (baseHue + 90 + random(-20, 20)) % 360;
             // Lowered brightness for outer ring
            for (let i = 0; i < outerParticleCount; i++) { particles.push(new Particle(x, y, outerHue, { angle: angleIncrementOuter * i + random(-0.05, 0.05), speed: ringRadius2 + random(-thickness2 / 2, thickness2 / 2), gravityMultiplier: 0.8, decayMultiplier: 1.0, brightness: random(45, 65) })); } // Max 65
            break;
        }
        case 'palmTree': {
             // Lowered trunk brightness
             const trunkHue = random(50, 70); for (let i = 0; i < count * 0.1; i++) { particles.push(new Particle(x, y, trunkHue, { angle: random(-Math.PI * 0.55, -Math.PI * 0.45), speed: random(8, 15), gravityMultiplier: 0.5, decayMultiplier: 2.0, brightness: random(65, 85), coordinateCount: 4 })); } // Max 85
             // Kept original lower frond brightness
             const frondHue = random(45, 55); for (let i = 0; i < count * 0.9; i++) { particles.push(new Particle(x, y, frondHue, { angle: random(Math.PI * 0.1, Math.PI * 0.9), speed: random(2, 6), gravityMultiplier: 1.6, decayMultiplier: 0.6, brightness: random(50, 70), lineWidth: random(1, 2.5) })); }
            break;
        }
        case 'chrysanthemumPistil': {
             // Lowered pistil brightness significantly
            const pistilHue = random(0, 360); for (let i = 0; i < count * 0.3; i++) { particles.push(new Particle(x, y, pistilHue, { speed: random(1, 4), gravityMultiplier: 0.8, decayMultiplier: 2.0, brightness: random(75, 90), coordinateCount: 3 })); } // Max 90 (still bright center)
             // Lowered petal brightness
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(4, 10), gravityMultiplier: 1.0, decayMultiplier: 1.0, brightness: random(50, 70) })); } // Max 70 now
            break;
        }
        case 'biColorSplit': {
            const hue1 = baseHue; const hue2 = (baseHue + 180 + random(-20, 20)) % 360; const splitAngle = random(0, Math.PI * 2);
             // Lowered brightness
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, hue1, { angle: splitAngle + random(0, Math.PI), speed: random(5, 11), brightness: random(55, 75) })); }
             for (let i = 0; i < count * 0.5; i++) { particles.push(new Particle(x, y, hue2, { angle: splitAngle + Math.PI + random(0, Math.PI), speed: random(5, 11), brightness: random(55, 75) })); }
            break;
        }
         case 'starPattern': {
            const starAngles = [0, 0.4 * Math.PI, 0.8 * Math.PI, 1.2 * Math.PI, 1.6 * Math.PI]; const particlesPerPoint = Math.floor(count * 0.2);
             // Lowered brightness
            for (let i = 0; i < 5; i++) { const targetAngle = starAngles[i]; for (let j = 0; j < particlesPerPoint; j++) { particles.push(new Particle(x, y, baseHue, { angle: targetAngle + random(-0.08, 0.08), speed: random(8, 15), gravityMultiplier: 0.7, decayMultiplier: 1.1, brightness: random(60, 80) })); } } // Max 80
             // Kept low brightness filler
             for (let i = 0; i < (Math.min(count,250)) * 0.1; i++) { particles.push(new Particle(x, y, baseHue + random(-20, 20), { speed: random(1, 4), decayMultiplier: 1.5, brightness: random(50,70) })); }
            break;
        }
        case 'groundBloom': {
            // Lowered brightness
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { angle: random(-Math.PI, 0), speed: random(4, 9), gravityMultiplier: 0.9, decayMultiplier: 1.0, brightness: random(50, 70) })); } // Max 70 now
            break;
        }
         case 'crackle':
             // Lowered brightness
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(3, 8), gravityMultiplier: 1.0, decayMultiplier: 1.0, brightness: random(55, 75), isCrackleSource: true, crackleChance: 0.1 })); } // Max 75 now
            break;
        case 'fractalBurst': {
            const generations = 3; const particlesPerGen = Math.max(5, Math.floor((Math.min(count,70)) / (generations * 3))); let currentParticles = [new Particle(x, y, baseHue, { speed: random(1, 3), alpha: 0 })];
            for (let gen = 0; gen < generations; gen++) { let nextGenParticles = []; currentParticles.forEach(parent => { const spawnX = (gen === 0) ? x : parent.x; const spawnY = (gen === 0) ? y : parent.y; const parentAngle = (gen === 0) ? random(0, Math.PI * 2) : parent.angle; for (let i = 0; i < particlesPerGen; i++) {
                // Lowered brightness progression
                const brightness = random(55 + gen * 5, 75 + gen * 5); // Starts 55-75, ends 65-85 approx
                const newOptions = { angle: parentAngle + random(-Math.PI / 4 / (gen + 1), Math.PI / 4 / (gen + 1)), speed: random(4 - gen, 8 - gen * 1.5), hue: (baseHue + gen * 45 + random(-15, 15)) % 360, brightness: brightness, decayMultiplier: 1.0 + gen * 0.2, gravityMultiplier: 0.8 + gen * 0.1, lineWidth: Math.max(0.5, 2 - gen * 0.5) }; const newP = new Particle(spawnX, spawnY, newOptions.hue , newOptions); particles.push(newP); nextGenParticles.push(newP); } }); if (particles.length > 2000) { console.warn("Fractal particle limit reached"); break; } currentParticles = nextGenParticles; }
            break;
        }
        case 'chronoStutter': {
            const freezeColor = 200; const burstColor = baseHue; const freezeDuration = 0.5;
             // Keep frozen bright, lower burst brightness
            for (let i = 0; i < count * 0.6; i++) { particles.push(new Particle(x, y, freezeColor, { speed: random(0.1, 0.8), gravityMultiplier: 0.1, decayMultiplier: 5 / freezeDuration, brightness: random(95, 100), lineWidth: random(1, 2.5), coordinateCount: 2 })); }
            setTimeout(() => { for (let i = 0; i < count * 0.8; i++) { particles.push(new Particle(x, y, burstColor, { speed: random(5, 15), brightness: random(60, 75) })); } }, freezeDuration * 500 ); // Max 75 burst
            break;
        }
        case 'pixelSpray': {
             const size = Math.max(3, Math.floor(random(4, 10))); const colors = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
              // Lowered brightness
             for (let i = 0; i < count * 0.7; i++) { particles.push(new Particle(x, y, colors[i % colors.length], { particleType: 'pixel', pixelSize: size, speed: random(1, 8), gravityMultiplier: 0.6, decayMultiplier: 1.5, brightness: random(60, 80) })); } // Max 80 now
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
             const sweepAngle = options.angle ?? random(0, Math.PI * 2); const spread = options.spread ?? Math.PI / 3;
             const particleEffect = options.particleEffect ?? 'standard';
             for (let i = 0; i < (Math.min(count,250)); i++) {
                // Base options with lowered brightness
                let particleOptions = { angle: sweepAngle + random(-spread / 2, spread / 2), speed: random(6, 16), gravityMultiplier: 0.4, decayMultiplier: 1.2, brightness: random(55, 75), // Max 75
                     ...(particleEffect === 'whisperingTendrils' && { /* Use tendril specific physics, brightness likely overridden */ particleType: 'tendril', speed: random(1, 3.5), gravityMultiplier: random(0.1, 0.3), decayMultiplier: random(0.2, 0.4), saturation: options.saturation ?? random(20, 40), brightness: options.brightness ?? random(30, 50), lineWidth: options.lineWidth ?? random(0.3, 1.0), coordinateCount: options.coordinateCount ?? random(12, 25) })
                 };
                 particles.push(new Particle(x, y, baseHue, particleOptions));
             }
             break;
        }
        case 'whisperingTendrils': {
            for (let i = 0; i < 20; i++) {
                 // Already has low default brightness (25-45) - KEEPING ORIGINAL
                 particles.push(new Particle(x, y, baseHue, { particleType: 'tendril', angle: options.angle ?? random(0, Math.PI * 2), speed: options.speed ?? random(0.5, 1.8), gravityMultiplier: options.gravityMultiplier ?? random(0.05, 0.25), decayMultiplier: options.decayMultiplier ?? random(0.08, 0.25), saturation: options.saturation ?? random(20, 40), brightness: options.brightness ?? random(60, 80), lineWidth: options.lineWidth ?? random(0.2, 0.8), coordinateCount: options.coordinateCount ?? random(15, 30) }));
             }
            break;
        }
               // --- Find this case in createParticles ---
// --- Find and Replace case 'blackHole' in createParticles ---
case 'blackHole': {
    console.log("Registering Black Hole and spawning VISUAL MARKER");

    // --- A. Register the Functional Black Hole for Gravity ---
    const sizeOption = options.size || ['Small', 'Medium', 'Large', 'Very Large'][Math.floor(random(0,4))];
    const baseRadius = (sizeOption === 'Very Large' ? 250 : (sizeOption === 'Large' ? 160 : (sizeOption === 'Medium' ? 100 : 60)));
    const bhRadius = baseRadius * (canvas.width / 1000); // Adjust scaling denominator (e.g., 1000 or 1200)
    const bhStrength = (options.strength ?? random(5.0, .0)) * (baseRadius / 150);
    const bhDuration = options.duration ?? random(7000, 10000); // Adjusted default duration

    const blackHoleData = {
        id: Date.now() + Math.random(), x: x, y: y,
        radius: bhRadius, strength: bhStrength, startTime: performance.now(),
        duration: bhDuration, active: true
    };
    activeBlackHoles.push(blackHoleData);
    console.log(`Added BH: Strength=${bhStrength.toFixed(2)}, Radius=${bhRadius.toFixed(1)}, Duration=${bhDuration}ms`);

    // Remove the black hole effect after its duration using timeout
    setTimeout(() => {
         const index = activeBlackHoles.findIndex(bh => bh.id === blackHoleData.id);
         if (index > -1) { activeBlackHoles.splice(index, 1); /* console.log(`Removed BH ${blackHoleData.id}`); */ }
    }, bhDuration);
    // --- End Registering Functional Black Hole ---

    // --- B. Create a simple VISUAL MARKER (e.g., slow dark ring) ---
    // This indicates the black hole's presence without faking the spiral
    const markerHue = options.hue ?? 280; // Dark purple default
    particles.push(new Particle(x, y, markerHue, {
        type: 'ring', // Use ring effect logic if available OR just make it a slow burst
        radius: 20, // Start small
        speed: 5, // VERY slow expansion (if using ring logic that uses speed)
        gravityMultiplier: 0,
        decayMultiplier: 1000 / bhDuration * 0.8, // Fades slightly before BH effect ends
        brightness: random(60, 80), // Very Dim
        saturation: random(30, 50),
        coordinateCount: 1 // No trail needed for marker usually
     }));
     // --- End Visual Marker ---

    break; // Black Hole type itself doesn't create the main particle effect
}
        case 'strobeGlitter': {
             // Lowered base glitter brightness, kept strobe flash bright for contrast
             for (let i = 0; i < count * 0.8; i++) { particles.push(new Particle(x, y, baseHue, { speed: random(1, 6), gravityMultiplier: 1.2, decayMultiplier: 1.3, brightness: random(50, 70) })); } // Max 70 base
             for (let i = 0; i < count * 0.3; i++) { particles.push(new Particle(x, y, baseHue + random(-10, 10), { speed: random(1, 4), gravityMultiplier: 1.0, decayMultiplier: 2.0, brightness: random(90, 100), lineWidth: random(1, 2), coordinateCount: 3 })); } // Keep strobe flash bright
             break;
        }
        case 'antiMatterImplosion': {
            console.log("Creating CHAOTIC antiMatterImplosion"); // Debug
            const maxRadius = (options.size === 'Very Large' ? 160 : (options.size === 'Large' ? 110 : 70)) * (canvas.width / 1000); // Base Radius
            const particleCount = Math.floor(count * 1.5); // Dense rush
            const flashDuration = 150;

            // 1. Central Flash (Optional - keep or remove)
             // Comment this out if you want NO central flash, only inward rush
            /*
            particles.push(new Particle(x, y, options.hue ?? 60, {
                 particleType: 'strobe',
                 speed: random(1, 3), brightness: 100, decayMultiplier: 1000 / flashDuration,
                 gravityMultiplier: 0, coordinateCount: 1
            }));
            */

            // 2. Chaotically Aimed Inward Streaks
            for (let i = 0; i < particleCount; i++) {
                 // Randomize distance slightly FROM the maxRadius inwards
                 const currentRadius = maxRadius * random(0.8, 1.1);
                 // Determine spawn angle - Maybe bias density? (Example: 70% random, 30% focus on one side)
                 let spawnAngle;
                 if (random(0, 100) < 70) {
                     spawnAngle = random(0, Math.PI * 2); // Random angle most of the time
                 } else {
                     const biasAngle = options.biasAngle ?? random(0, Math.PI * 2); // Bias spawn direction sometimes
                     spawnAngle = biasAngle + random(-Math.PI / 3, Math.PI / 3); // Spawn within a 120deg arc
                 }

                 const spawnX = x + Math.cos(spawnAngle) * currentRadius;
                 const spawnY = y + Math.sin(spawnAngle) * currentRadius;

                 // Angle towards the center, with MORE randomness for 'twisting'
                 const angleToCenter = Math.atan2(y - spawnY, x - spawnX) + random(-0.4, 0.4); // Increased random offset

                 // Randomize speed significantly
                 const speed = random(5, 25); // Wider speed range

                 // Maybe randomly choose particle effect type for variation?
                 let particleType = 'streak'; // Custom type for logic below
                 let specificOptions = {};
                 if (random(0, 100) < 5) { // 5% chance for a crackle particle
                     particleType = 'crackle';
                     specificOptions = { isCrackleSource: true, brightness: random(50, 70) };
                 } else if (random(0,100) < 3) { // 3% chance for a pixel particle
                     particleType = 'pixel';
                      specificOptions = { particleType: 'pixel', pixelSize: random(3,6), brightness: random(40, 60)};
                 } else { // Default 'streak' particle
                     specificOptions = {
                        brightness: random(20, 45), // Keep default streaks dim
                        saturation: random(30, 60),
                        lineWidth: random(0.5, 1.5),
                        coordinateCount: random(2, 4) // Short streaks
                    };
                 }


                 particles.push(new Particle(spawnX, spawnY, baseHue, {
                    angle: angleToCenter,
                    speed: speed,
                    gravityMultiplier: 0,   // Still no gravity pull for implosion streaks
                    decayMultiplier: random(1.2, 3.0), // Wider decay range
                    ...specificOptions // Add type-specific options
                 }));
            }
            break;
        }
                  // --- Black Hole Case ---
        case 'blackHole': {
            console.log("Registering Black Hole & Creating Spiral Visual");

            // ==========================================================
            // SECTION A: Register the FUNCTIONAL Black Hole for Gravity
            // This part creates the invisible force that pulls OTHER particles
            // ==========================================================
            const sizeOption = options.size || ['Small', 'Medium', 'Large', 'Very Large'][Math.floor(random(0, 4))];
            // Radius of gravitational influence (adjust base values as needed)
            const baseRadius = (sizeOption === 'Very Large' ? 300 : (sizeOption === 'Large' ? 220 : (sizeOption === 'Medium' ? 160 : 100)));
            const bhRadius = baseRadius * (canvas.width / 1200); // Scale influence radius with canvas width
            // Strength of the pull (scales slightly with size, adjust base range/multiplier as needed)
            const bhStrength = (options.strength ?? random(3.0, 5.0)) * (baseRadius / 150);
            // How long the gravitational pull lasts (in milliseconds)
            const bhDuration = options.duration ?? random(6000, 10000);

            const blackHoleData = {
                id: Date.now() + Math.random(), // Unique ID for removal
                x: x,                           // Center X of the black hole
                y: y,                           // Center Y of the black hole
                radius: bhRadius,               // Radius of influence
                strength: bhStrength,           // Pull strength
                startTime: performance.now(),   // When it was created
                duration: bhDuration,           // How long it lasts
                active: true                    // Mark as active
            };

            // Add to the global array so Particle.update can see it
            activeBlackHoles.push(blackHoleData);
            console.log(`Added BH: Strength=${bhStrength.toFixed(2)}, Radius=${bhRadius.toFixed(1)}, Duration=${bhDuration}ms`);

            // Schedule removal of the functional black hole from the active list
            setTimeout(() => {
                const index = activeBlackHoles.findIndex(bh => bh.id === blackHoleData.id);
                if (index > -1) {
                    activeBlackHoles.splice(index, 1);
                    console.log(`Removed Functional BH ${blackHoleData.id} after duration.`);
                }
            }, bhDuration);
            // --- End Functional Black Hole Registration ---


            // ==========================================================
            // SECTION B: Create the VISUAL Spiral Particles
            // This part creates the particles that fly outwards in a spiral
            // ==========================================================
            const spiralParticleCount = Math.min(500, Math.floor(count * 2.5)); // Keep particle count high
            const numArms = options.arms ?? Math.floor(random(2, 5));
            const numRotations = options.rotations ?? random(10, 20);
    
            // --- ADJUST THESE PARAMETERS FOR CURVINESS EMPHASIS ---
    
            // 1. LOWER Initial Speed: Make particles start slower, so the sideways motion is more obvious relative to outward motion.
            const initialSpeed = options.initialSpeed ?? random(0.1, 0.5); // <<-- SIGNIFICANTLY REDUCED (Try this first!)
    
            // 2. REDUCE Expansion Speed: Make the spiral unwind slower, keeping it coiled longer.
            const spiralTightness = options.tightness ?? random(0.5, 1.5); // <<-- REDUCED (Try this second)
    
            // 3. INCREASE Friction (Closer to 1.0): Let particles keep their velocity longer.
            const particleFriction = 0.992; // <<-- INCREASED (Less slowdown per frame)
    
            // 4. DECREASE Decay: Let particles live longer to show the curve.
            const particleDecayMultiplier = random(0.6, 1.0); // <<-- DECREASED RANGE
    
            // 5. VERY LOW Gravity: Prevent downward pull from distorting the spiral.
            const particleGravityMultiplier = 0.05; // <<-- VERY LOW
    
            // --- Keep Curviness Control (Ensure it's set high if you want max curve) ---
            // For testing maximum curve, you can temporarily hardcode it to 1.0:
            // const tangentialRatio = 1.0;
            // Or keep the random range high:
            const tangentialRatio = options.tangentialRatio ?? random(0.8, 1.0); // High range for strong curve
            // --- End Curviness Control ---
    
            const particleHueShift = options.hueShift ?? 30;
            const angleOffsetBetweenArms = (Math.PI * 2) / numArms;
            const spiralDirection = options.spiralDirection ?? (random(0, 1) > 0.5 ? 1 : -1);
    
            // --- The rest of the calculation logic remains the same ---
            for (let i = 0; i < spiralParticleCount; i++) {
                const armIndex = i % numArms;
                const progress = i / spiralParticleCount;
                const theta = progress * Math.PI * 2 * numRotations;
    
                const radialAngle = theta + (armIndex * angleOffsetBetweenArms);
                const baseSpeed = initialSpeed + (theta * spiralTightness * 0.1); // Base speed still increases outwards slowly
                const tangentialAngle = radialAngle + (spiralDirection * Math.PI / 2);
    
                const speedRadial = baseSpeed * (1 - tangentialRatio);
                const speedTangential = baseSpeed * tangentialRatio;
    
                const vx = Math.cos(radialAngle) * speedRadial + Math.cos(tangentialAngle) * speedTangential;
                const vy = Math.sin(radialAngle) * speedRadial + Math.sin(tangentialAngle) * speedTangential;
    
                const finalInitialAngle = Math.atan2(vy, vx);
                // Ensure speed isn't literally zero if initialSpeed is very low and tangentialRatio is 1
                const finalInitialSpeed = Math.max(0.01, Math.sqrt(vx * vx + vy * vy));
    
                const particleHue = (baseHue + (progress * particleHueShift * numRotations)) % 360;
    
                // Create the visual spiral particle using the ADJUSTED physics parameters
                particles.push(new Particle(
                    x, y, particleHue,
                    {
                        angle: finalInitialAngle,
                        speed: finalInitialSpeed,
                        // --- Apply the adjusted physics here ---
                        gravityMultiplier: particleGravityMultiplier, // Use the very low gravity
                        friction: particleFriction,                 // Use the higher friction value (less slowdown)
                        decayMultiplier: particleDecayMultiplier,     // Use the lower decay multiplier (longer life)
                        // --- Keep visual parameters ---
                        brightness: random(55, 80), // Slightly brighter maybe?
                        saturation: random(80, 100),
                        lineWidth: random(1, 2.0), // Maybe slightly thinner lines?
                        coordinateCount: random(4, 7) // Slightly longer trails might help show curve
                    }
                ));
            }
            // --- End Visual Spiral Particles ---
            break; // End of the blackHole case
        }
        // --- Add these NEW CASES inside the switch(type) in createParticles ---

        case 'dragonSegment': {
            const segmentLength = options.length ?? 0.8; // Controls speed/spread perpendicular
            const particleCount = Math.floor(count * (options.density ?? 1.0)); // Allow density override
            const forwardAngle = options.travelAngle ?? 0; // The angle the dragon is moving TOWARDS this point

            // Calculate angle perpendicular to the travel direction
            const perpAngle1 = forwardAngle + Math.PI / 2;
            const perpAngle2 = forwardAngle - Math.PI / 2;

            for (let i = 0; i < particleCount; i++) {
                // Alternate between the two perpendicular directions for a line segment
                const angle = (i % 2 === 0) ? perpAngle1 : perpAngle2;
                // Add slight randomness to angle and distance from center for thickness
                const finalAngle = angle + random(-0.15, 0.15);
                const speed = random(1.5, 4) * segmentLength; // Speed determines segment "length"

                particles.push(new Particle(x, y, baseHue, { // Launch from explosion point
                    angle: finalAngle,
                    speed: speed,
                    gravityMultiplier: 0.2, // Low gravity, let it curve naturally
                    decayMultiplier: random(0.6, 1.0), // Lingers a bit
                    brightness: random(65, 85),
                    saturation: 100,
                    lineWidth: random(1, 2.5),
                    coordinateCount: random(4, 6)
                 }));
            }
            // Add a few central sparks for core? (Optional)
            for (let i = 0; i < particleCount * 0.1; i++) {
                 particles.push(new Particle(x, y, (baseHue + 30) % 360, { // Brighter core color
                    speed: random(0.5, 2), brightness: random(70, 90), decayMultiplier: 1.5, coordinateCount: 2
                 }));
            }
            break;
        }

        case 'dragonHead': {
            const headScale = 1.5; // Make head slightly larger/denser
            const particleCount = Math.floor(count * headScale * 1.2); // More particles for head
            const forwardAngle = options.travelAngle ?? 0;
            const perpAngle1 = forwardAngle + Math.PI / 2;
            const perpAngle2 = forwardAngle - Math.PI / 2;

            // Create segment particles like dragonSegment but maybe brighter/wider spread
            for (let i = 0; i < particleCount * 0.7; i++) {
                const angle = (i % 2 === 0) ? perpAngle1 : perpAngle2;
                const finalAngle = angle + random(-0.25, 0.25); // Wider angle spread for head
                const speed = random(2, 5) * headScale;
                particles.push(new Particle(x, y, baseHue, {
                    angle: finalAngle, speed: speed, gravityMultiplier: 0.25,
                    decayMultiplier: random(0.8, 1.2), brightness: random(75, 95), // Brighter head
                    lineWidth: random(1.5, 3), coordinateCount: random(5, 7)
                 }));
            }
            // Add Crackle/Glitter for mane/features
            for (let i = 0; i < particleCount * 0.4; i++) {
                 const effectType = random(0, 1) > 0.4 ? 'crackle' : 'glitter'; // Mix crackle & glitter
                 particles.push(new Particle(x, y, (baseHue + random(20, 40)) % 360, { // Gold/Yellow accents
                    particleType: effectType === 'crackle' ? 'crackle' : 'glitter', // Set type for particle if needed
                    isCrackleSource: effectType === 'crackle', // Enable crackle logic if crackle
                    angle: forwardAngle + random(-Math.PI/3, Math.PI/3), // Forward cone for mane
                    speed: random(3, 8), gravityMultiplier: 0.5, decayMultiplier: 1.5,
                    brightness: random(70, 90)
                 }));
            }
            break;
        }

        case 'fireBreath': {
            const coneAngle = options.angle ?? -Math.PI / 2; // Angle of the cone center (default UP?)
            const coneSpread = options.spread ?? Math.PI / 4; // How wide the cone is (e.g., 45 deg)
            const particleCount = Math.floor(count * 2.0); // DENSE breath
            const breathSpeed = options.speed ?? random(12, 22); // FAST breath
            const effectMix = options.effect ?? 'leaves'; // 'leaves', 'glitter', or 'mixed'

            for (let i = 0; i < particleCount; i++) {
                 const angle = coneAngle + random(-coneSpread / 2, coneSpread / 2);
                 const speed = breathSpeed * random(0.8, 1.1);
                 const hue = random(0, 50); // Red-Orange-Yellow range

                 let particleOptions = {
                    angle: angle, speed: speed,
                    gravityMultiplier: random(0.3, 0.7), // Some gravity drop
                    decayMultiplier: random(1.5, 2.5), // Fades reasonably fast
                    brightness: random(50, 70),
                    lineWidth: random(1, 3),
                    coordinateCount: random(3, 5)
                 };

                 let typeToUse = 'standard'; // Fallback
                 if (effectMix === 'leaves' || (effectMix === 'mixed' && random(0,1) > 0.4)) {
                     typeToUse = 'leaves'; // Primarily leaves
                 } else if (effectMix === 'glitter' || effectMix === 'mixed') {
                     typeToUse = 'glitter'; // Use glitter particles
                     particleOptions.decayMultiplier = random(1.8, 3.0); // Glitter fades faster
                     particleOptions.brightness = random(60, 85);
                 }

                 // We create the particle type directly, no need for firework launch?
                 // Or maybe launch firework TO this point with options? Let's try direct particle.
                 particles.push(new Particle(x, y, hue, particleOptions));
                 // If using firework launch: launchFirework(x-1, y-1, x, y, typeToUse, hue, particleOptions);

            }
            break;
        }

        // --- Keep ALL OTHER existing cases ---
        // case 'glitter': { ... break; }
        // case 'ring': { ... break; }
        // ... etc ...
         // --- Default Case ---
        case 'standard':
        default:
             // Lowered brightness
            for (let i = 0; i < count; i++) { particles.push(new Particle(x, y, baseHue, { brightness: random(50, 70) })); } // Max 70
            break;
    } // End Switch
}
// --- NEW HELPER: Launch particles from edges spiraling INWARDS ---
// --- REVISED HELPER: Launch particles from edges spiraling INWARDS ---
// --- REVISED HELPER: Launch particles DIRECTLY from edges spiraling INWARDS ---
function launchInwardWave(startTime, duration, density, centerXPercent, centerYPercent, hueRange, effectType = 'glitter',
    minRadiusPercent, maxRadiusPercent, speedRange = [3, 7], // Keep slower speed
    spiralFactor = 0.8, particleOptions = {}) {
// console.log(`Scheduling DIRECT inward wave: type=${effectType}, start=${startTime}, dur=${duration}, dens=${density}`);
const centerX = canvas.width * (centerXPercent / 100);
const centerY = canvas.height * (centerYPercent / 100);

for (let i = 0; i < density; i++) {
const launchTime = startTime + random(0, duration);

// Calculate spawn point near the outer radius
const spawnAngle = random(0, Math.PI * 2);
// Ensure radius calculation is based on a consistent dimension, e.g., average or min/max
const baseDimension = Math.min(canvas.width, canvas.height); // Or use canvas.width
const spawnRadius = random(baseDimension * (minRadiusPercent / 100), baseDimension * (maxRadiusPercent / 100));
const spawnX = centerX + Math.cos(spawnAngle) * spawnRadius;
const spawnY = centerY + Math.sin(spawnAngle) * spawnRadius;

// --- Calculate INITIAL particle velocity vector ---
// 1. Angle directly TOWARDS the target center
const angleToCenter = Math.atan2(centerY - spawnY, centerX - spawnX);
// 2. Angle PERPENDICULAR (tangential) to the center
const tangentialAngle = angleToCenter + (Math.PI / 2); // Adjust +/- for direction maybe

// 3. Calculate initial speed
const speed = random(speedRange[0], speedRange[1]);

// 4. Combine direct and tangential components for initial velocity
let vx = Math.cos(angleToCenter) * speed * (1 - spiralFactor); // Direct component
let vy = Math.sin(angleToCenter) * speed * (1 - spiralFactor);
vx += Math.cos(tangentialAngle) * speed * spiralFactor; // Tangential component
vy += Math.sin(tangentialAngle) * speed * spiralFactor;

// 5. Convert final vx, vy back into angle and speed for the particle
const finalInitialSpeed = Math.sqrt(vx*vx + vy*vy);
const finalInitialAngle = Math.atan2(vy, vx);
// --- End Velocity Calculation ---

const hue = random(hueRange[0], hueRange[1]);

// Base options for the chosen effectType
let baseEffectOptions = {};
switch(effectType) {
case 'whisperingTendrils':
baseEffectOptions = {
particleType: 'tendril',
gravityMultiplier: random(0.02, 0.15),
decayMultiplier: random(0.15, 0.35), // Slightly longer life maybe
saturation: particleOptions.saturation ?? random(20, 40),
brightness: particleOptions.brightness ?? random(15, 30), // Keep dim
lineWidth: particleOptions.lineWidth ?? random(0.3, 1.0),
coordinateCount: particleOptions.coordinateCount ?? random(10, 20)
};
break;
case 'voidCore': // Launching VOIDS inwards? Interesting...
baseEffectOptions = {
particleType: 'void',
voidSize: particleOptions.voidSize ?? random(5, 10), // Small voids
gravityMultiplier: 0,
decayMultiplier: random(1.5, 3), // Faster fade than tendrils
alpha: random(0.5, 0.8),
coordinateCount: 1
};
break;
case 'leaves':
baseEffectOptions = {
gravityMultiplier: 0.1, // Low gravity for leaves too
decayMultiplier: random(0.6, 1.0), // Longer than glitter/burst
brightness: random(40, 60),
lineWidth: random(1.5, 3)
};
break;
case 'glitter':
default: // Default to glitter-like physics
baseEffectOptions = {
gravityMultiplier: 0.05, // Low gravity
decayMultiplier: random(0.6, 1.2), // Make glitter last longer
brightness: random(65, 85),
coordinateCount: random(3, 5)
};
break;
}

// Merge base effect options with any specific overrides from the sequence step
const finalOptions = {
angle: finalInitialAngle,
speed: finalInitialSpeed,
...baseEffectOptions, // Apply defaults for the type
...particleOptions    // Apply sequence-specific overrides LAST
};


// Schedule the DIRECT particle creation
setTimeout(() => {
// Directly push the particle, originating from the calculated spawn point
particles.push(new Particle(
spawnX, // << START particle at the edge
spawnY,
hue,
finalOptions
));
}, launchTime);
}
}
// --- Function to Initialize Speech Recognition ---
function initializeSpeechRecognition() {
    console.log("Attempting to initialize Speech Recognition...");
    // Check browser compatibility (prefixed for Chrome/Edge/Safari)
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
        console.error("Speech Recognition API not supported.");
        if (speechStatusSpan) speechStatusSpan.textContent = "Not Supported";
        if (startSpeechButton) startSpeechButton.disabled = true;
        recognition = null; // Ensure it's null
        return; // Stop initialization
    }

    // --- If supported, create instance ---
    recognition = new SpeechRecognition();
    recognition.continuous = true;      // Stop after one utterance detected + processed
    recognition.lang = 'en-US';          // Language
    recognition.interimResults = false;  // Only final results
    recognition.maxAlternatives = 1;     // Only the best guess

    // --- Event Handlers ---
    recognition.onresult = (event) => {
        // Loop through results (needed for continuous)
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) { // Process only final results
                const command = event.results[i][0].transcript.trim().toLowerCase();
                console.log('Speech Result:', command);
                if (speechStatusSpan) speechStatusSpan.textContent = `Heard: "${command}"`;
                handleCommand(command); // Call a separate function to handle commands
            }
        }
    };

    recognition.onspeechend = () => {
        console.log('Speech paused (waiting for more or stopped)');
        // Recognition automatically stops after this in non-continuous mode
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMsg = `Mic Error: ${event.error}`;
        if (event.error === 'no-speech') { errorMsg = "No speech detected."; /* Don't stop listening on this error in continuous mode */ return; }
        else if (event.error === 'audio-capture') { errorMsg = "Mic blocked?"; shouldBeListening = false; } // Stop on critical errors
        else if (event.error === 'not-allowed') { errorMsg = "Permission denied."; shouldBeListening = false; } // Stop on critical errors
        else { shouldBeListening = false; } // Stop on other errors too

        if (speechStatusSpan) speechStatusSpan.textContent = errorMsg;
        isListening = false;
        if(startSpeechButton) startSpeechButton.textContent = '🎤';
        if(speechStatusSpan) speechStatusSpan.classList.remove('listening');
        setTimeout(() => { if(speechStatusSpan && !isListening) speechStatusSpan.textContent = "Mic Off"; }, 2000);
    };

    recognition.onend = () => {
        // This fires when recognition truly stops (manually, by error, or sometimes timeout)
        console.log('Recognition service ended.');
        isListening = false;
        if (speechStatusSpan) {
             speechStatusSpan.textContent = "Mic Off";
             speechStatusSpan.classList.remove('listening');
        }
        if (startSpeechButton) startSpeechButton.textContent = '🎤';

        // --- KEY CHANGE: AUTO-RESTART ---
        // If we intended to be listening, try starting again after a short delay
        if (shouldBeListening) {
            console.log("Attempting to automatically restart listening...");
            setTimeout(() => {
                if (shouldBeListening && !isListening) { // Double check flags
                    try {
                         recognition.start();
                         isListening = true; // Assume success for UI update
                         if (speechStatusSpan) { speechStatusSpan.textContent = "Listening..."; speechStatusSpan.classList.add('listening');}
                         if (startSpeechButton) startSpeechButton.textContent = '🛑';
                    } catch(e) {
                         console.error("Restart failed:", e);
                         shouldBeListening = false; // Give up if restart fails
                         if (speechStatusSpan) speechStatusSpan.textContent = "Restart Error";
                         if (startSpeechButton) startSpeechButton.textContent = '🎤';
                    }
                }
            }, 500); // 500ms delay before restart
        }
        // --- END KEY CHANGE ---
    };

    console.log("Speech Recognition Initialized (Continuous Mode).");
    if (speechStatusSpan) speechStatusSpan.textContent = "Mic Ready";
    if (startSpeechButton) startSpeechButton.disabled = false;

}// End initializeSpeechRecognition
// --- Function to Toggle Listening ---
// --- Modify toggleListening Function ---
function toggleListening() {
    if (!recognition) {
        initializeSpeechRecognition();
        if (recognition) { setTimeout(toggleListening, 100); } // Retry after init
        return;
    };

    if (isListening) {
        shouldBeListening = false; // <<< Signal that we DON'T want to auto-restart
        recognition.stop(); // Manually stop
        // onend handler will update UI
        console.log("Stopped listening manually.");
    } else {
        shouldBeListening = true; // <<< Signal that we DO want to listen (and auto-restart)
        try {
            recognition.start(); // Start listening
            isListening = true; // Assume success for immediate UI feedback
            if (speechStatusSpan) {
                 speechStatusSpan.textContent = "Listening...";
                 speechStatusSpan.classList.add('listening');
            }
            if (startSpeechButton) startSpeechButton.textContent = '🛑';
            console.log("Started listening.");
        } catch (e) {
             console.error("Error starting recognition:", e);
             shouldBeListening = false; // Don't try to restart if initial start failed
             isListening = false;
             if (speechStatusSpan) { speechStatusSpan.textContent = "Start Error"; speechStatusSpan.classList.remove('listening'); }
             if (startSpeechButton) startSpeechButton.textContent = '🎤';
        }
    }
}
// --- NEW Function to Handle Recognized Commands ---
function handleCommand(command) {
    // --- Command Matching ---
    if (command.includes('launch') || command.includes('finale')) {
        console.log('>>> Triggering Finale via Speech!');
        triggerFinale(6000, 25); // Trigger your finale function

    } else if (command.includes('echo') || command.includes('oblivion')) { // Added oblivion
        console.log('>>> Triggering Doom Wave via Speech!');
        triggerPresetSequence('echoOfOblivion');

    }
    else if (command.includes('cyber') || command.includes('punk')|| command.includes('cyberpunk')) { // Added oblivion
        console.log('>>> Triggering Doom Wave via Speech!');
        triggerPresetSequence('cyberneticFury');

    } else if (command.includes('heart') || command.includes('heart')) { // Added love
        console.log('>>> Triggering Heart Overload via Speech!');
        triggerPresetSequence('digitalHeartbeat');

    } else if (command.includes('magma') || command.includes('volcano') || command.includes('eruption')) {
         console.log('>>> Triggering Eruption via Speech!');
         triggerPresetSequence('moltenCoreEruption');

    } else if (command.includes('dragon')||command.includes('fire')) { // <<< NEW DRAGON COMMAND
         console.log('>>> Triggering Fire Dragon via Speech!');
         triggerPresetSequence('fireDragon');

    } else if (command.includes('anti matter') || command.includes('collapse')) { // <<< NEW BLACK HOLE COMMAND
        console.log('>>> Triggering Black Hole Collapse via Speech!');
        // You might want to trigger 'antiMatterCollapse' OR directly create a large BH
        // Option A: Trigger the sequence
        triggerPresetSequence('antiMatterCollapse');
        // Option B: Directly create one huge, long-lasting Black Hole
        /*
        launchFirework(
            canvas.width / 2, canvas.height / 2, // Start rocket near center? Or bottom?
            canvas.width / 2, canvas.height * 0.45, // Target center
            'blackHole', // Type
            0, // Hue (doesn't matter)
            { size: 'Very Large', strength: 3.0, duration: 10000 } // Options: Big, Strong, 10 seconds
        );
        */
    }else if (command.includes('black hole')) { // Specific command for just the BH effect
            console.log('>>> Summoning Ultra Large Black Hole via Speech!');
            // Launch ONE firework targeting the center, which creates the black hole effect
            launchFirework(
                canvas.width / 2, canvas.height, // Start from bottom center
                canvas.width / 2, canvas.height * 0.45, // Target middle-ish Y
                'blackHole', // <<<< Specify the type
                0, // Hue doesn't matter
                { // Options for createParticles -> blackHole case
                    size: 'Very Large', // <<<< Force max size
                    strength: 3.0,     // <<<< Strong pull
                    duration: 20000    // <<<< Long duration (20 seconds)
                }
            );

    } else if (command.includes('clear')) {
         console.log('>>> Clearing Canvas via Speech!');
         if(clearButton) clearButton.click(); // Simulate click

    }
    // Add more 'else if' blocks here for every preset sequence button you want to trigger!
    // else if (command.includes('jewel') || command.includes('diamond')) {
    //     console.log('>>> Triggering Jewel Rain via Speech!');
    //     triggerPresetSequence('rainingJewelsOverload');
    // }
    // ... etc ...

    else {
         console.log(`Unknown command: "${command}"`);
         // Optional: Give visual feedback for unknown command, then reset status
         if (speechStatusSpan) speechStatusSpan.textContent = `Unknown: "${command}"`;
         setTimeout(() => { if(speechStatusSpan && isListening) speechStatusSpan.textContent = "Listening..."; }, 1500);
    }
}
// --- ADD THIS NEW CLASS ---
class Ripple {
    constructor(x, y) {
        this.x = x;
        // Start the ripple slightly *below* the waterline to make it look like it originates in the water
        this.y = y + random(1, 5);
        this.radius = 1;
        this.maxRadius = random(60, 120); // Smaller max radius for rain ripples?
        this.life = 150; // Lifespan in frames (adjust for desired duration)
        this.maxLife = this.life;
        this.opacity = 0.6; // Initial opacity
        // Simplified ripple: just concentric circles fading out
        // You could add the turbulence logic from the example here if desired
        this.rings = 3;
        this.ringSpacing = 8; // Closer spacing maybe
    }

    update() {
        this.radius += 0.5; // Ripple expansion speed (adjust)
        this.life--;
        // Fade based on life and radius compared to maxRadius
        this.opacity = (this.life / this.maxLife) * (1 - this.radius / this.maxRadius);
        // Return true if ripple should be removed
        return this.life <= 0 || this.opacity <= 0 || this.radius >= this.maxRadius;
    }

    // Basic drawing method - draws simple concentric rings
    // We will call this ONLY if reflections are enabled, within the reflection drawing part of the loop
    draw(ctx) { // Pass the context to draw on
        if (this.y - this.radius > canvas.height) return; // Don't draw if entirely off-screen

        for (let ring = 0; ring < this.rings; ring++) {
            const currentRadius = this.radius - (ring * this.ringSpacing);
            if (currentRadius <= 0) continue;

            const ringOpacity = this.opacity * (1 - ring * 0.3); // Inner rings slightly less opaque

            ctx.beginPath();
            // Draw ellipse: narrower vertically than horizontally
            ctx.ellipse(this.x, this.y, currentRadius, currentRadius * 0.3, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${ringOpacity * 0.8})`;
            ctx.lineWidth = 1; // Thin lines
            ctx.stroke();
        }
    }
}
// --- END OF NEW CLASS ---
function createRaindrop() {
    const x = random(0 - canvas.width * 0.2, canvas.width * 1.2); // Allow starting slightly off-screen horizontally
    const y = random(-150, -10);
    const windFactor = 0.3 + Math.random() * 0.4; // How much wind affects this drop
    return {
        x: x,
        y: y,
        z: random(0.1, 1.0), // Add depth factor for parallax/speed variation
        startX: x, // Store original X for slight sway calculation
        length: random(15, 30) * (0.6 + 0.4 * Math.random()), // Vary length more
        speedY: (random(8, 15) + 5) * (0.5 + 0.5* Math.random()), // Vary speed more, base faster
        opacity: random(0.2, 0.6) * (0.7 + 0.3 * Math.random()), // Vary opacity
        terminalVelocity: (random(12, 22)) * (0.5 + 0.5* Math.random()),
        acceleration: 0.4,
        windFactor: windFactor,
        hitGround: false, // Flag to check if it splashed
        angleOffset: random(-0.02, 0.02) // Subtle random deviation from wind angle
    };
}

function updateRaindrop(drop, index) {
    if (drop.hitGround) return; // Don't update if already splashed

    // Apply Wind horizontal speed (scaled by windFactor)
    drop.x += settings.windSpeedX * drop.windFactor;
    // Accelerate up to terminal velocity
    if (drop.speedY < drop.terminalVelocity) {
        drop.speedY += drop.acceleration;
    }
    drop.y += drop.speedY;


    // Determine ground level (waterline or canvas bottom)
    const groundY = settings.showReflection ? canvas.height * (settings.waterlineYPercent / 100) : canvas.height;

    // --- Splash Detection ---
    if (drop.y >= groundY) {

        // --- MODIFICATION START ---
        if (settings.showReflection) { // ONLY create ripple if reflection is ON
            // Create a ripple at the impact point (drop.x, groundY)
            ripples.push(new Ripple(drop.x, groundY));
            // Optional: Create a small visual splash using particles
            // createSplashParticles(drop.x, groundY); // You'd need to define this function
        }
        // --- MODIFICATION END ---

        // Remove the raindrop after hitting the ground/water
        raindrops.splice(index, 1);
        // Note: We removed the 'hitGround' flag approach from the example
        // for simplicity, just remove the drop immediately.
    }
    // Remove if goes way off screen (existing logic)
    else if (drop.x < -50 || drop.x > canvas.width + 50 || drop.y > canvas.height + 50) {
       raindrops.splice(index, 1);
    }
}

function drawRaindrop(drop) {
    if (drop.hitGround) return;

    // Calculate angle based on wind and speed
    const angle = Math.atan2(settings.windSpeedX * drop.windFactor, drop.speedY) + drop.angleOffset;
    const xEnd = drop.x - Math.sin(angle) * drop.length;
    const yEnd = drop.y - Math.cos(angle) * drop.length;


    ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`; // Bluish-white color
    ctx.lineWidth = random(0.8, 1.5); // Slight width variation
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
}

function createSplashParticles(x, y) {
    const count = random(3, 6); // 3-6 tiny splash droplets
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            x + random(-5, 5), // Spawn near impact x
            y - random(0, 5),  // Spawn slightly above impact y
            190, // Fixed pale blue hue for splash
            { // Particle options for splash
                speed: random(1.5, 3.5),
                angle: random(Math.PI * 1.1, Math.PI * 1.9), // Angle upwards mostly
                gravityMultiplier: 0.6, // Normal-ish gravity pulls them down quickly
                friction: 0.94, // Slow down reasonably fast
                decayMultiplier: random(5, 8), // VERY Fast Fade (lasts only fractions of a second)
                brightness: random(50, 70),
                saturation: 70,
                lineWidth: random(0.5, 1.5),
                coordinateCount: 1 // No trail for splashes
            }
        ));
    }
}


// Snowflake structure (simple object approach)
function createSnowflake() {
    const radius = random(1.5, 4.0); // Increased size variation slightly
    const x = random(0 - canvas.width * 0.1, canvas.width * 1.1); // Allow starting more off-screen for wind
    const y = random(-60, -radius);
    return {
        x: x,
        y: y,
        radius: radius,
        baseSpeedX: random(-0.1, 0.1), // Base individual drift (minimal now)
        speedY: random(0.5, 1.5) * (0.7 + radius/8), // Slower overall, slightly larger flakes fall faster
        opacity: random(0.4, 0.95), // More variation
        targetOpacity: random(0.4, 0.95), // For fading effect
        fadeSpeed: 0.005,
        life: 0, // Track frames lived for subtle drift change
        driftCycle: random(50, 150), // How often drift direction slightly changes
        driftStrength: random(0.1, 0.3) // How much the drift changes
        // Sway properties removed/replaced by wind and drift
    };
}

function updateSnowflake(flake, index) {
    flake.life++;

    // Apply global wind
    let windEffect = settings.windSpeedX * (0.2 + flake.radius / 10); // Wind affects larger flakes slightly more

    // Subtle cyclical drift change independent of main wind
    if (flake.life % Math.floor(flake.driftCycle) === 0) {
        flake.baseSpeedX = random(-flake.driftStrength, flake.driftStrength);
    }
    flake.x += flake.baseSpeedX + windEffect; // Combine base drift and wind

    flake.y += flake.speedY;


     // --- Subtle Opacity Fluctuation ---
    if (flake.opacity < flake.targetOpacity) {
        flake.opacity = Math.min(flake.targetOpacity, flake.opacity + flake.fadeSpeed);
    } else if (flake.opacity > flake.targetOpacity) {
        flake.opacity = Math.max(flake.targetOpacity, flake.opacity - flake.fadeSpeed);
    }
     // Periodically change target opacity for twinkling effect
    if (flake.life % 100 === 0) {
         flake.targetOpacity = random(0.4, 0.95);
    }


    // Reposition if it goes off the bottom
    if (flake.y - flake.radius > canvas.height) {
        // Reset position to top, keeping some properties, randomizing others
        flake.x = random(0 - canvas.width * 0.1, canvas.width * 1.1); // Reset with wind offset possibility
        flake.y = -flake.radius - random(0, 30); // Stagger vertical reset
        flake.life = 0; // Reset life counter
        flake.opacity = 0; // Start faded in
        flake.targetOpacity = random(0.4, 0.95); // New target opacity
        flake.radius = random(1.5, 4.0); // Give it a new size when it respawns
        flake.speedY = random(0.5, 1.5) * (0.7 + flake.radius/8); // Update speed based on new size
        // Optional: Give it a new drift cycle/strength?
        // flake.driftCycle = random(50, 150);
        // flake.driftStrength = random(0.1, 0.3);
    }

     // --- Screen Wrapping (Horizontal) ---
    if (flake.x + flake.radius < -50) { // Add buffer before wrapping
        flake.x = canvas.width + 50;
    } else if (flake.x - flake.radius > canvas.width + 50) {
        flake.x = -50;
    }

}

function drawSnowflake(flake) {
    // Can reuse the simple circle drawing for now
    ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fill();
}


function createAndAddRaindrop() {
    if (raindrops.length < MAX_WEATHER_PARTICLES) {
        raindrops.push(createRaindrop());
    } else {
        // Optionally replace the oldest particle instead of just stopping
        // raindrops.shift();
        // raindrops.push(createRaindrop());
    }
}

function createAndAddSnowflake() {
    if (snowflakes.length < MAX_WEATHER_PARTICLES) {
        snowflakes.push(createSnowflake());
    }
     // Optionally replace the oldest particle instead of just stopping
    // else {
    //    snowflakes.shift();
    //    snowflakes.push(createSnowflake());
    // }
}

// --- NEW HELPER: Launch particles along a line ---
function launchLineEffect(startTime, duration, density, startXPercent, startYPercent, endXPercent, endYPercent, effectType, hue, particleOptions = {}) {
    console.log(`Scheduling line effect: type=${effectType}, start=${startTime}, dur=${duration}, dens=${density}`);
    const startX = canvas.width * (startXPercent / 100);
    const startY = canvas.height * (startYPercent / 100);
    const endX = canvas.width * (endXPercent / 100);
    const endY = canvas.height * (endYPercent / 100);

    for (let i = 0; i < density; i++) {
        const launchTime = startTime + (i / density) * duration; // Spread launch over duration
        // Interpolate position along the line
        const progress = i / (density - 1 || 1);
        const targetX = startX + (endX - startX) * progress;
        const targetY = startY + (endY - startY) * progress;

        // Merge default options with passed options
        const finalOptions = {
            speed: random(8, 15), // Give line particles decent speed
            gravityMultiplier: 0.1, // Low gravity
            decayMultiplier: random(2.0, 4.0), // Fade relatively quickly
            brightness: random(70, 95),
            coordinateCount: 2, // Short trails for line points
            ...particleOptions // Allow overrides
        };

        setTimeout(() => {
            launchFirework(
                targetX - 1, targetY -1, // Start very close to target for instant effect
                targetX, targetY,      // Target explosion point
                effectType,
                hue,
                finalOptions
            );
        }, launchTime);
    }
}
// --- COMPLETE Animation Loop ---
// --- Add near other Helper Functions ---

// --- Catmull-Rom Spline Interpolation ---
// Gets points along a curve passing through p1, p2, p3, p4
// t is the interpolation factor between p2 and p3 (0 to 1)
function catmullRom(p1, p2, p3, p4, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    const bp1 = -0.5 * t3 + 1.0 * t2 - 0.5 * t;
    const bp2 =  1.5 * t3 - 2.5 * t2 + 1.0;
    const bp3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
    const bp4 =  0.5 * t3 - 0.5 * t2;
    return {
        x: p1.x * bp1 + p2.x * bp2 + p3.x * bp3 + p4.x * bp4,
        y: p1.y * bp1 + p2.y * bp2 + p3.y * bp3 + p4.y * bp4
    };
}

// --- Generate Smooth Path from Waypoints ---
// Takes [[time, x%, y%], ...] and generates {x, y, angle} points between them
function generateSmoothPath(waypoints, pointsPerSegment) {
    const pathPoints = [];
    if (waypoints.length < 4) {
        console.error("Need at least 4 waypoints for Catmull-Rom spline.");
        return []; // Cannot generate curve
    }

    // Convert percentage waypoints to simple {x, y} objects for easier math
    const pts = waypoints.map(wp => ({ x: wp[1], y: wp[2] }));

    // Add control points at ends (duplicate first/last actual points)
    pts.unshift(pts[0]); // Add first point again at beginning
    pts.push(pts[pts.length - 1]); // Add last point again at end

    let prevPoint = null;

    // Iterate through the segments defined by the waypoints
    for (let i = 1; i < pts.length - 2; i++) {
        const p1 = pts[i - 1];
        const p2 = pts[i];     // Start of segment
        const p3 = pts[i + 1]; // End of segment
        const p4 = pts[i + 2];

        // Generate intermediate points within this segment
        for (let j = 0; j < pointsPerSegment; j++) {
            const t = j / pointsPerSegment; // Interpolation factor (0 to almost 1)
            const point = catmullRom(p1, p2, p3, p4, t);

            // Calculate travel angle from previous point to this point
            let angle = 0;
            if (prevPoint) {
                angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            } else if (pathPoints.length > 0) { // Use angle from start point if first segment
                 angle = Math.atan2(point.y - pathPoints[0].y, point.x - pathPoints[0].x);
            }

            pathPoints.push({ x: point.x, y: point.y, angle: angle });
            prevPoint = point; // Store for next angle calculation
        }
    }
     // Add the very last waypoint explicitly to ensure endpoint is included
     const lastWp = waypoints[waypoints.length-1];
     let lastAngle = 0;
     if(prevPoint) { lastAngle = Math.atan2(lastWp[2] - prevPoint.y, lastWp[1] - prevPoint.x); }
     pathPoints.push({ x: lastWp[1], y: lastWp[2], angle: lastAngle });


    console.log(`Generated ${pathPoints.length} points for dragon path.`);
    return pathPoints;
}


// --- NEW Helper to Launch Effects Along a Path ---
function launchPathEffects(params) {
    const {
        waypoints, segmentDuration, pointsPerSegment, effectType, hue,
        auraEffectType, auraHue, auraDensityFactor, headEffectType, headHue
    } = params;

    if (!waypoints || waypoints.length < 2) return;

    // Generate the smooth path points (percentages)
    const path = generateSmoothPath(waypoints, pointsPerSegment);
    if (path.length < 2) return;

    // Calculate timing
    const totalDuration = waypoints[waypoints.length - 1][0] - waypoints[0][0];
    const pointsToLaunch = path.length - 1; // Launch segments between points
    const timePerSegment = totalDuration / pointsToLaunch; // Approximate time between segment launches

    // Launch line effects between calculated path points
    for (let i = 0; i < pointsToLaunch; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        const launchTime = waypoints[0][0] + i * timePerSegment; // Distribute launches over total duration
        const segmentAngle = p1.angle; // Use angle calculated by generateSmoothPath

        // Main Dragon Body Segment
        const bodyParams = {
             call: 'launchLineEffect', startTime: launchTime, duration: segmentDuration,
             density:3, // Density per segment - adjust
             startX: p1.x, startY: p1.y, endX: p2.x, endY: p2.y,
             effectType: effectType, hue: hue,
             particleOptions: { brightness: random(75, 90) }
        };
        triggerPresetSequence('dummy', [bodyParams]); // Use trigger function to handle timeout etc.

         // Aura Segment (slightly delayed and offset)
         if (auraEffectType) {
             const auraParams = {
                 call: 'launchLineEffect', startTime: launchTime + 30, duration: segmentDuration * 0.8,
                 density: Math.floor(10 * auraDensityFactor),
                 // Calculate slightly offset start/end points (perpendicular to segmentAngle)
                 startX: p1.x + Math.cos(segmentAngle + Math.PI/2) * 1.5, // Offset by 1.5% perpendicular
                 startY: p1.y + Math.sin(segmentAngle + Math.PI/2) * 1.5,
                 endX: p2.x + Math.cos(segmentAngle + Math.PI/2) * 1.5,
                 endY: p2.y + Math.sin(segmentAngle + Math.PI/2) * 1.5,
                 effectType: auraEffectType, hue: auraHue,
                 particleOptions: { brightness: random(60, 75), lineWidth: 0.8 }
             };
             triggerPresetSequence('dummy', [auraParams]);
             // Could add a second aura line offset the other way (- Math.PI/2)
         }

         // Head Flare (only at the very end of the path)
         if (i === pointsToLaunch - 1 && headEffectType) {
              const headTime = launchTime + timePerSegment; // After last segment launches
              const headParams = {
                  time: headTime, x: p2.x, y: p2.y, type: headEffectType, hue: headHue, brightness: 100
              };
              triggerPresetSequence('dummy', [headParams]);
              // Add crackle too?
               const crackleParams = {
                  time: headTime + 50, x: p2.x, y: p2.y, type: 'crackle', hue: (headHue + 20) % 360, brightness: 90
              };
               triggerPresetSequence('dummy', [crackleParams]);
         }
    }
}

// --- Dummy function needed by launchPathEffects' trigger call ---
// This is needed because triggerPresetSequence expects a name, but we only pass steps
presetSequences['dummy'] = [];
// --- COMPLETE Animation Loop ---
// --- COMPLETE REVISED Animation Loop ---
function loop(timestamp) {
    // Request the next frame *first* - Ensures loop continues even if errors occur later
    animationFrameId = requestAnimationFrame(loop);

    // --- 1. Setup for Drawing: Reset Composite Operation ---
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0; // Ensure alpha is reset

    // --- 2. Draw Background ---
    drawSkyGradient(ctx);

    // --- 3. Draw Scenery (Optional) ---
    if (settings.showSilhouette) {
        drawSilhouette(ctx);
    }

    // --- 4. Set Blending for Fireworks ---
    ctx.globalCompositeOperation = 'lighter';

    // --- 5. Update and Draw Fireworks & Particles (Normal View) ---
    try {
        let i = fireworks.length;
        while (i--) {
            if (fireworks[i]) {
                fireworks[i].update(i);
                if (fireworks[i]) fireworks[i].draw();
            }
        }
        let j = particles.length;
        while (j--) {
            if (particles[j]) {
                particles[j].update(j);
                if (particles[j]) particles[j].draw();
            }
        }
    } catch (e) {
        console.error("Error during primary update/draw loop:", e);
    }
    if (settings.hueCycling && (currentMode === 'free-play' || !isPlayingShow)) {
        hue += 0.1; // Or maybe a different increment value
        if (hue >= 360) hue -= 360; // Keep hue in range
    }
    // --- 6. Draw Reflection (Optional & Expensive) ---
    if (settings.showReflection) {
        ctx.save(); // SAVE state
        console.log("Reflection: Saved context state."); // Log 1

        const waterlineY = canvas.height * (settings.waterlineYPercent / 100);
        console.log(`Reflection: Waterline Y = ${waterlineY.toFixed(1)}`); // Log 2

        // Apply reflection transforms
        ctx.scale(1, -1);
        ctx.translate(0, -canvas.height);
        console.log("Reflection: Applied scale(1, -1) and translate(0, -H)."); // Log 3

        // --- DEFINE AND APPLY CLIPPING REGION ---
        const clipX = 0;
        const clipY = 0; // In TRANSFORMED space, the original top edge is now at y=0 after translate(0, -H)
        const clipWidth = canvas.width;
        const clipHeight = canvas.height * (30 / 100); // The height we want to clip is the height of the original sky area

         console.log(`Reflection: Defining clip rect: x=${clipX}, y=${clipY}, w=${clipWidth}, h=${clipHeight.toFixed(1)}`); // Log 4

        ctx.beginPath(); // START a new path specifically for clipping
        ctx.rect(clipX, clipY, clipWidth, clipHeight); // Define the clipping rectangle
        ctx.clip(); // Apply the clipping path
        console.log("Reflection: Applied clip()."); // Log 5
        // --- END CLIPPING REGION ---


        ctx.globalAlpha = settings.reflectionAlpha; // Set reflection transparency

        // --- REDRAW reflected elements (will now be clipped) ---
        console.log(`Reflection: Starting redraw. FW: ${fireworks.length}, P: ${particles.length}, Sil: ${settings.showSilhouette}`); // Log 6
        try {
            if (settings.showSilhouette) {
                // console.log("Reflection: Drawing silhouette..."); // Verbose
                drawSilhouette(ctx,timestamp);
            }
            let k = particles.length;
            // if (k > 0) console.log("Reflection: Drawing particles..."); // Verbose
            while (k--) { if (particles[k]) particles[k].draw(); }

            let l = fireworks.length;
            // if (l > 0) console.log("Reflection: Drawing fireworks..."); // Verbose
            while (l--) { if (fireworks[l]) fireworks[l].draw(); }

            console.log("Reflection: Finished redraw."); // Log 7

        } catch (e) {
            console.error("Error during clipped reflection draw loop:", e);
        }

        ctx.restore(); // RESTORE state (removes clipping, transforms, alpha changes)
        console.log("Reflection: Restored context state."); // Log 8

        // --- Draw Water Overlay ---
        ctx.globalCompositeOperation = 'source-over';
        drawReflectionOverlay(ctx);

    } // End Reflection Drawing Block

    // --- 7. Spawn Cursor Trail Particles (BEFORE Trail Fade) ---
    if (settings.cursorTrailEnabled && mouse.onCanvas) {
        // *** Spawn particles based on density setting ***
        for (let i = 0; i < settings.cursorTrailDensity; i++) { // Uses setting now
            spawnCursorTrailParticle();
        }
    }

    // --- 8. Trail Fade Effect ---
    // Apply AFTER main draw, reflection draw, and cursor trail draw
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0, 0, 0, ${settings.trailFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 9. Handle Timed Events (Show Playback / Auto Launch) ---
    if (isPlayingShow) {
        const elapsedSeconds = (timestamp - showStartTime) / 1000;
        if(showStatusSpan) showStatusSpan.textContent = `Status: Playing (${elapsedSeconds.toFixed(1)}s)`;
        let allLaunched = true;
        for (let k = 0; k < showSequence.length; k++) {
            const step = showSequence[k];
            if (step && !step.launched && elapsedSeconds >= step.time) {
                launchFirework( random(canvas.width * 0.4, canvas.width * 0.6), canvas.height, canvas.width * (step.x / 100), canvas.height * (step.y / 100), step.type, step.hue, step);
                step.launched = true;
            }
            if (step && !step.launched) allLaunched = false;
        }
        if (allLaunched) {
             const lastStepTime = showSequence.length > 0 ? showSequence.reduce((max, step) => step ? Math.max(max, step.time) : max, 0) : 0;
             if (elapsedSeconds > lastStepTime + 5.0) stopShow();
        }
    } else if (currentMode === 'free-play' && settings.autoLaunch && random(0, 100) < settings.launchFrequency) {
        const startX = random(canvas.width * 0.4, canvas.width * 0.6);
        const startY = canvas.height;
        const endX = random(0, canvas.width); const endY = random(0, canvas.height * 0.6);
        const allowedTypes = settings.allowedFireworkTypes;
        if (allowedTypes.length > 0) {
             const type = allowedTypes[Math.floor(random(0, allowedTypes.length))];
             launchFirework(startX, startY, endX, endY, type, null);
        }
    }

} // End Loop function

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


function setupPresetButtons() {
    const presetButtonContainer = document.querySelector('#presetBar .preset-buttons');
    if (!presetButtonContainer) {
        console.warn("Preset button container (#presetBar .preset-buttons) not found during setup.");
        return;
    }
 
    const presetButtons = presetButtonContainer.querySelectorAll('.preset-button[data-sequence]');
 
    if (presetButtons && presetButtons.length > 0) {
         presetButtons.forEach(button => {
            const sequenceName = button.dataset.sequence;
            if (presetSequences.hasOwnProperty(sequenceName)) {
                // Remove any old listener before adding a new one (safety measure)
                // Cloning and replacing is a simple way to remove all listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
 
                // Add the listener to the NEW button reference
                newButton.addEventListener('click', () => {
                    console.log(`Preset button clicked: ${sequenceName}`); // Log click
                    triggerPresetSequence(sequenceName);
                });
                // Optional: Re-enable button if it was disabled previously
                newButton.disabled = false;
                newButton.style.opacity = '1';
                newButton.style.cursor = 'pointer';
 
            } else {
                console.warn(`Sequence "${sequenceName}" for button not found in presetSequences object.`);
                // Keep original button reference for styling disabled state
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
                button.disabled = true;
            }
        });
        console.log(`Preset button listeners setup for ${presetButtons.length} buttons.`);
    } else {
         console.warn("No preset buttons with [data-sequence] found in container.");
    }
 }
 
// --- COMPLETE setupEventListeners function ---
function setupEventListeners() {
    console.log("Setting up event listeners..."); // Debug start

    // --- UI Toggles ---
    // Mode Toggle
    if (modeToggleButton) {
        modeToggleButton.addEventListener('click', () => {
            if (isPlayingShow) return;
            const panelToHide = (currentMode === 'free-play') ? settingsPanelContainer : plannerPanelContainer;
            const panelToShow = (currentMode === 'free-play') ? plannerPanelContainer : settingsPanelContainer;
            if (panelToHide) { panelToHide.classList.add('hidden'); panelToHide.classList.remove('hidden-by-toggle'); }
            if (panelToShow) { panelToShow.classList.remove('hidden'); panelToShow.classList.remove('hidden-by-toggle'); }
            currentMode = (currentMode === 'free-play') ? 'planner' : 'free-play';
            modeToggleButton.textContent = (currentMode === 'free-play') ? 'Switch to Show Planner' : 'Switch to Free Play';
            fireworks = []; particles = []; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    } else { console.error("Mode toggle button not found"); }

    // Main Settings/Planner Panel Toggle
    if (toggleSettingsButton && settingsPanelContainer && plannerPanelContainer) {
        toggleSettingsButton.addEventListener('click', () => {
            const activePanel = (currentMode === 'free-play') ? settingsPanelContainer : plannerPanelContainer;
            activePanel.classList.toggle('hidden-by-toggle');
            if (activePanel.classList.contains('hidden-by-toggle')) { toggleSettingsButton.innerHTML = '👁️'; toggleSettingsButton.title = "Show Panel"; } else { toggleSettingsButton.innerHTML = '⚙️'; toggleSettingsButton.title = "Hide Panel"; }
            // Ensure inactive panel is hidden correctly after toggle (using mode class)
             const inactivePanel = (currentMode === 'free-play') ? plannerPanelContainer : settingsPanelContainer;
             if (inactivePanel && !activePanel.classList.contains('hidden-by-toggle')) { // Re-hide inactive only if showing active
                 inactivePanel.classList.add('hidden');
             } else if (inactivePanel) { // Ensure inactive is also potentially visible if active is hidden (though unlikely state)
                inactivePanel.classList.remove('hidden-by-toggle');
             }
            console.log("Active Panel Classes after toggle:", activePanel.classList);
        });
    } else { console.error("Could not find #toggleSettingsButton or panel containers"); }

    // Advanced Settings Toggle (Inside Free Play Panel)
    if (toggleAdvancedButton && advancedControlsPanel) {
        toggleAdvancedButton.addEventListener('click', () => {
            advancedControlsPanel.classList.toggle('hidden');
            toggleAdvancedButton.textContent = advancedControlsPanel.classList.contains('hidden') ? 'Show Advanced Settings' : 'Hide Advanced Settings';
            console.log("Advanced Controls Classes:", advancedControlsPanel.classList);
        });
    } else { console.error("Could not find #toggleAdvancedButton or #advancedControls"); }

    // Preset Bar Toggle
    if (togglePresetBarButton && presetBar) {
        togglePresetBarButton.addEventListener('click', () => {
            presetBar.classList.toggle('hidden');
            if (presetBar.classList.contains('hidden')) { togglePresetBarButton.innerHTML = '▲'; togglePresetBarButton.title = "Show Preset Bar"; } else { togglePresetBarButton.innerHTML = '▼'; togglePresetBarButton.title = "Hide Preset Bar"; }
            console.log("Preset Bar Classes:", presetBar.classList);
        });
    } else { console.error("Could not find #togglePresetBar or #presetBar"); }

     // Help Modal Listeners
     if (helpButton && helpModal) { helpButton.addEventListener('click', () => { helpModal.classList.add('visible'); console.log("Help modal opened"); }); } else { console.error("Help button or modal not found."); }
     if (closeHelpButton && helpModal) { closeHelpButton.addEventListener('click', () => { helpModal.classList.remove('visible'); console.log("Help modal closed via button"); }); } else { console.error("Close help button or modal not found."); }
     if (helpModal) { helpModal.addEventListener('click', (event) => { if (event.target === helpModal) { helpModal.classList.remove('visible'); console.log("Help modal closed via background click"); } }); }


    // --- Free Play Input Sliders/Checkboxes ---
    if (particleCountInput) particleCountInput.addEventListener('input', (e) => { settings.particleCount = parseInt(e.target.value); particleCountValueSpan.textContent = e.target.value; });
    // ... listeners for ALL OTHER sliders ...
    if (gravityInput) gravityInput.addEventListener('input', (e) => { settings.gravity = parseFloat(e.target.value); gravityValueSpan.textContent = parseFloat(e.target.value).toFixed(2); });
    if (particleFrictionInput) particleFrictionInput.addEventListener('input', (e) => { settings.particleFriction = parseFloat(e.target.value); particleFrictionValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });
    if (trailFadeInput) trailFadeInput.addEventListener('input', (e) => { settings.trailFade = parseFloat(e.target.value); trailFadeValueSpan.textContent = parseFloat(e.target.value).toFixed(2); });
    if (launchFrequencyInput) launchFrequencyInput.addEventListener('input', (e) => { settings.launchFrequency = parseFloat(e.target.value); launchFrequencyValueSpan.textContent = parseFloat(e.target.value).toFixed(1); });
    if (rocketAccelerationInput) rocketAccelerationInput.addEventListener('input', (e) => { settings.rocketAcceleration = parseFloat(e.target.value); rocketAccelerationValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });
    if (rocketTrailLengthInput) rocketTrailLengthInput.addEventListener('input', (e) => { settings.rocketTrailLength = parseInt(e.target.value); rocketTrailLengthValueSpan.textContent = e.target.value; });
    if (particleTrailLengthInput) particleTrailLengthInput.addEventListener('input', (e) => { settings.particleTrailLength = parseInt(e.target.value); particleTrailLengthValueSpan.textContent = e.target.value; });
    if (particleDecayInput) particleDecayInput.addEventListener('input', (e) => { settings.particleDecay = parseFloat(e.target.value); particleDecayValueSpan.textContent = parseFloat(e.target.value).toFixed(3); });


    // Checkbox Listeners
    if (hueCyclingInput) hueCyclingInput.addEventListener('change', (e) => { settings.hueCycling = e.target.checked; });
    if (autoLaunchInput) autoLaunchInput.addEventListener('change', (e) => { settings.autoLaunch = e.target.checked; });
    if (showSilhouetteInput) showSilhouetteInput.addEventListener('change', (e) => { settings.showSilhouette = e.target.checked; });
    if (showReflectionInput) showReflectionInput.addEventListener('change', (e) => { settings.showReflection = e.target.checked; });
    // --- Cursor Trail Checkbox Listener --- (Should already be here from your steps)
    if (cursorTrailInput) {
        cursorTrailInput.addEventListener('change', (e) => {
            settings.cursorTrailEnabled = e.target.checked;
            console.log("Cursor Trail Toggled:", settings.cursorTrailEnabled);
            // Keep options hidden if main checkbox is unchecked
            if (!settings.cursorTrailEnabled && cursorOptionsDiv) {
                cursorOptionsDiv.classList.remove('visible');
                if (toggleCursorOptionsButton) toggleCursorOptionsButton.classList.remove('open');
            }
            if (!settings.cursorTrailEnabled) mouse.onCanvas = false;
        });
    } else { console.error("Cursor Trail checkbox not found."); }

    if (toggleCursorOptionsButton && cursorOptionsDiv) {
        toggleCursorOptionsButton.addEventListener('click', () => {
            cursorOptionsDiv.classList.toggle('visible');
            toggleCursorOptionsButton.classList.toggle('open');
             toggleCursorOptionsButton.innerHTML = cursorOptionsDiv.classList.contains('visible') ? '▼' : '▶';
        });
         // Ensure options start hidden if checkbox is initially unchecked
         if (!settings.cursorTrailEnabled) {
            cursorOptionsDiv.classList.remove('visible');
            toggleCursorOptionsButton.classList.remove('open');
            toggleCursorOptionsButton.innerHTML = '▶';
        } else if (!cursorOptionsDiv.classList.contains('visible')) {
             // Ensure arrow is correct if options start hidden but checkbox is checked
             toggleCursorOptionsButton.innerHTML = '▶';
        } else {
             toggleCursorOptionsButton.innerHTML = '▼';
        }

    } else { console.error("Cursor options toggle button or div not found."); }

    // --- NEW Listeners for Trail Density and Hue Sliders ---
    if (cursorTrailDensityInput && cursorTrailDensityValueSpan) {
        cursorTrailDensityInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            settings.cursorTrailDensity = value;
            cursorTrailDensityValueSpan.textContent = value;
        });
    }
    if (cursorTrailHueInput && cursorTrailHueValueSpan) {
        cursorTrailHueInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            settings.cursorTrailHue = value;
            cursorTrailHueValueSpan.textContent = value;
            cursorTrailHueValueSpan.style.backgroundColor = `hsl(${value}, 100%, 50%)`;
        });
    }
    if (finaleButton) {
        finaleButton.addEventListener('click', () => {
            // Call triggerFinale, optionally pass duration and intensity
             // Example: 6 seconds, 20% chance every 50ms
            triggerFinale(6000, 100);
            triggerFinale(6000, 100);
        });
    } else {
        console.error("Finale Button not found");
    }
    // All Firework Type Checkboxes
    if (fireworkTypeCheckboxes && fireworkTypeCheckboxes.length > 0) { fireworkTypeCheckboxes.forEach(checkbox => { checkbox.addEventListener('change', () => { settings.allowedFireworkTypes = getSelectedFireworkTypes(); }); }); }

    // Toggle All Firework Type Checkboxes
    if (checkAllTypesButton && fireworkTypeCheckboxes) { checkAllTypesButton.addEventListener('click', () => { fireworkTypeCheckboxes.forEach(cb => { cb.checked = true; }); settings.allowedFireworkTypes = getSelectedFireworkTypes(); console.log("Checked all types."); }); }
    if (uncheckAllTypesButton && fireworkTypeCheckboxes) { uncheckAllTypesButton.addEventListener('click', () => { fireworkTypeCheckboxes.forEach(cb => { cb.checked = false; }); settings.allowedFireworkTypes = getSelectedFireworkTypes(); console.log("Unchecked all types."); }); }


    // --- Canvas Interaction Listeners ---
    // Canvas Click (Launches firework)
    canvas.addEventListener('click', (e) => { if (currentMode === 'free-play' && !isPlayingShow) { const startX = random(canvas.width * 0.4, canvas.width * 0.6); const startY = canvas.height; const endX = e.clientX; const endY = e.clientY; const allowedTypes = settings.allowedFireworkTypes; if (allowedTypes.length > 0) { const type = allowedTypes[Math.floor(random(0, allowedTypes.length))]; launchFirework(startX, startY, endX, endY, type, null); } } });

    // *** ADD THESE MOUSE LISTENERS FOR CURSOR TRAIL ***
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            // Update mouse coordinates relative to the canvas top-left
            // Use getBoundingClientRect for accuracy if canvas has borders/padding/margins
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.onCanvas = true; // Mouse is now on canvas
            // console.log(`Mouse Move: ${mouse.x}, ${mouse.y}`); // Optional debug
        });

        canvas.addEventListener('mouseenter', () => {
             // Good practice to set onCanvas true when mouse enters
             mouse.onCanvas = true;
        });

        canvas.addEventListener('mouseleave', () => { // Use mouseleave instead of mouseout for better accuracy
            mouse.onCanvas = false; // Mouse left the canvas
            // console.log("Mouse Left Canvas"); // Optional debug
        });
    } else {
        console.error("Canvas element not found for mouse listeners.");
    }
    // *** END OF ADDED MOUSE LISTENERS ***

    if (startSpeechButton) {
        // Make sure button isn't disabled by default if API unsupported
        startSpeechButton.disabled = !window.SpeechRecognition && !window.webkitSpeechRecognition;
        startSpeechButton.addEventListener('click', toggleListening);
         console.log("Added listener for speech button.");
    } else {
         console.warn("Start Speech Button not found. Cannot add listener.");
    }



    // --- Planner Listeners ---
    if (addStepButton) addStepButton.addEventListener('click', addStepToShow);
    if (playShowButton) playShowButton.addEventListener('click', playShow);
    if (clearSequenceButton) clearSequenceButton.addEventListener('click', clearSequence);
    if (saveShowButton) saveShowButton.addEventListener('click', saveShow);
    if (loadShowButton) loadShowButton.addEventListener('click', loadShow);
    if (stepHueInput && stepHueValueSpan) { stepHueInput.addEventListener('input', (e) => { const hueVal = e.target.value; stepHueValueSpan.textContent = hueVal; stepHueValueSpan.style.backgroundColor = `hsl(${hueVal}, 100%, 50%)`; }); }

    // --- Clear Button Listener ---
    if (clearButton) { clearButton.addEventListener('click', () => { if (isPlayingShow) return; fireworks = []; particles = []; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }); }

    // --- Window Resize Listener ---
    window.addEventListener('resize', () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); canvas.width = window.innerWidth; canvas.height = window.innerHeight; fireworks = []; particles = []; if (!isPlayingShow) { startAnimation(); } else { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); animationFrameId = requestAnimationFrame(loop); } });

     // --- Preset Button Listeners --- (Keep this block here)
     const presetButtonContainer = document.querySelector('#presetBar .preset-buttons');
     if (presetButtonContainer) {
        const presetButtons = presetButtonContainer.querySelectorAll('.preset-button[data-sequence]');
        if (presetButtons && presetButtons.length > 0) {
             presetButtons.forEach(button => {
                 // ... (rest of preset button listener setup) ...
                 const sequenceName = button.dataset.sequence;
                if (presetSequences.hasOwnProperty(sequenceName)) {
                    button.replaceWith(button.cloneNode(true));
                    const newButton = presetButtonContainer.querySelector(`.preset-button[data-sequence="${sequenceName}"]`);
                    if(newButton) {
                        newButton.addEventListener('click', () => { triggerPresetSequence(sequenceName); });
                    }
                } else {
                    console.warn(`Sequence "${sequenceName}" for button not found.`); button.style.opacity = '0.5'; button.style.cursor = 'not-allowed'; button.disabled = true;
                }
             });
            console.log(`Added listeners for ${presetButtons.length} preset buttons with defined sequences.`);
        } else { console.warn("No preset buttons found/defined in HTML to add listeners."); }
    } else { console.warn("Preset button container not found."); }

    if (enableRainCheckbox && rainDensityControl) {
        enableRainCheckbox.addEventListener('change', (e) => {
            settings.rainEnabled = e.target.checked;
            rainDensityControl.style.display = settings.rainEnabled ? 'block' : 'none';
             if (!settings.rainEnabled) raindrops = []; // Clear rain when disabled
        });
    } else { console.error("Rain checkbox or density control container not found."); }

    if (rainDensityInput && rainDensityValueSpan) {
        rainDensityInput.addEventListener('input', (e) => {
            settings.rainDensity = parseInt(e.target.value);
            rainDensityValueSpan.textContent = settings.rainDensity;
        });
    } else { console.error("Rain density slider or value span not found."); }


    if (enableSnowCheckbox && snowDensityControl) {
        enableSnowCheckbox.addEventListener('change', (e) => {
            settings.snowEnabled = e.target.checked;
            snowDensityControl.style.display = settings.snowEnabled ? 'block' : 'none';
             if (!settings.snowEnabled) snowflakes = []; // Clear snow when disabled
        });
     } else { console.error("Snow checkbox or density control container not found."); }


    if (snowDensityInput && snowDensityValueSpan) {
        snowDensityInput.addEventListener('input', (e) => {
            settings.snowDensity = parseInt(e.target.value);
            snowDensityValueSpan.textContent = settings.snowDensity;
        });
     } else { console.error("Snow density slider or value span not found."); }

    console.log("Event listeners setup complete."); // Debug end

} // End setupEventListeners
// --- Start Animation Function ---
function startAnimation() {
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
     ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    animationFrameId = requestAnimationFrame(loop);
}


// --- Initial Setup ---
// --- Initial Setup ---
function init() {
    console.log("Initializing Fireworks...");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    // --- Get Element References FIRST ---
    // Ensure elements are available if not declared globally before this point.
    // Your current global declarations at the top seem okay as init runs after DOMContentLoaded.
    const showSilhouetteInput = document.getElementById('showSilhouette');
    const showReflectionInput = document.getElementById('showReflection');

    // --- Update settings from initial DOM state ---
    // Read values from inputs and update the settings object
    if (particleCountInput) settings.particleCount = parseInt(particleCountInput.value);
    if (gravityInput) settings.gravity = parseFloat(gravityInput.value);
    if (particleFrictionInput) settings.particleFriction = parseFloat(particleFrictionInput.value);
    if (trailFadeInput) settings.trailFade = parseFloat(trailFadeInput.value);
    if (hueCyclingInput) settings.hueCycling = hueCyclingInput.checked;
    if (launchFrequencyInput) settings.launchFrequency = parseFloat(launchFrequencyInput.value);
    if (autoLaunchInput) settings.autoLaunch = autoLaunchInput.checked;
    if (rocketAccelerationInput) settings.rocketAcceleration = parseFloat(rocketAccelerationInput.value);
    if (rocketTrailLengthInput) settings.rocketTrailLength = parseInt(rocketTrailLengthInput.value);
    if (particleTrailLengthInput) settings.particleTrailLength = parseInt(particleTrailLengthInput.value);
    if (particleDecayInput) settings.particleDecay = parseFloat(particleDecayInput.value);

    // Get initial allowed types based on checked state *now*
    settings.allowedFireworkTypes = getSelectedFireworkTypes();

    // Update silhouette/reflection settings based on initial checkbox state
    if (showSilhouetteInput) settings.showSilhouette = showSilhouetteInput.checked;
    if (showReflectionInput) settings.showReflection = showReflectionInput.checked;
    if (cursorTrailInput) settings.cursorTrailEnabled = cursorTrailInput.checked; 
    if (cursorTrailDensityInput && cursorTrailDensityValueSpan){
        settings.cursorTrailDensity = parseInt(cursorTrailDensityInput.value);
        cursorTrailDensityValueSpan.textContent = settings.cursorTrailDensity;
    }
    if (cursorTrailHueInput && cursorTrailHueValueSpan){
        settings.cursorTrailHue = parseInt(cursorTrailHueInput.value);
        cursorTrailHueValueSpan.textContent = settings.cursorTrailHue;
        cursorTrailHueValueSpan.style.backgroundColor = `hsl(${settings.cursorTrailHue}, 100%, 50%)`;
    }
    //Weather setup
    if (enableRainCheckbox) settings.rainEnabled = enableRainCheckbox.checked;
    if (rainDensityInput) settings.rainDensity = parseInt(rainDensityInput.value);
    if (enableSnowCheckbox) settings.snowEnabled = enableSnowCheckbox.checked;
    if (snowDensityInput) settings.snowDensity = parseInt(snowDensityInput.value);
    if (rainDensityValueSpan) rainDensityValueSpan.textContent = settings.rainDensity;
     if (snowDensityValueSpan) snowDensityValueSpan.textContent = settings.snowDensity;
    // Update visibility of density controls based on initial checkbox state
    if (rainDensityControl) rainDensityControl.style.display = settings.rainEnabled ? 'block' : 'none';
    if (snowDensityControl) snowDensityControl.style.display = settings.snowEnabled ? 'block' : 'none';

    // Set initial text spans based on updated settings
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
    if (advancedControlsPanel) advancedControlsPanel.classList.add('hidden'); // Start hidden
    if (toggleAdvancedButton) toggleAdvancedButton.textContent = 'Show Advanced Settings';
    if (stepHueInput && stepHueValueSpan) { // Update planner hue display
        stepHueValueSpan.textContent = stepHueInput.value;
        stepHueValueSpan.style.backgroundColor = `hsl(${stepHueInput.value}, 100%, 50%)`;
    }
    if (plannerPanelContainer) plannerPanelContainer.classList.add('hidden'); // Start planner hidden
    if (settingsPanelContainer) { // Ensure free-play panel starts visible and not hidden by toggle
        settingsPanelContainer.classList.remove('hidden');
        settingsPanelContainer.classList.remove('hidden-by-toggle');
    }
    if (toggleSettingsButton) { // Set initial state for main toggle button
         toggleSettingsButton.innerHTML = '⚙️';
         toggleSettingsButton.title = "Hide Panel";
     }
    if (presetBar) presetBar.classList.remove('hidden'); // Start preset bar visible
    if (togglePresetBarButton) { // Set initial state for preset toggle button
         togglePresetBarButton.innerHTML = '▼';
         togglePresetBarButton.title = "Hide Preset Bar";
     }
    currentMode = 'free-play'; // Start in free-play mode
    if (modeToggleButton) modeToggleButton.textContent = 'Switch to Show Planner'; // Set initial mode button text

    // Setup listeners, render planner list, start animation loop
    setupEventListeners(); // Call function to attach ALL listeners (MUST be after settings are updated)
    renderShowList(); // Ensure planner list is rendered if needed
    startAnimation(); // Start the main loop
    console.log("Initialization Complete. Animation Started.");
    initializeSpeechRecognition(); // << ADD THIS LINE AT THE END

    console.log("Initialization Complete. Animation Started.");
}
// --- NEW HELPER FUNCTION for Spamming Tendrils ---
// --- ENHANCED HELPER FUNCTION for Spamming Tendrils ---
// --- ENHANCED HELPER FUNCTION for Spamming Tendrils/Effects ---
// --- ENSURE THIS IS YOUR launchTendrilWave function ---
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
// --- NEW: Drawing Functions ---
function drawSkyGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, settings.skyColorTop);
    gradient.addColorStop(0.8, settings.skyColorBottom); // Fade to black lower down
    gradient.addColorStop(1, settings.skyColorBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// --- Add near other Helper Functions ---
function spawnCursorTrailParticle() {
    if (!mouse.onCanvas) return;

    // *** Use settings for hue ***
    const hue = settings.cursorTrailHue + random(-15, 15);
    particles.push(new Particle(
        mouse.x + random(-3, 3),
        mouse.y + random(-3, 3),
        hue,
        { // Trail Particle Options - keep these fairly fixed for trail look
            speed: random(0.5, 1.5),
            gravityMultiplier: 0.1,
            decayMultiplier: random(4, 7), // Fast Fade
            brightness: random(60, 85),
            lineWidth: random(0.5, 1.5),
            coordinateCount: random(2, 4),
            particleType: 'cursorTrail'
        }
    ));
}
// --- MODIFY THIS FUNCTION ---
function drawReflectionOverlay(ctx) {
    const waterlineY = canvas.height * (settings.waterlineYPercent / 100);
    const gradient = ctx.createLinearGradient(0, waterlineY, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 10, 0.4)');  // Slight blue tint, starts semi-transparent
    gradient.addColorStop(0.5, 'rgba(0, 0, 10, 0.6)'); // Darker further down
    gradient.addColorStop(1, 'rgba(0, 0, 10, 0.7)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, waterlineY, canvas.width, canvas.height - waterlineY);

    // Optional: Add subtle ripple line?
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, waterlineY);
    ctx.lineTo(canvas.width, waterlineY);
    ctx.stroke();
}
// --- Trigger Preset Sequence ---
// --- Modify the triggerPresetSequence function ---
// --- REVISED triggerPresetSequence ---
// --- COMPLETE triggerPresetSequence Function ---
// --- REVISED triggerPresetSequence Function (Handles Tendrils + Your Other Calls) ---
// Replace your existing function with this entire block
function triggerPresetSequence(sequenceName, sequenceSteps = null) { // Allow passing steps directly for helpers
    // Prevent triggering if not in free play or a show/preset is already running
    if (currentMode !== 'free-play' || isPlayingShow) {
        console.log(`Preset trigger blocked: Mode (${currentMode}) is not free-play or Planner Show is playing (${isPlayingShow}).`);
        return;
    }

    // Use passed steps (from launchPathEffects) OR lookup from global object
    const sequence = sequenceSteps || presetSequences[sequenceName];

    // Check if sequence data exists
    if (!sequence || sequence.length === 0) {
        console.error(`ERROR: Sequence data for "${sequenceName}" not found or is empty!`);
        return;
    }
    console.log(`Processing sequence "${sequenceName}", ${sequence.length} steps.`);

    // Iterate through each step defined in the sequence array
    sequence.forEach((step, index) => {
        // Check if step object is valid
        if (!step) {
            console.warn(`Step ${index} in sequence "${sequenceName}" is null or undefined - skipping.`);
            return; // Continue to next step in forEach
        }

        // --- Handle Helper Function Calls ---
        if (step.call === 'launchInwardWave') {
            // console.log(`Processing step ${index}: Calling launchInwardWave`);
            launchInwardWave(
                step.startTime,           // Required
                step.duration,            // Required
                step.density,             // Required
                step.centerX ?? 50,       // Use default if missing
                step.centerY ?? 45,       // Use default if missing
                step.hueRange ?? [0, 360], // Default full spectrum
                step.effectType,          // Required (or helper default)
                step.minRadiusPercent ?? 70, // Default
                step.maxRadiusPercent ?? 110,// Default
                step.speedRange,          // Use helper default if missing
                step.spiralFactor,        // Use helper default if missing
                step.particleOptions      // Pass options object (can be empty)
            );
        }
        else if (step.call === 'launchLineEffect') {
            // console.log(`Processing step ${index}: Calling launchLineEffect`);
            launchLineEffect(
                step.startTime,           // Required
                step.duration,            // Required
                step.density,             // Required
                step.startX ?? 10,        // Default start X
                step.startY ?? 50,        // Default start Y
                step.endX ?? 90,          // Default end X
                step.endY ?? 50,          // Default end Y
                step.effectType ?? 'glitter', // Default type
                step.hue ?? random(0, 360), // Default random hue
                step.particleOptions      // Pass options object
            );
        }
        else if (step.call === 'drawDragonPath') {
             // console.log(`Processing step ${index}: Calling launchPathEffects`);
             launchPathEffects(step); // Pass the entire step object
        }
        // ----- ADDED BLOCK FOR TENDRIL WAVES -----
        else if (step.call === 'launchTendrilWave') {
            console.log(`Processing step ${index}: Calling launchTendrilWave (startTime: ${step.startTime})`);
            // Directly execute the launchTendrilWave function, passing parameters from the step.
            // The function itself handles defaults for optional parameters.
            launchTendrilWave(
                step.startTime,
                step.duration,
                step.density,
                step.hueRange,
                step.satRange,
                step.briRange,
                step.xRange,        // Pass xRange from the step
                step.yRange,        // Pass yRange from the step
                step.angleOverride, // Pass angleOverride from the step
                step.effectType,    // Pass effectType from the step
                step           // Pass the *entire step object* as the 'options' argument
                               // This allows launchTendrilWave to potentially use other step properties
                               // if needed when creating its 'finalOptions' for launchFirework.
            );
        }
        // ----- END OF ADDED BLOCK -----

        // --- Handle Standard Firework Launch ---
        else if (step.type && typeof step.time === 'number') { // Check for type and valid time
            setTimeout(() => {
                const targetX = canvas.width * (step.x / 100);
                const targetY = canvas.height * (step.y / 100);
                const startX = random(canvas.width * 0.4, canvas.width * 0.6);
                const startY = canvas.height;
                // Pass the whole step object as 'options'
                launchFirework(startX, startY, targetX, targetY, step.type, step.hue, step);
            }, step.time);
        }
        // --- Handle Invalid Steps ---
        else {
            console.warn(`Step ${index} in sequence "${sequenceName}" is invalid (missing type/time or unknown call structure):`, step);
        }
    }); // End sequence.forEach
} // End triggerPresetSequence
// --- End of REVISED triggerPresetSequence Function ---
function triggerFinale

(durationMs = 5000, intensity = 15) { // Duration in ms, Intensity = approx % chance per interval
    if (currentMode !== 'free-play' || isPlayingShow) {
        console.log("Finale trigger blocked: Mode is not free-play or show is playing.");
        return;
    }
    if (settings.allowedFireworkTypes.length === 0) {
        console.log("Finale trigger blocked: No firework types enabled.");
        // Maybe flash the checkboxes briefly? Or just do nothing.
        return;
    }

    console.log(`--- TRIGGERING FINALE (Duration: ${durationMs}ms, Intensity: ${intensity}) ---`);

    const endTime = performance.now() + durationMs;
    const interval = 50; // Check to launch roughly every 50ms (adjust for more/less chaos)
    let launchIntervalId = null;

    function finaleLaunchCheck() {
        const now = performance.now();
        if (now >= endTime) {
            clearInterval(launchIntervalId); // Stop launching after duration
            console.log("--- FINALE End ---");
            return;
        }

        // Chance to launch based on intensity
        if (random(0, 100) < intensity) {
            // Pick a random ALLOWED type
            const allowedTypes = settings.allowedFireworkTypes; // Get current list
            const type = allowedTypes[Math.floor(random(0, allowedTypes.length))];

            // Pick a random position (mostly upper half)
            const targetX = random(10, 90); // Avoid extreme edges maybe
            const targetY = random(10, 60); // Upper ~60% of screen

            // Use a random hue or the cycling hue? Let's use random for chaos
            const hue = random(0, 360);

            // Launch!
            launchFirework(
                random(canvas.width * 0.4, canvas.width * 0.6), canvas.height, // Start from bottom center variance
                canvas.width * (targetX / 100),
                canvas.height * (targetY / 100),
                type,
                hue
                // Not passing sequence options here, using defaults for the types
            );
        }
    }

    // Start launching checks at intervals
    launchIntervalId = setInterval(finaleLaunchCheck, interval);
}

// --- DOM Ready Check ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}