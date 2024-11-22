import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./workout-entry.module.css";
import Background from "../components/Background";
import HomeIcon from "../assets/home.svg";

/* TODO:
  - make preset creation optional rather than automatic (checkbox style)
  - nameless workouts should not be made into presets and should disable the 
  create preset checkbox.
  - option to remove a preset in the preset details page
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
  const [createPreset, setCreatePreset] = useState(false);

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
    const newWorkout = {
      name: name || "Unnamed Workout",
      workoutType,
      sets,
      distance,
      time,
    };

    if (createPreset && name) {
      const existingIndex = presets.findIndex(
        (p) => p.name === newWorkout.name,
      );

      if (existingIndex !== -1) {
        if (
          window.confirm("A preset with this name already exists. Overwrite?")
        ) {
          const updatedPresets = [...presets];
          updatedPresets[existingIndex] = newWorkout;
          setPresets(updatedPresets);
        }
      } else {
        setPresets([...presets, newWorkout]);
      }
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

  const handleRemovePreset = (name) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      setPresets(presets.filter((preset) => preset.name !== name));
      setPreset("");
      setIsEditing(true);
    }
  };

  const renderPresetDetails = () => {
    const selectedPreset = presets.find((p) => p.name === preset);

    if (!selectedPreset) return null;

    return (
      <div>
        <h3 className={styles.header}>Preset Details</h3>
        <p data-testid="preset-name">
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
          <button onClick={handleSubmit} className={styles.button}>
            Submit
          </button>
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
          <button
            onClick={() => handleRemovePreset(selectedPreset.name)}
            className={`${styles.button} ${styles.removeButton}`}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const renderPresetSelector = () => (
    <div>
      <label className={styles.label} htmlFor="preset-selector">
        Choose Preset:
      </label>
      <select
        id="preset-selector"
        value={preset}
        onChange={(e) => {
          const selectedValue = e.target.value;
          setPreset(selectedValue);

          if (selectedValue === "") {
            setIsEditing(true);
            resetForm();
          } else {
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
      <label className={styles.label} htmlFor="radioGroup">
        Type:
      </label>
      <div id="radioGroup" className={styles.radioGroup}>
        <label htmlFor="weights-radio">
          <input
            id="weights-radio"
            type="radio"
            value="Weights"
            checked={workoutType === "Weights"}
            onChange={() => setWorkoutType("Weights")}
          />
          Weights
        </label>
        <label htmlFor="cardio-radio">
          <input
            id="cardio-radio"
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
        <label className={styles.label} htmlFor="reps-input">
          Reps:
        </label>
        <input
          id="reps-input"
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className={styles.input}
        />
        <label className={styles.label} htmlFor="weight-input">
          Weight:
        </label>
        <input
          id="weight-input"
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
            <li key={index} className={styles.listItem}>
              <div className={styles.setItem}>
                <div>
                  Reps: {set.reps}, Weight: {set.weight}
                </div>
                <button
                  onClick={() => handleRemoveSet(index)}
                  className={styles.removeButton}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCardioInput = () => (
    <div>
      <label className={styles.label} htmlFor="distance-input">
        Distance:
      </label>
      <input
        id="distance-input"
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className={styles.input}
      />
      <label className={styles.label} htmlFor="time-input">
        Time:
      </label>
      <input
        id="time-input"
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

  // TODO: add a button on the top right of the container to return home
  // use ../assets/home.svg as the button's picture
  return (
    <div className="wrapper">
      <Background />
      <div className="container">
        <div className={styles.topBar}>
          <Link to="/home">
            <img src={HomeIcon} alt="Home" className={styles.homeIcon} />
          </Link>
        </div>
        <h2 className={styles.header}>Log Workout</h2>
        {renderPresetSelector()}
        <hr />
        {isEditing ? (
          <div>
            <h3 className={styles.header}>Add New</h3>
            <label htmlFor="nameInput" className={styles.label}>
              Name:
            </label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <label
              htmlFor="presetCheckbox"
              className={styles.checkboxContainer}
            >
              <input
                id="presetCheckbox"
                type="checkbox"
                checked={createPreset}
                onChange={(e) => setCreatePreset(e.target.checked)}
                disabled={!name}
              />
              Save as Preset
            </label>
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
