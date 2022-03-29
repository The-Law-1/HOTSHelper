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

            console.log("Matchup store got allies: ", args.alliedTeamNames);
            console.log("Matchup store got enemies: ", args.enemyTeamNames);

            const res = await getMatchups(
                args.alliedTeamNames,
                args.enemyTeamNames,
                query
            );

            // todo error handling

            console.log("Store retrieved matchups", res.data);

            commit("getTeamMatchups", res.data);
        }
    }
}

export default matchup;