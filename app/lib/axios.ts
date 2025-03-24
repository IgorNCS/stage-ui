import axios from "axios";

axios.defaults.baseURL = process.env.BACKEND_URL;

axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    console.log(
      "Sending request to backend: ",
      config.baseURL! + config.url,
      "RequestData:",
      JSON.stringify(config.data)
    );

    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    console.log(
      "Sending request to backend: ",
      response.config.baseURL + response.config.url!,
      "ResponseData:",
      JSON.stringify(response.data)
    );
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);


export const axiosApi = axios.create({
    baseURL: "http://localhost:5731", // Substitua pela sua URL base
  });