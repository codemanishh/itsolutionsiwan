import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// React 18 createRoot API
createRoot(document.getElementById("root")!).render(<App />);
