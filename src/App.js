import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Divider from "@material-ui/core/Divider";

import CONSTANTS from "./services/constants";

import { groupBy, groupByDate } from "./services/utils";

import TabPanel from "./components/tabpanel";

import BookedShift from "./screens/bookedshift";
import AvailableShift from "./screens/availableshift";

import { itemsFetchData } from "./actions";

function App() {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);
  const [areaValue, setAreaValue] = useState(0);

  const [allAreaList, setArea] = useState([]);
  const [shiftByDate, setshiftByDate] = useState([]);
  const [bookedShifts, setBookedShifts] = useState([]);

  const allShifts = useSelector((state) => state.shiftReducer);

  useEffect(() => {
    getAllShifts();
  }, [allShifts]);

  useEffect(() => {
    getUpdatedData();
  }, [allShifts]);

  async function getAllShifts() {
    let data = {
      url: CONSTANTS.SERVER_URL + "shifts",
      method: "get",
    };
    dispatch(itemsFetchData(data));
  }

  const onShiftTabChange = async (event, newValue) => {
    getUpdatedData();

    setValue(newValue);
  };

  const getFilteredBookedShift = () => {
    let bookedShifts = allShifts.filter((shift) => {
      return shift.booked;
    });

    return groupByDate(bookedShifts, "startTime");
  };

  const handleAreaChange = (event, newValue) => {
    if (allAreaList.length) {
      let shiftByDate = groupByDate(allAreaList[newValue].shift, "startTime");
      setshiftByDate(shiftByDate);

      setAreaValue(newValue);
    }
  };

  const getAreaList = () => {
    return groupBy(allShifts, "area");
  };

  const getUpdatedData = () => {
    const areaList = getAreaList();
    const bookedShiftList = getFilteredBookedShift();

    setArea(areaList);
    setBookedShifts(bookedShiftList);
    handleAreaChange(null, areaValue);
  };

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
        <AvailableShift
          areaValue={areaValue}
          allAreaList={allAreaList}
          shiftByDate={shiftByDate}
          handleAreaChange={handleAreaChange}
        />
      </TabPanel>
    </div>
  );
}

export default App;
