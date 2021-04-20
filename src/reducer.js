import { groupBy, groupByDate } from "./services/utils";

const shiftReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_DATA": {
      const allShifts = action.items;
      const areaList = groupBy(allShifts, "area");
      const areaGroupedShifts = areaList.map((area) => {
        const groupedShifts = groupByDate(area.shift, "startTime");
        area.shift = groupedShifts;
        return area;
      });
      const bookedShifts = allShifts.filter((shift) => {
        return shift.booked;
      });
      const bookedShiftsByDate = groupByDate(bookedShifts, "startTime");

      return {
        allShifts: action.items,
        bookedShifts: bookedShifts,
        areaGroupedShifts: areaGroupedShifts,
        bookedShiftsByDate: bookedShiftsByDate,
      };
    }

    case "BOOKING_STATUS": {
      return {
        status: action.status,
      };
    }

    default:
      return state;
  }
};

export default shiftReducer;
