import React from "react";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { getDuration, getSlotDay } from "../services/utils";

import ButtonWithLoader from "../components/buttonwithloader";

function BookedShift(props) {
  const classes = useStyles();

  const currentTimeStamp = moment().unix();

  return (
    <div>
      {props.bookedShifts &&
        props.bookedShifts.map((item, key) => (
          <div key={key}>
            <List
              subheader={
                <ListSubheader classes={{ root: classes.listSubHeaderRoot }}>
                  {getSlotDay(item.date)}, ( {item.shift.length} Shifts,
                  {getDuration(item)} )
                </ListSubheader>
              }
            >
              {item.shift &&
                item.shift.map((shift, shiftKey) => (
                  <div key={shiftKey}>
                    {shift.booked ? (
                      <ListItem>
                        <ListItemText
                          id="switch-list-label-wifi"
                          primary={
                            moment(shift.startTime).format("hh:mm A") +
                            " - " +
                            moment(shift.endTime).format("hh:mm A")
                          }
                          secondary={shift.area}
                        />
                        <ListItemSecondaryAction>
                          <ButtonWithLoader
                            shift={shift}
                            isButtonDisable={
                              moment(shift.startTime).unix() < currentTimeStamp
                            }
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ) : null}
                  </div>
                ))}
            </List>
          </div>
        ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  listSubHeaderRoot: {
    backgroundColor: "#E5E5E5",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  slotDetail: {
    color: "#fff",
  },
}));

export default BookedShift;
