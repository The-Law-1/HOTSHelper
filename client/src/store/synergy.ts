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
        async getTeamSynergies({commit, state} : any, alliedTeam: Array<Hero>, enemyTeam: Array<Hero>, minSampleSize: number = 35, selectionRange: number = 8)
        {
            let body = {
                "allies": alliedTeam,
                "enemies": enemyTeam
            };
            const res = await getSynergies(body, {alliedTeam, minSampleSize});

            // todo error handling

            commit("getTeamSynergies", res.data);
        }
    }
}

export default synergy;