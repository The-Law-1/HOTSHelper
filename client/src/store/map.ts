import { getHeroesForMap } from '../api/heroes';

const map = {
    namespaced: true,
    state: {
        heroWinrates : [] as Array<any>
    },
    mutations: {
        getHeroWinrates(state: any, heroWinrates : Array<any>) {
            state.heroWinrates = heroWinrates;
        }
    },
    actions: {
        async getHeroWinratesForMap({commit, state} : any, mapName : string)
        {
            const query = {
                name: mapName,
                //minSampleSize:,
                // selectionRange: 
            };
            const res = await getHeroesForMap(query);

            // todo error handling etc...

            commit("getHeroWinrates", res.data);
        }
    }
}


export default map;