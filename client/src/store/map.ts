import { AxiosError } from 'axios';
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
        async getHeroWinratesForMap({commit, state} : any, args: any)
        {
            const query = {
                name: args.mapName,
                minSampleSize: args.minSampleSize,
                selectionRange: args.selectionRange
            };

            try {
                const res = await getHeroesForMap(query);

                if (res.status === 500) {
                    return ({
                        error: "Server error"
                    });
                }
                commit("getHeroWinrates", res.data);
            } catch (error : any) {
                return ({
                    error: (error as AxiosError).message
                })
            }

            return ({
                success: "true"
            })
        }
    }
}


export default map;