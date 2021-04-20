import moment from "moment";

const groupBy = (array, key) => {
  // Return the end result
  const areaNameList = array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, []); // empty object is the initial value for result object

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(areaNameList).map((area) => {
    return {
      area: area,
      shift: areaNameList[area],
    };
  });

  return groupArrays;
};

const groupByDate = (array, key) => {
  // this gives an object with dates as keys
  const groups = array.reduce((result, currentValue) => {
    let date = moment(currentValue.startTime).format("YYYY-MM-DD");
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(currentValue);
    return result;
  }, []);

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date: date,
      shift: groups[date],
    };
  });
  return groupArrays;
};

const getDuration = (item) => {
  let startTime = moment(item.shift[0].startTime).format("HH:mm a");
  let endTime = moment(item.shift[item.shift.length - 1].endTime).format(
    "HH:mm a"
  );

  let duration = moment.duration(
    moment(endTime, "HH:mm a").diff(moment(startTime, "HH:mm a"))
  );

  let timeToShow;
  if (duration.hours() > 0 && duration.minutes() > 0) {
    timeToShow = duration.hours() + " Hour " + duration.minutes() + " minutes";
  } else if (duration.hours() <= 0) {
    timeToShow = duration.minutes() + " minutes";
  } else if (duration.minutes() <= 0) {
    timeToShow = duration.hours() + " Hour ";
  }

  return timeToShow;
};

const overlap = (timeSegments) => {
  let ret = false;
  let i = 0;
  while (!ret && i < timeSegments.length - 1) {
    let seg1 = timeSegments[i];
    let seg2 = timeSegments[i + 1];
    let range1 = moment.range(
      moment(seg1[0], "HH:mm"),
      moment(seg1[1], "HH:mm")
    );
    let range2 = moment.range(
      moment(seg2[0], "HH:mm"),
      moment(seg2[1], "HH:mm")
    );
    if (range1.overlaps(range2)) {
      ret = true;
    }
    i++;
    return ret;
  }
};

const getSlotDay = (date) => {
  let day = "";
  let isToday = moment(date).isSame(moment(), "day");
  let isYesteday = moment(date).isSame(moment().add(-1, "days"), "day");
  let isTomorrow = moment(date).isSame(moment().add(1, "days"), "day");

  if (isToday) {
    day = "Today";
  } else if (isYesteday) {
    day = "Yesteday";
  } else if (isTomorrow) {
    day = "Tomorrow ";
  } else {
    day = date;
  }

  return day;
};

export { groupBy, groupByDate, getDuration, overlap, getSlotDay };
