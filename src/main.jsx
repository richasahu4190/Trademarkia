import "@szhsin/react-menu/dist/index.css";
import React, { useContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { MSTStoreContext, MSTStoreProvider } from "mst/store";

import CustomSnackbar from "./components/CustomSnackbar/CustomSnackbar";
import App from "./App";

const MyApp = observer(() => {
  const mstStore = useContext(MSTStoreContext);
  const { viewStore } = mstStore;
  const { toastStore, showLoader } = viewStore;
  const { showToast, toastMessage, toastType } = toastStore;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MSTStoreProvider>
        <StrictMode>
          <BrowserRouter basename="">
            <App />
            <CustomSnackbar
              toastMessage={toastMessage}
              toastType={toastType}
              isToastOpen={showToast}
            />
          </BrowserRouter>
        </StrictMode>
      </MSTStoreProvider>
    </LocalizationProvider>
  );
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MyApp />
  </StrictMode>
);
