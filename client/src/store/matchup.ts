import { AxiosError } from "axios";
import { getMatchups } from "../api/team";
import { Hero } from "../entities/hero";

const matchup = {
    namespaced: true,
    state: {
        matchupsList : [] as Array<Hero>
    },
    mutations: {
        getTeamMatchups(state: any, matchupsList: Array<Hero>) {
            state.matchupsList = matchupsList;
        }
    },
    actions: {
        async getTeamMatchups({commit, state} : any, args: any) {
            const query = {
                "minSampleSize" : args.minSampleSize,
                "selectionRange" : args.selectionRange
            }

            try {
                const res = await getMatchups(
                    args.alliedTeamNames,
                    args.enemyTeamNames,
                    query
                );

                if (res.status === 500) {
                    return ({
                        error: "Server error"
                    });
                }

                commit("getTeamMatchups", res.data);
            } catch (error : any) {
                return ({
                    error: (error as AxiosError).message
                })
            }

            return ({
                success: true
            })
        }
    }
}

export default matchup;