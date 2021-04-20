import React from "react";
import { useState } from "react";

import Moment from "moment";
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

function AvailableShift(props) {
  const classes = useStyles();
  const moment = extendMoment(Moment);

  const currentTimeStamp = moment().unix();

  const getShiftStatus = (shift) => {
    let shiftTime = moment(shift.startTime).format("YYYY-MM-DD");

    let dateShift = props.shiftByDate.filter((shift) => {
      return shiftTime === shift.date;
    });

    dateShift[0].shift.forEach((element) => {
      if (moment(shift.startTime).format("YYYY-MM-DD") === "2021-04-24") {
        if (shift.id !== element.id && !element.overlapped) {
          let slot1Start = moment(shift.startTime).format("HH:mm");
          let slot1End = moment(shift.endTime).format("HH:mm");

          let slot2Start = moment(element.startTime).format("HH:mm");
          let slot2End = moment(element.endTime).format("HH:mm");

          let timeSegments = [];
          timeSegments.push([slot1Start, slot1End]);
          timeSegments.push([slot2Start, slot2End]);

          shift.overlapped = overlap(timeSegments);
        }
      }
    });

    if (shift.overlapped) {
      return " ( OverLapped ) ";
    } else if (shift.booked) {
      return " ( Booked )";
    } else {
      return "";
    }
  };

  return (
    <div>
      <Tabs
        value={props.areaValue}
        onChange={props.handleAreaChange}
        aria-label="simple tabs example"
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {props.allAreaList &&
          props.allAreaList.map((areaItem, key) => (
            <Tab
              key={key}
              label={areaItem.area + "(" + areaItem.shift.length + ")"}
            />
          ))}
      </Tabs>

      {props.shiftByDate &&
        props.shiftByDate.map((areaItem, key) => (
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
                  areaItem.shift.map((shift, shiftKey) => (
                    <div key={shiftKey}>
                      <ListItem>
                        <ListItemText
                          id="switch-list-label-wifi"
                          primary={
                            moment(shift.startTime).format("HH:mm ") +
                            " - " +
                            moment(shift.endTime).format("HH:mm ") +
                            getShiftStatus(shift) +
                            shift.overlapped
                          }
                        />

                        <ListItemSecondaryAction>
                          <ButtonWithLoader
                            shift={shift}
                            isButtonDisable={
                              moment(shift.endTime).unix() < currentTimeStamp ||
                              shift.overlapped
                            }
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  ))}
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
