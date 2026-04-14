import { useState, useCallback, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { getToday, daysBetween, isToday } from '../utils/dateUtils';
import {
  TOTAL_PLOTS,
  INITIAL_UNLOCKED,
  STAGE_THRESHOLDS,
  WILTED_DAYS,
  DEAD_DAYS,
  STREAK_REWARDS,
  PRESET_HABITS,
} from '../utils/constants';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createInitialState() {
  const plots = Array.from({ length: TOTAL_PLOTS }, (_, i) => ({
    id: `plot-${Math.floor(i / 5)}-${i % 5}`,
    unlocked: i < INITIAL_UNLOCKED,
    habitId: null,
  }));

  const habits = PRESET_HABITS.map((name) => ({
    id: generateId(),
    name,
    planted: false,
    plotIndex: null,
  }));

  return {
    habits,
    plants: [],
    plots,
    lastVisitDate: getToday(),
    claimedMilestones: [],
  };
}

function applyDegradation(state) {
  const today = getToday();
  const lastVisit = state.lastVisitDate;
  if (!lastVisit || lastVisit === today) return state;

  const missedSinceVisit = daysBetween(lastVisit, today);
  if (missedSinceVisit <= 0) return state;

  let { habits, plants, plots } = structuredClone(state);

  const plantsToRemove = [];

  plants = plants.map((plant) => {
    // Only count missed days from last watered, not last visit
    const daysSinceWater = plant.lastWateredDate
      ? daysBetween(plant.lastWateredDate, today)
      : missedSinceVisit;

    const missedDays = Math.max(0, daysSinceWater - 1); // watering day itself doesn't count

    if (missedDays >= DEAD_DAYS) {
      plantsToRemove.push(plant.habitId);
      return plant;
    }

    return {
      ...plant,
      missedDays,
      status: missedDays >= WILTED_DAYS ? 'wilted' : plant.status,
    };
  });

  // Remove dead plants
  if (plantsToRemove.length > 0) {
    plants = plants.filter((p) => !plantsToRemove.includes(p.habitId));
    plots = plots.map((plot) =>
      plantsToRemove.includes(plot.habitId) ? { ...plot, habitId: null } : plot
    );
    habits = habits.map((h) =>
      plantsToRemove.includes(h.id) ? { ...h, planted: false, plotIndex: null } : h
    );
  }

  return { ...state, habits, plants, plots, lastVisitDate: today };
}

export function useGameState() {
  const [state, setState] = useState(() => {
    const saved = loadState();
    if (saved) {
      return applyDegradation(saved);
    }
    return createInitialState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addHabit = useCallback((name) => {
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, { id: generateId(), name, planted: false, plotIndex: null }],
    }));
  }, []);

  const plantHabit = useCallback((habitId) => {
    setState((prev) => {
      const freeIndex = prev.plots.findIndex((p) => p.unlocked && !p.habitId);
      if (freeIndex === -1) return prev;

      const habits = prev.habits.map((h) =>
        h.id === habitId ? { ...h, planted: true, plotIndex: freeIndex } : h
      );

      const plots = prev.plots.map((p, i) =>
        i === freeIndex ? { ...p, habitId } : p
      );

      const plants = [
        ...prev.plants,
        {
          habitId,
          stage: 0,
          totalWatered: 0,
          lastWateredDate: null,
          streak: 0,
          missedDays: 0,
          status: 'healthy',
        },
      ];

      return { ...prev, habits, plots, plants };
    });
  }, []);

  const waterHabit = useCallback((habitId) => {
    setState((prev) => {
      const plant = prev.plants.find((p) => p.habitId === habitId);
      if (!plant || isToday(plant.lastWateredDate)) return prev;

      const today = getToday();
      const wasWilted = plant.status === 'wilted';
      const newStreak = wasWilted ? 1 : plant.streak + 1;
      const newTotalWatered = plant.totalWatered + 1;

      // Determine new stage
      let newStage = plant.stage;
      for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newTotalWatered >= STAGE_THRESHOLDS[i]) {
          newStage = i;
          break;
        }
      }

      const plants = prev.plants.map((p) =>
        p.habitId === habitId
          ? {
              ...p,
              totalWatered: newTotalWatered,
              lastWateredDate: today,
              streak: newStreak,
              missedDays: 0,
              status: 'healthy',
              stage: newStage,
            }
          : p
      );

      // Check for plot unlocks
      let { plots, claimedMilestones = [] } = prev;
      for (const reward of STREAK_REWARDS) {
        const key = `${habitId}-${reward.streak}`;
        if (newStreak >= reward.streak && !claimedMilestones.includes(key)) {
          claimedMilestones = [...claimedMilestones, key];
          let toUnlock = reward.plots;
          plots = plots.map((p) => {
            if (!p.unlocked && toUnlock > 0) {
              toUnlock--;
              return { ...p, unlocked: true };
            }
            return p;
          });
        }
      }

      return { ...prev, plants, plots, claimedMilestones, lastVisitDate: today };
    });
  }, []);

  const removeHabit = useCallback((habitId) => {
    setState((prev) => {
      const habits = prev.habits.map((h) =>
        h.id === habitId ? { ...h, planted: false, plotIndex: null } : h
      );
      const plants = prev.plants.filter((p) => p.habitId !== habitId);
      const plots = prev.plots.map((p) =>
        p.habitId === habitId ? { ...p, habitId: null } : p
      );
      return { ...prev, habits, plants, plots };
    });
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setState((prev) => {
      const habits = prev.habits.filter((h) => h.id !== habitId);
      const plants = prev.plants.filter((p) => p.habitId !== habitId);
      const plots = prev.plots.map((p) =>
        p.habitId === habitId ? { ...p, habitId: null } : p
      );
      return { ...prev, habits, plants, plots };
    });
  }, []);

  return {
    state,
    addHabit,
    plantHabit,
    waterHabit,
    removeHabit,
    deleteHabit,
  };
}
