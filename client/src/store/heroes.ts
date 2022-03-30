import { getHeroes } from "../api/heroes";
import { Hero } from "../entities/hero";
import { Axios, AxiosError, AxiosRequestHeaders } from "axios";

const heroes = {
    namespaced: true,
    state: {
        heroesList : [] as Array<Hero>
    },
    mutations: {
        getHeroesList(state: any, heroesList : Array<Hero>) {
            state.heroesList = heroesList;
        }
    },
    actions: {
        async getHeroesList({commit, state} : any)
        {
            try {
                const res = await getHeroes();
                if (res.status === 500) {
                    return ({
                        error: "Server error"
                    });
                }
                commit("getHeroesList", res.data);
            } catch (error : any) {
                return ({
                    error: (error as AxiosError).message
                })
            }

            return ({
                success: "true"
            });
        }
    }
}


export default heroes;