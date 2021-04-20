const shiftReducer = (state = [], action) => {
  switch (action.type) {
    case "FETCH_DATA": {
      return action.items;
    }
    default:
      return state;
  }
};

export default shiftReducer;
