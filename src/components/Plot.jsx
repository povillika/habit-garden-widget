import { PLANT_IMAGES, PLOT_WIDTH_PCT, PLOT_HEIGHT_PCT, BASE } from '../utils/constants';
import { isToday } from '../utils/dateUtils';
import { useMemo } from 'react';
import './Plot.css';

// Plant height per stage (% of plot height)
// Separate values for healthy and wilted because some sprites have different
// image dimensions (portrait vs landscape) requiring different scales
const STAGE_HEIGHT = {
  healthy: [112, 200, 158, 180, 180],
  wilted:  [112, 135, 158, 180, 180],
};

// Horizontal offset correction per stage (% of plot width)
const STAGE_OFFSET_X = {
  healthy: [0, 0, 11, 0, 4],
  wilted:  [0, 0, 11, 0, 4],
};

export default function Plot({ position, plot, plant, habit }) {
  if (!plot.unlocked) return null;

  const plotImg = plant && isToday(plant.lastWateredDate)
    ? `${BASE}assets/garden_plot_wet.png`
    : `${BASE}assets/garden_plot_dry.png`;

  const plantImg = plant
    ? PLANT_IMAGES[plant.status === 'wilted' ? 'wilted' : 'healthy'][plant.stage]
    : null;

  const statusKey = plant?.status === 'wilted' ? 'wilted' : 'healthy';
  const plantHeight = plant ? STAGE_HEIGHT[statusKey][plant.stage] : 158;
  const offsetX = plant ? STAGE_OFFSET_X[statusKey][plant.stage] : 0;
  const needsWater = plant && !isToday(plant.lastWateredDate);

  // Unique sway duration per plot so they don't sync
  const swayDuration = useMemo(() => {
    return 3.5 + (position.index % 7) * 0.4;
  }, [position.index]);

  return (
    <div
      className="plot"
      style={{
        left: `${position.x - PLOT_WIDTH_PCT / 2}%`,
        top: `${position.y - PLOT_HEIGHT_PCT / 2}%`,
        width: `${PLOT_WIDTH_PCT}%`,
        height: `${PLOT_HEIGHT_PCT}%`,
      }}
    >
      <img className="plot-soil" src={plotImg} alt="" draggable={false} />
      {plantImg && (
        <>
          <img
            className={`plot-plant ${needsWater ? 'needs-water' : ''}`}
            src={plantImg}
            alt=""
            draggable={false}
            style={{
              height: `${plantHeight}%`,
              width: 'auto',
              marginLeft: `${offsetX}%`,
              '--sway-duration': `${swayDuration}s`,
            }}
          />
          {habit && (
            <span className={`plot-label ${plant.status === 'wilted' ? 'wilted' : ''}`}>
              {habit.name}
            </span>
          )}
        </>
      )}
    </div>
  );
}
