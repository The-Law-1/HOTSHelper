import { getHeroesForMap } from '../api/heroes';
import { Hero } from '../entities/hero';

const map = {
    namespaced: true,
    state: {
        heroWinrates : [] as Array<Hero>
    },
    mutations: {
        getHeroWinrates(state: any, heroWinrates : Array<Hero>) {
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