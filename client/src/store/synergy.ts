import { AxiosError } from "axios";
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

            try {
                const res = await getSynergies(args.alliedTeamNames,
                                               args.enemyTeamNames,
                                               query);

                if (res.status === 500) {
                    return ({
                        error: "Server error"
                    });
                }
                console.log("Store retrieved data ", res.data);
                commit("getTeamSynergies", res.data);
            } catch (error : any) {
                return ({
                    error: (error as AxiosError).message
                });
            }

            return ({
                success: "true"
            });
        }
    }
}

export default synergy;