import axios from 'axios';

let serverHost = import.meta.env.VITE_SERVER_HOST || "http://localhost:";
let serverPort = import.meta.env.VITE_SERVER_PORT || 3001;

const heroesAPI = axios.create({
    baseURL: `${serverHost}${serverPort}/heroes`
});

// ! you gotta watch yourself with the params
// ! i have no clue
// export const getHeroesForMap = (params : any) => heroesAPI.get(`/map/${params.name}/${params.minSampleSize}/${params.selectionRange}`);
