import { createStore } from "vuex";
// * look into persistedstate if you want to put stuff in local storage
import Heroes from './heroes';
import Map from "./map";

const store = createStore({
    state: {

    },
    modules: {
        "heroes": Heroes,
        "map": Map
    }
})

export default store;