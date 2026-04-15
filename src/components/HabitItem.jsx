import { isToday } from '../utils/dateUtils';
import { BASE } from '../utils/constants';
import './HabitItem.css';

export default function HabitItem({ habit, plant, onPlant, onWater, onRemove, onDelete }) {
  const isPlanted = habit.planted;
  const wateredToday = plant && isToday(plant.lastWateredDate);

  return (
    <div className={`habit-item ${isPlanted ? 'planted' : ''} ${plant?.status === 'wilted' ? 'wilted' : ''}`}>
      <span className="habit-name">{habit.name}</span>
      <div className="habit-actions">
        {!isPlanted ? (
          <>
            <button className="habit-btn plant-btn" onClick={() => onPlant(habit.id)} title="Plant">
              <img src={`${BASE}assets/plant-icon.png`} alt="Plant" />
            </button>
            <button className="habit-btn delete-btn" onClick={() => onDelete(habit.id)} title="Delete">
              <img src={`${BASE}assets/trashbin_icon.png`} alt="Delete" />
            </button>
          </>
        ) : (
          <>
            <button
              className={`habit-btn water-btn ${wateredToday ? 'disabled' : ''}`}
              onClick={() => onWater(habit.id)}
              disabled={wateredToday}
              title={wateredToday ? 'Already watered today' : 'Water'}
            >
              <img src={`${BASE}assets/watering_can_icon.png`} alt="Water" />
            </button>
            <button className="habit-btn remove-btn" onClick={() => onRemove(habit.id)} title="Remove from garden">
              <img src={`${BASE}assets/trashbin_icon.png`} alt="Remove" />
            </button>
          </>
        )}
      </div>
      {isPlanted && plant && (
        <div className="habit-stats">
          <span className="habit-streak">streak: {plant.streak}</span>
          <span className="habit-stage">stage: {plant.stage}/4</span>
        </div>
      )}
    </div>
  );
}
