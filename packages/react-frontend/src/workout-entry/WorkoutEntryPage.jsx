import React, { useState } from "react";
import styles from "./workout-entry.module.css";
import Background from "../components/Background";
/*
  TODOs:
  - submit button must be disabled unless weight or cardio information has been
    entered
  - 
*/
function WorkoutEntryPage() {
  const [preset, setPreset] = useState("");
  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [sets, setSets] = useState([]);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const handleAddSet = () => {
    if (reps > 0 && weight > 0) {
      setSets([...sets, { reps, weight }]);
      setReps("");
      setWeight("");
    }
  };

  const handleSubmit = () => {
    console.log({
      preset,
      name,
      workoutType,
      sets,
      distance,
      time,
    });
    resetForm();
  };

  const resetForm = () => {
    setPreset("");
    setName("");
    setWorkoutType("");
    setSets([]);
    setReps("");
    setWeight("");
    setDistance("");
    setTime("");
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const renderHeader = () => (
    <div>
      <h2 className={styles.header}>Log Workout</h2>
    </div>
  );

  const renderPresetSelector = () => (
    <div>
      <label className={styles.label}>Choose Preset:</label>
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value)}
        className={styles.select}
      >
        <option value="">Select a preset</option>
        {/* Add preset options here */}
      </select>
    </div>
  );

  const renderWorkoutTypeSelector = () => (
    <div>
      <label className={styles.label}>Type:</label>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            value="Weights"
            checked={workoutType === "Weights"}
            onChange={() => setWorkoutType("Weights")}
          />
          Weights
        </label>
        <label>
          <input
            type="radio"
            value="Cardio"
            checked={workoutType === "Cardio"}
            onChange={() => setWorkoutType("Cardio")}
          />
          Cardio
        </label>
      </div>
    </div>
  );

  const renderWeightsInput = () => (
    <div>
      <h4>Sets</h4>
      <label className={styles.label}>Reps:</label>
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className={styles.input}
      />
      <label className={styles.label}>Weight:</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleAddSet} className={styles.button}>
        Add Set
      </button>
      <ul className={styles.setList}>
        {sets.map((set, index) => (
          <li key={index} className={styles.setItem}>
            Reps: {set.reps}, Weight: {set.weight}
            <button
              onClick={() => handleRemoveSet(index)}
              className={styles.removeButton}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCardioInput = () => (
    <div>
      <label className={styles.label}>Distance:</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className={styles.input}
      />
      <label className={styles.label}>Time:</label>
      <input
        type="number"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className={styles.input}
      />
    </div>
  );

  const renderSubmitButton = () => (
    <button onClick={handleSubmit} className={styles.button}>
      Submit
    </button>
  );

  return (
    <div>
      <Background />
      <div className={styles.container}>
        {renderHeader()}
        {renderPresetSelector()}
        <hr />
        <h3 className={styles.header}>Add New</h3>
        <div>
          <label className={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          {renderWorkoutTypeSelector()}
          {workoutType === "Weights" && renderWeightsInput()}
          {workoutType === "Cardio" && renderCardioInput()}
          {renderSubmitButton()}
        </div>
      </div>
    </div>
  );
}

export default WorkoutEntryPage;
