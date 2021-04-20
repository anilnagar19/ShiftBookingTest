import sendRequest from "./services/http";

export function itemsFetchDataSuccess(items) {
  return {
    type: "FETCH_DATA",
    items,
  };
}

export function itemsFetchData(options) {
  return async (dispatch) => {
    let resposne = await sendRequest(options);
    dispatch(itemsFetchDataSuccess(resposne));
  };
}
