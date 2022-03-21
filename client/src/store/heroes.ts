import { getHeroes } from "../api/heroes";

const heroes = {
    namespaced: true,
    state: {
        heroesList : [] as Array<any>
    },
    mutations: {
        getHeroesList(state: any, heroesList : Array<any>) {
            state.heroesList = heroesList;
        }
    },
    actions: {
        async getHeroesList({commit, state} : any)
        {
            const res = await getHeroes();

            // todo error handling etc...

            console.log("This is the store saying I got this", res);
            commit("getHeroesList", res.data);
        }
    }
}


export default heroes;