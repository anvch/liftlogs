import React, { useState, useEffect } from "react"; // eslint-disable-line no-unused-vars
import { Link } from "react-router-dom";
import styles from "./workout-entry.module.css";
import Background from "../components/Background";
import HomeIcon from "../assets/home.svg";
import { WorkoutService } from "../services/workout.service";

function WorkoutEntryPage() {
  const weightType = "weights";
  const cardioType = "cardio";
  const [preset, setPreset] = useState("");
  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState(weightType);
  const [sets, setSets] = useState([]);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [presets, setPresets] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [createPreset, setCreatePreset] = useState(false);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await WorkoutService.getPresets();
        setPresets(data);
      } catch (error) {
        console.error("Error fetching presets:", error);
      }
    };

    fetchPresets();
  }, []);

  useEffect(() => {
    if (!name) {
      setCreatePreset(false);
    }
  }, [name]);

  const handleAddSet = () => {
    if (reps > 0 && weight > 0) {
      setSets([...sets, { reps, weight }]);
      setReps("");
      setWeight("");
    }
  };

  const handleSubmit = async () => {
    try {
      let workoutId;

      // Construct the newWorkoutData object
      const newWorkoutData = {
        name: name || "Unnamed Workout",
        workoutType: workoutType.toLowerCase(),
        dateCreated: new Date().toISOString().split("T")[0],
        isPreset: createPreset,
      };

      // some data depends on the type of workout
      if (workoutType === weightType) {
        newWorkoutData.sets = sets;
      } else if (workoutType === cardioType) {
        newWorkoutData.distance = parseFloat(distance);
        newWorkoutData.time = parseFloat(time);
      }

      console.log(newWorkoutData);
      // now to handle what happens to the data when submitting.
      // we are either using an unedited preset, modifying a preset,
      // or making a brand new workout
      if (preset) {
        // we are using a preset
        const selectedPreset = presets.find((p) => p.workoutId === preset);
        if (!selectedPreset) {
          console.error("Selected preset not found");
          return;
        }
        // get the preset's workoutID
        workoutId = selectedPreset.workoutId;
        if (isEditing && createPreset) {
          // modifying a preset
          if (
            window.confirm(
              "You are making changes to an existing preset. Overwrite?",
            )
          ) {
            await WorkoutService.updateWorkout(workoutId, newWorkoutData);
          }
        } else if (isEditing) {
          // not saving as a preset, means just make a new one
          const newWorkout = await WorkoutService.createWorkout(newWorkoutData);
          workoutId = newWorkout.workoutId;
        }
      } else {
        // we are not using a preset
        const newWorkout = await WorkoutService.createWorkout(newWorkoutData);
        workoutId = newWorkout.workoutId;
      }

      // finally, no matter what happened add to the calendar
      const [year, month, day] = date
        .split("-")
        .map((val) => parseInt(val, 10));
      await WorkoutService.addWorkoutsToCalendar(year, month, day, [workoutId]);

      resetForm();
      setIsEditing(true);

      if (createPreset) {
        const updatedPresets = await WorkoutService.getPresets();
        setPresets(updatedPresets);
      }
    } catch (error) {
      console.error("Error submitting workout:", error);
    }
  };

  const resetForm = () => {
    setPreset("");
    setName("");
    setWorkoutType(weightType);
    setSets([]);
    setReps("");
    setWeight("");
    setDistance("");
    setTime("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleRemovePreset = async (workoutId) => {
    if (window.confirm("Are you sure you want to delete this preset?")) {
      try {
        await WorkoutService.updateWorkout(workoutId, { isPreset: false });

        const updatedPresets = await WorkoutService.getPresets();
        setPresets(updatedPresets);
        setPreset("");
        setIsEditing(true);
      } catch (error) {
        console.error("Error removing preset:", error);
      }
    }
  };

  const renderDateSelector = () => (
    <div>
      <label htmlFor="date-input" className={styles.label}>
        Date:
      </label>
      <input
        id="date-input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />
    </div>
  );

  const renderPresetDetails = () => {
    const selectedPreset = presets.find((p) => p.workoutId === preset);

    if (!selectedPreset) return null;

    return (
      <div>
        <h3 className={styles.header}>Preset Details</h3>
        <p data-testid="preset-name">
          <strong>Name:</strong> {selectedPreset.name}
        </p>
        {renderDateSelector()}
        <p>
          <strong>Type:</strong> {selectedPreset.workoutType}
        </p>
        {selectedPreset.workoutType === weightType && (
          <ul>
            {selectedPreset.sets.map((set, index) => (
              <li key={index}>
                Reps: {set.reps}, Weight: {set.weight}
              </li>
            ))}
          </ul>
        )}
        {selectedPreset.workoutType === cardioType && (
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
              setCreatePreset(true);
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
            onClick={() => handleRemovePreset(selectedPreset.workoutId)}
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
            const selectedPreset = presets.find(
              (p) => p.workoutId === selectedValue,
            );
            if (selectedPreset) {
              setIsEditing(false);
              setCreatePreset(true);
              setName(selectedPreset.name);
              setWorkoutType(selectedPreset.workoutType);
              setSets(selectedPreset.sets || []);
              setDistance(selectedPreset.distance || "");
              setTime(selectedPreset.time || "");
            }
          }
        }}
        className={styles.select}
      >
        <option value="">No Preset (Add New)</option>
        {presets.map((p, index) => (
          <option key={index} value={p.workoutId}>
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
            value={weightType}
            checked={workoutType === weightType}
            onChange={() => setWorkoutType(weightType)}
          />
          Weights
        </label>
        <label htmlFor="cardio-radio">
          <input
            id="cardio-radio"
            type="radio"
            value={cardioType}
            checked={workoutType === cardioType}
            onChange={() => setWorkoutType(cardioType)}
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
        ((workoutType === weightType && sets.length === 0) ||
          (workoutType === cardioType && (!distance || !time)))) ||
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
            {renderDateSelector()}
            {renderWorkoutTypeSelector()}
            {workoutType === weightType && renderWeightsInput()}
            {workoutType === cardioType && renderCardioInput()}
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
