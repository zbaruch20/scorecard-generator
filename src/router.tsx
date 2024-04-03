import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Scorecards from "./components/Scorecards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "scorecards/:data",
    element: <Scorecards />
  }
])

export default router