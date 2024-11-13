function WorkoutCard({ name, type, description }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Type: {type}</p>
      <p>Description: {description}</p>
    </div>
  );
}

export default WorkoutCard;
