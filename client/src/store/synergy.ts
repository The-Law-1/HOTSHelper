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
        async getTeamSynergies({commit, state} : any, args: any)
        {
            const query = {
                "minSampleSize" : args.minSampleSize,
                "selectionRange" : args.selectionRange
            }

            console.log("Synergy store got allies: ", args.alliedTeamNames);
            console.log("Synergy store got enemies: ", args.enemyTeamNames);


            const res = await getSynergies(args.alliedTeamNames,
                                           args.enemyTeamNames,
                                           query);

            // todo error handling

            console.log("Store retrieved data ", res.data);

            commit("getTeamSynergies", res.data);
        }
    }
}

export default synergy;