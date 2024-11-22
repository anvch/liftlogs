/* eslint-disable react/prop-types */
import React from "react"; // eslint-disable-line no-unused-vars
import styles from "./workout-card.module.css";

function WorkoutCard({ name, type, description }) {
  return (
    <div className={styles.card}>
      <h3>{name}</h3>
      <p>Type: {type}</p>
      <p>Description: {description}</p>
    </div>
  );
}

export default WorkoutCard;
