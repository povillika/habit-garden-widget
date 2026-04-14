import Plot from './Plot';
import { PLOT_POSITIONS } from '../utils/constants';
import './Garden.css';

export default function Garden({ plots, plants, habits }) {
  return (
    <div className="garden">
      <div className="garden-inner">
        <img
          className="garden-bg"
          src="/assets/background.png"
          alt="Garden"
          draggable={false}
        />
        <div className="garden-plots">
          {PLOT_POSITIONS.map((pos) => {
            const plot = plots[pos.index];
            if (!plot || !plot.unlocked) return null;

            const plant = plot.habitId
              ? plants.find((p) => p.habitId === plot.habitId)
              : null;
            const habit = plot.habitId
              ? habits.find((h) => h.id === plot.habitId)
              : null;

            return (
              <Plot
                key={pos.id}
                position={pos}
                plot={plot}
                plant={plant}
                habit={habit}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
