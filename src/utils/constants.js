// Background image dimensions (original)
export const BG_WIDTH = 793;
export const BG_HEIGHT = 1983;

// Grid layout: 5 columns x 10 rows = 50 plots
export const GRID_COLS = 5;
export const GRID_ROWS = 10;
export const TOTAL_PLOTS = GRID_COLS * GRID_ROWS;

// Plot positions as percentages of the background image
// Measured from actual pixel analysis of background.png rendered at 500x1250
const COL_CENTERS = [17.0, 34.8, 52.8, 71.0, 88.8];
const ROW_CENTERS = [9.8, 17.9, 26.1, 34.2, 42.4, 50.6, 58.7, 66.9, 74.9, 83.1];

// Plot size as percentage of background — sized to fully cover the grid cell
export const PLOT_WIDTH_PCT = 17.8;
export const PLOT_HEIGHT_PCT = 8.1;

// Generate all 50 plot positions
export const PLOT_POSITIONS = [];
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    PLOT_POSITIONS.push({
      id: `plot-${row}-${col}`,
      index: row * GRID_COLS + col,
      x: COL_CENTERS[col],
      y: ROW_CENTERS[row],
    });
  }
}

// Initial unlocked plots
export const INITIAL_UNLOCKED = 5;

// Growth stage thresholds (totalWatered needed)
export const STAGE_THRESHOLDS = [0, 3, 7, 14, 30];

// Degradation thresholds (missed days)
export const WILTED_DAYS = 7;
export const DEAD_DAYS = 14;

// Streak milestones for unlocking plots
export const STREAK_REWARDS = [
  { streak: 7, plots: 1 },
  { streak: 14, plots: 2 },
  { streak: 30, plots: 3 },
];

// Max habit name length
export const MAX_HABIT_NAME = 20;

// Preset habits
export const PRESET_HABITS = [
  'Drink water',
  'Exercise',
  'Read',
  'Meditate',
  'Sleep 8h',
  'No sugar',
  'Journal',
  'Walk',
];

// Plant image mapping
export const PLANT_IMAGES = {
  healthy: [
    '/assets/seed-stage.png',
    '/assets/fresh-sprout-stage.png',
    '/assets/fresh-small-stage.png',
    '/assets/fresh-adult-stage.png',
    '/assets/fresh-flower-stage.png',
  ],
  wilted: [
    '/assets/seed-stage.png',
    '/assets/dry-sprout-stage.png',
    '/assets/dry-small-stage.png',
    '/assets/dry-adult-stage.png',
    '/assets/dry-flower-stage.png',
  ],
};
