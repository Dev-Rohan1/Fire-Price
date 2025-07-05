import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "./contexts/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
      <Toaster />
    </AppContextProvider>
  </BrowserRouter>
);
