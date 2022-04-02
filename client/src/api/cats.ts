import axios from 'axios';

let serverHost = import.meta.env.VITE_SERVER_HOST || "http://localhost";
let serverPort = import.meta.env.VITE_SERVER_PORT || 3001;

const catsAPI = axios.create({
    baseURL: `${serverHost}:${serverPort}/cats`
});

export const getCats = async () => await catsAPI.get(`/`);
