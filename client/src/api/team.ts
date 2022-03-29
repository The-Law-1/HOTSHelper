import axios from 'axios';

let serverHost = import.meta.env.VITE_SERVER_HOST || "http://localhost:";
let serverPort = import.meta.env.VITE_SERVER_PORT || 3001;

const teamssAPI = axios.create({
    baseURL: `${serverHost}${serverPort}/heroes/team`
});

export const getSynergies = async (alliedNames:Array<string>, enemyNames: Array<string>, queryParams:any) => teamssAPI.post("/synergies", {
    allies: alliedNames,
    enemies: enemyNames
    },
    {
        params: queryParams
    }
);

export const getMatchups = async (alliedNames:Array<string>, enemyNames: Array<string>, queryParams:any) => teamssAPI.post("/matchups", {
    allies: alliedNames,
    enemies: enemyNames
    },
    {
        params: queryParams
    }
);