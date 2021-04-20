import { useState } from "react";
import React, { useEffect } from "react";
import Chip from "@material-ui/core/Chip";
import { useDispatch } from "react-redux";

import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import sendRequest from "../services/http";
import { itemsFetchData } from "../actions";
import CONSTANTS from "../services/constants";

function ButtonWithLoader(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [shift, setShift] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShift(props.shift);
  }, [props.shift]);

  function getAllShifts() {
    let data = {
      url: CONSTANTS.SERVER_URL + "shifts",
      method: "get",
    };
    dispatch(itemsFetchData(data));
  }

  const bookShift = async () => {
    setLoading(true);

    let data = {
      url: CONSTANTS.SERVER_URL + "shifts/" + shift.id + "/book",
      method: "POST",
    };

    const response = await sendRequest(data);

    setLoading(false);

    if (response) {
      //   dispatch({
      //     type: "BOOKING_STATUS",
      //     status: { message: "Booked SuccessFully", status: true },
      //   });
      getAllShifts();
    }
  };

  const cancelShift = async () => {
    setLoading(true);

    let data = {
      url: CONSTANTS.SERVER_URL + "shifts/" + shift.id + "/cancel",
      method: "POST",
    };

    const response = await sendRequest(data);

    setLoading(false);
    if (response) {
      //   dispatch({
      //     type: "BOOKING_STATUS",
      //     status: { message: "Canceled SuccessFully", status: true },
      //   });
      getAllShifts();
    }
  };

  return (
    <div>
      <div className={classes.wrapper}>
        {shift.booked ? (
          <Chip
            label="Cancel"
            onClick={() => cancelShift()}
            variant="outlined"
            color="secondary"
            disabled={props.isButtonDisable || loading}
          />
        ) : (
          <Chip
            label="Book"
            onClick={() => bookShift()}
            variant="outlined"
            color="primary"
            disabled={props.isButtonDisable || loading}
          />
        )}
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
export default ButtonWithLoader;
