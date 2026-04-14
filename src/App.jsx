import Garden from './components/Garden';
import Sidebar from './components/Sidebar';
import { useGameState } from './hooks/useGameState';
import './App.css';

export default function App() {
  const { state, addHabit, plantHabit, waterHabit, removeHabit, deleteHabit } = useGameState();

  return (
    <div className="app">
      <Garden
        plots={state.plots}
        plants={state.plants}
        habits={state.habits}
      />
      <Sidebar
        habits={state.habits}
        plants={state.plants}
        plots={state.plots}
        onAdd={addHabit}
        onPlant={plantHabit}
        onWater={waterHabit}
        onRemove={removeHabit}
        onDelete={deleteHabit}
      />
    </div>
  );
}
