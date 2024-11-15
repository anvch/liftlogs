import { Link } from "react-router-dom";
import Background from "../components/Background";
import Calendar from "../calendar/Calendar";
import MyWorkouts from "../components/MyWorkouts";

function Home() {
  return (
    <div>
      <Background></Background>
      <br></br>
      <Link to="/bio">
        <button>Bio</button>
      </Link>
      <br></br>
      <br></br>
      <h1>Welcome, username!</h1>
      <Link to="/calendar">
        <Calendar></Calendar>
      </Link>
      <br></br>
      <Link to="/addworkout">
        <button> + Add Workout</button>
      </Link>
      <br></br>
      <MyWorkouts className="my-workouts"></MyWorkouts>
    </div>
  );
}
export default Home;
