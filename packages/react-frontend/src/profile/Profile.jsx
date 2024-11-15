import { Link } from "react-router-dom";
import MyWorkouts from "../components/MyWorkouts";
import "./profile.css";

function Profile() {
  return (
    <div>
      <br />
      <div className="navbar">
        <Link to="/">
          <button className="navbutton">Home</button>
        </Link>
      </div>
      <br />
      <br />
      <h1 className="name">John Doe</h1>
      <h2 className="bio">Description of John Doe</h2>
      <div className="achievements">
        <div className="streak">
          <h3>Workout Streak</h3>
          <p>3</p>
        </div>
        <div className="monthlyWorkouts">
          <h3>Workouts</h3>
          <p>3</p>
          <h3>This Month</h3>
        </div>
      </div>
      <MyWorkouts className="my-workouts"></MyWorkouts>
    </div>
  );
}

export default Profile;
