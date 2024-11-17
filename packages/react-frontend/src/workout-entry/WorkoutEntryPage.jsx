import React, { useState, useEffect } from "react";
import styles from "./workout-entry.module.css";
import Background from "../components/Background";

/* TODO:
  - make preset creation optional rather than automatic
  - option to remove presets
  - grab presets ("workouts") from the database
*/

function WorkoutEntryPage() {
  const [preset, setPreset] = useState("");
  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState("Weights");
  const [sets, setSets] = useState([]);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [presets, setPresets] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  // Load presets from localStorage on component mount
  useEffect(() => {
    const savedPresets = JSON.parse(localStorage.getItem("presets")) || [];
    setPresets(savedPresets);
  }, []);

  // Save presets to localStorage whenever presets change
  useEffect(() => {
    localStorage.setItem("presets", JSON.stringify(presets));
  }, [presets]);

  const handleAddSet = () => {
    if (reps > 0 && weight > 0) {
      setSets([...sets, { reps, weight }]);
      setReps("");
      setWeight("");
    }
  };

  const handleSubmit = () => {
    const newPreset = {
      name: name || "Unnamed Workout",
      workoutType,
      sets,
      distance,
      time,
    };

    const existingIndex = presets.findIndex((p) => p.name === newPreset.name);

    // Check if the submitted workout is identical to an existing preset
    if (
      existingIndex !== -1 &&
      JSON.stringify(presets[existingIndex]) === JSON.stringify(newPreset)
    ) {
      console.log(
        "Workout is identical to an existing preset. Nothing happens.",
      );
      return;
    }

    if (existingIndex !== -1) {
      if (
        window.confirm("A preset with this name already exists. Overwrite?")
      ) {
        const updatedPresets = [...presets];
        updatedPresets[existingIndex] = newPreset;
        setPresets(updatedPresets);
      }
    } else {
      setPresets([...presets, newPreset]);
    }

    resetForm();
    setIsEditing(true);
  };

  const resetForm = () => {
    setPreset("");
    setName("");
    setWorkoutType("Weights");
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

  const renderPresetDetails = () => {
    const selectedPreset = presets.find((p) => p.name === preset);

    if (!selectedPreset) return null;

    return (
      <div>
        <h3 className={styles.header}>Preset Details</h3>
        <p>
          <strong>Name:</strong> {selectedPreset.name}
        </p>
        <p>
          <strong>Type:</strong> {selectedPreset.workoutType}
        </p>
        {selectedPreset.workoutType === "Weights" && (
          <ul>
            {selectedPreset.sets.map((set, index) => (
              <li key={index}>
                Reps: {set.reps}, Weight: {set.weight}
              </li>
            ))}
          </ul>
        )}
        {selectedPreset.workoutType === "Cardio" && (
          <p>
            Distance: {selectedPreset.distance}, Time: {selectedPreset.time}
          </p>
        )}
        <div className={styles["buttons-container"]}>
          <button
            onClick={() => {
              setIsEditing(true);
              setName(selectedPreset.name);
              setWorkoutType(selectedPreset.workoutType);
              setSets(selectedPreset.sets || []);
              setDistance(selectedPreset.distance || "");
              setTime(selectedPreset.time || "");
            }}
            className={styles.button}
          >
            Edit
          </button>
          {/* Add the submit button here */}
          <button onClick={handleSubmit} className={styles.button}>
            Submit
          </button>
        </div>
      </div>
    );
  };

  const renderPresetSelector = () => (
    <div>
      <label className={styles.label}>Choose Preset:</label>
      <select
        value={preset}
        onChange={(e) => {
          const selectedValue = e.target.value;
          setPreset(selectedValue);

          if (selectedValue === "") {
            // If "No Preset" is selected, switch back to "Add New" mode
            setIsEditing(true);
            resetForm();
          } else {
            // If a preset is selected, show its details
            setIsEditing(false);
          }
        }}
        className={styles.select}
      >
        <option value="">No Preset (Add New)</option>
        {presets.map((p, index) => (
          <option key={index} value={p.name}>
            {p.name}
          </option>
        ))}
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

  const renderWeightsInput = () => {
    const isAddSetDisabled = !(reps > 0 && weight > 0);

    return (
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
        <button
          onClick={handleAddSet}
          className={styles.button}
          disabled={isAddSetDisabled}
        >
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
  };

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

  const renderSubmitButton = () => {
    const isDisabled =
      (isEditing &&
        ((workoutType === "Weights" && sets.length === 0) ||
          (workoutType === "Cardio" && (!distance || !time)))) ||
      (!isEditing && !preset);

    return (
      <button
        onClick={handleSubmit}
        className={styles.button}
        disabled={isDisabled}
      >
        Submit
      </button>
    );
  };

  return (
    <div className="wrapper">
      <Background />
      <div className="container">
        <h2 className={styles.header}>Log Workout</h2>
        {renderPresetSelector()}
        <hr />
        {isEditing ? (
          <div>
            <h3 className={styles.header}>Add New</h3>
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
        ) : (
          renderPresetDetails()
        )}
      </div>
    </div>
  );
}

export default WorkoutEntryPage;
