import HabitItem from './HabitItem';
import AddHabitForm from './AddHabitForm';
import { isToday } from '../utils/dateUtils';
import './Sidebar.css';

export default function Sidebar({ habits, plants, plots, onAdd, onPlant, onWater, onRemove, onDelete }) {
  const planted = habits.filter((h) => h.planted);
  const unplanted = habits.filter((h) => !h.planted);

  const toWaterCount = plants.filter((p) => !isToday(p.lastWateredDate)).length;

  const unlockedCount = plots.filter((p) => p.unlocked).length;
  const canAddMore = habits.length < unlockedCount;

  // Next unlock milestone
  const nextUnlockStreak = canAddMore ? null : (() => {
    const maxStreak = Math.max(0, ...plants.map((p) => p.streak));
    const milestones = [7, 14, 30];
    return milestones.find((m) => m > maxStreak) || null;
  })();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Habit Garden</h2>

      {toWaterCount > 0 && (
        <div className="water-prompt">
          🌿 {toWaterCount} plant{toWaterCount > 1 ? 's' : ''} to water
        </div>
      )}

      {planted.length > 0 && toWaterCount === 0 && (
        <div className="water-prompt done">
          ✨ All watered today!
        </div>
      )}

      {planted.length > 0 && (
        <section className="sidebar-section">
          <h3 className="section-label">Planted</h3>
          <div className="habit-list">
            {planted.map((h) => (
              <HabitItem
                key={h.id}
                habit={h}
                plant={plants.find((p) => p.habitId === h.id)}
                onPlant={onPlant}
                onWater={onWater}
                onRemove={onRemove}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      <section className="sidebar-section">
        <h3 className="section-label">Seeds</h3>
        <div className="habit-list">
          {unplanted.map((h) => (
            <HabitItem
              key={h.id}
              habit={h}
              plant={null}
              onPlant={onPlant}
              onWater={onWater}
              onRemove={onRemove}
              onDelete={onDelete}
            />
          ))}
        </div>
        <AddHabitForm
          onAdd={onAdd}
          canAdd={canAddMore}
          nextUnlockStreak={nextUnlockStreak}
        />
      </section>
    </aside>
  );
}
