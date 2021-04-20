const axios = require("axios");

const sendRequest = async ({ ...props }) => {
  try {
    const { data } = await axios({
      url: props.url,
      data: props.data,
      params: props.params,
      method: props.method,
    });
    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default sendRequest;
