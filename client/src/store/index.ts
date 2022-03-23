import { createStore } from "vuex";
// * look into persistedstate if you want to put stuff in local storage
import Heroes from './heroes';

const store = createStore({
    state: {

    },
    modules: {
        "heroes": Heroes
    }
})

export default store;