import React from "react";
import Moment from "moment";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import List from "@material-ui/core/List";
import { extendMoment } from "moment-range";
import TabPanel from "../components/tabpanel";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";

import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import ButtonWithLoader from "../components/buttonwithloader";
import { overlap, getSlotDay } from "../services/utils";

function AvailableShift() {
  const errorColor = {
    color: "#E2006A",
  };
  const successColor = {
    color: "#16A64D",
  };
  const classes = useStyles();
  const moment = extendMoment(Moment);
  const currentTimeStamp = moment().unix();

  const [areaValue, setAreaValue] = useState(0);
  const areaGroupedShifts = useSelector(
    (state) => state.shiftReducer.areaGroupedShifts
  );
  const [shiftByDate, setShiftByDate] = useState(areaGroupedShifts);

  useEffect(() => {
    if (areaGroupedShifts) {
      setShiftByDate(areaGroupedShifts[areaValue].shift);
    }
  }, [areaGroupedShifts]);

  useEffect(() => {
    if (areaGroupedShifts) {
      setShiftByDate(areaGroupedShifts[areaValue].shift);
    }
  }, [areaValue]);

  //TO show current status of shift
  const getShiftStatus = (shift) => {
    let shiftTime = moment(shift.startTime).format("YYYY-MM-DD");

    let dateShift = shiftByDate.filter((shift) => {
      return shiftTime === shift.date;
    });

    if (dateShift[0]) {
      dateShift[0].shift.forEach((element) => {
        if (shift.id !== element.id && !shift.overlapped) {
          let slot1Start = moment(shift.startTime).format("HH:mm");
          let slot1End = moment(shift.endTime).format("HH:mm");

          let slot2Start = moment(element.startTime).format("HH:mm");
          let slot2End = moment(element.endTime).format("HH:mm");

          let timeSegments = [];
          timeSegments.push([slot1Start, slot1End]);
          timeSegments.push([slot2Start, slot2End]);

          element.overlapped = overlap(timeSegments);
        }
      });
    }

    if (shift.overlapped) {
      return "OverLapping";
    } else if (shift.booked) {
      return "Booked";
    } else {
      return "";
    }
  };

  const handleAreaChange = (event, newValue) => {
    setAreaValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={areaValue}
        onChange={(event, value) => {
          handleAreaChange(event, value);
        }}
        aria-label="simple tabs example"
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {areaGroupedShifts &&
          areaGroupedShifts.map((areaItem, key) => (
            <Tab
              key={key}
              label={areaItem.area + "(" + areaItem.shift.length + ")"}
            />
          ))}
      </Tabs>
      {shiftByDate &&
        shiftByDate.map((areaItem, key) => (
          <TabPanel value={key} index={key} key={key}>
            <div>
              <List
                subheader={
                  <ListSubheader classes={{ root: classes.listSubHeaderRoot }}>
                    {getSlotDay(areaItem.date)}
                  </ListSubheader>
                }
              >
                {areaItem.shift &&
                  areaItem.shift.map((shift, shiftKey) => {
                    return (
                      <div key={shiftKey}>
                        <ListItem>
                          <ListItemText
                            id="switch-list-label-wifi"
                            primary={
                              moment(shift.startTime).format("HH:mm ") +
                              " - " +
                              moment(shift.endTime).format("HH:mm ")
                            }
                            secondary={getShiftStatus(shift)}
                            secondaryTypographyProps={{
                              style:
                                getShiftStatus(shift) === "OverLapping"
                                  ? errorColor
                                  : successColor,
                            }}
                          />

                          <ListItemSecondaryAction>
                            <ButtonWithLoader
                              shift={shift}
                              isButtonDisable={
                                moment(shift.endTime).unix() <
                                  currentTimeStamp || shift.overlapped
                              }
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </div>
                    );
                  })}
              </List>
            </div>
          </TabPanel>
        ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  listSubHeaderRoot: {
    backgroundColor: "#E5E5E5",
    color: "#444444",
    fontSize: "16px",
    fontWeight: "600",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
}));

export default AvailableShift;
