import sendRequest from "./services/http";
import CONSTANTS from "./services/constants";

export function itemsFetchData() {
  return async (dispatch) => {
    const options = {
      url: CONSTANTS.SERVER_URL + "shifts",
      method: "get",
    };
    const response = await sendRequest(options);

    dispatch(itemsFetchDataSuccess(response));
  };
}

function itemsFetchDataSuccess(items) {
  return {
    type: "FETCH_DATA",
    items,
  };
}
