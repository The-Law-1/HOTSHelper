import axios from 'axios';

let serverHost = import.meta.env.VITE_SERVER_HOST || "http://localhost:";
let serverPort = import.meta.env.VITE_SERVER_PORT || 3001;

const teamssAPI = axios.create({
    baseURL: `${serverHost}${serverPort}/heroes/team`
});

export const getSynergies = async (body:any, queryParams:any) => teamssAPI.post("/synergies", {
    body: body,
    params: queryParams
});

export const getMatchups = async (body:any, queryParams:any) => teamssAPI.post("/matchups", {
    body: body,
    params: queryParams
});