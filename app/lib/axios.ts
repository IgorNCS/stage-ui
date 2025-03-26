import axios from "axios";

axios.defaults.baseURL = process.env.BACKEND_URL;

axios.defaults.withCredentials = true;


axios.interceptors.request.use(
  function (config) {
    console.log(
      "Sending request to backend: ",
      config.baseURL! + config.url,
      "RequestData:",
      JSON.stringify(config.data)
    );

    return config;
  },
  function (error) {

    return Promise.reject(error);
  }
);


axios.interceptors.response.use(
  function (response) {


    console.log(
      "Sending request to backend: ",
      response.config.baseURL + response.config.url!,
      "ResponseData:",
      JSON.stringify(response.data)
    );
    return response;
  },
  function (error) {

    return Promise.reject(error);
  }
);


export const axiosApi = axios.create({
    baseURL: "http://localhost:5731",
  });