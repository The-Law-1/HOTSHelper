import { createStore } from "vuex";
// * look into persistedstate if you want to put stuff in local storage
import Heroes from './heroes';
import Map from "./map";
import Synergy from "./synergy";
import Matchup from "./matchup";

const store = createStore({
    state: {

    },
    modules: {
        "heroes": Heroes,
        "map": Map,
        "synergy": Synergy,
        "matchup": Matchup
    }
})

export default store;