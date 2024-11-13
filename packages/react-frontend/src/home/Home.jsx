import { Link } from "react-router-dom";
import Background from "../components/Background";
import Calendar from "../calendar/Calendar";
import MyWorkouts from "../components/MyWorkouts";

function Home() {
  return (
    <div>
      <Background></Background>
      <h1>Welcome, username!</h1>
      <Link to="/calendar">
        <Calendar></Calendar>
      </Link>
      <br></br>
      <Link to="/addworkout">
        <button> + Add Workout</button>
      </Link>
      <MyWorkouts className="my-workouts"></MyWorkouts>
    </div>
  );
}
export default Home;
