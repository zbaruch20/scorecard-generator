import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Scorecards from "./pages/Scorecards";

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