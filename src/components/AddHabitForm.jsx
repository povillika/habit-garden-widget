import { useState } from 'react';
import { MAX_HABIT_NAME } from '../utils/constants';
import './AddHabitForm.css';

export default function AddHabitForm({ onAdd, canAdd, nextUnlockStreak }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !canAdd) return;
    onAdd(trimmed);
    setName('');
  };

  return (
    <div className="add-habit-wrapper">
      {canAdd ? (
        <form className="add-habit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New habit..."
            maxLength={MAX_HABIT_NAME}
            className="add-habit-input"
          />
          <button type="submit" className="add-habit-btn" disabled={!name.trim()}>
            +
          </button>
        </form>
      ) : (
        <div className="add-habit-limit">
          🔒 All plots are taken.
          {nextUnlockStreak && (
            <span> Reach a {nextUnlockStreak}-day streak to unlock more!</span>
          )}
        </div>
      )}
    </div>
  );
}
