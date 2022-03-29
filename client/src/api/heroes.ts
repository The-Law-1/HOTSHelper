import axios, {AxiosResponse} from 'axios';
import { Hero } from '../entities/hero';

let serverHost = import.meta.env.VITE_SERVER_HOST || "http://localhost:";
let serverPort = import.meta.env.VITE_SERVER_PORT || 3001;

const heroesAPI = axios.create({
    baseURL: `${serverHost}${serverPort}/heroes`
});

export const getHeroesForMap = async (queryParams : any) => await heroesAPI.get(`/mapwinrates/`, {params: queryParams});

// * body is of type any
export const getHeroes = async () : Promise<AxiosResponse> => await heroesAPI.get(`/`);
