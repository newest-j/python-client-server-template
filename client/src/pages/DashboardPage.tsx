import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.name?.split(" ")[0];
  const lastName = user?.name?.split(" ")[1];

  return (
    <section>
      <div>
        <h1>Good morning {firstName}</h1>
        <p>As the head of the {lastName} family what do you have for us </p>
      </div>
    </section>
  );
}

export default DashboardPage;
