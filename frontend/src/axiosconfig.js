import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: `${process.env.REACT_APP_BACK_PORT}`, // Ensure you use `REACT_APP_` prefix
});

export default instance;
