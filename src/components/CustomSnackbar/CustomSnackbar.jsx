import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const CustomSnackbar = (props) => {
  const { toastMessage, toastType, isToastOpen } = props;

  return (
    <Snackbar
      open={isToastOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert variant="filled" severity={toastType}>
        <AlertTitle style={{ textTransform: "capitalize", fontWeight: 600 }}>
          {toastType}
        </AlertTitle>
        {toastMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
