import { getSynergies } from "../api/team";
import { Hero } from "../entities/hero";

const synergy = {
    namespaced: true,
    state: {
        synergiesList : [] as Array<Hero>
    },
    mutations: {
        getTeamSynergies(state: any, synergiesList: Array<Hero>) {
            state.synergiesList = synergiesList;
        }
    },
    actions: {
        async getTeamSynergies({commit, state} : any, alliedTeam: Array<string>, enemyTeam: Array<string>, minSampleSize: number = 35, selectionRange: number = 8)
        {
            const query = {
                "minSampleSize" : minSampleSize,
                "selectionRange" : selectionRange
            }

            const res = await getSynergies(alliedTeam, enemyTeam, query);

            // todo error handling

            console.log("Store retrieved data ", res.data);

            commit("getTeamSynergies", res.data);
        }
    }
}

export default synergy;