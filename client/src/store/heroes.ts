import { getHeroes } from "../api/heroes";
import { Hero } from "../entities/hero";

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
            const res = await getHeroes();

            // todo error handling etc...

            commit("getHeroesList", res.data);
        }
    }
}


export default heroes;