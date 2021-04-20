import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Divider from "@material-ui/core/Divider";
import TabPanel from "./components/tabpanel";
import BookedShift from "./screens/bookedshift";
import AvailableShift from "./screens/availableshift";

import { itemsFetchData } from "./actions";

function App() {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const bookedShifts = useSelector(
    (state) => state.shiftReducer.bookedShiftsByDate
  );

  const onShiftTabChange = async (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(itemsFetchData());
  }, []);

  return (
    <div>
      <Tabs value={value} onChange={onShiftTabChange}>
        <Tab label="My shifts" />
        <Tab label="Available Shifts" />
      </Tabs>

      <Divider />

      <TabPanel value={value} index={0}>
        <BookedShift bookedShifts={bookedShifts} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <AvailableShift />
      </TabPanel>
    </div>
  );
}

export default App;
