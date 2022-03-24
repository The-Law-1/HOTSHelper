<style>

</style>

<template>
    <div class="text-center w-[100%] content-center">
        <!-- // todo this will need to emit an event with the map's name so we can send to server -->
        <!-- // todo also when you scrape the maps like a big boy pass them as a prop here -->

        <MapSelection @map-updated="(mapName) => selectedMap = mapName"/>

        <div
            class="
                pt-10
                flex
                justify-between
            "
        >
            <!-- // todo the team builders will probably emit events to build the request body -->
            <TeamBuilder :heroes="heroes"/>
            <div>
                <div>
                    <button v-if="selectedMap.length > 0" @click="getHeroesForMap()">
                        Get map winrates
                    </button>
                    Hero choices for map
                </div>
                <div>
                    Hero synergies
                </div>
                <div>
                    Hero matchups
                </div>
            </div>
            <TeamBuilder :heroes="heroes"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorldButtonVue from "../components/HelloWorldButton.vue";
import MapSelection from "../components/MapSelection.vue";
import TeamBuilder from "../components/TeamBuilder.vue";
import { mapActions } from 'vuex';
import { getHeroesForMap } from "../api/heroes";

export default defineComponent({

    components: {
        HelloWorldButtonVue,
        MapSelection,
        TeamBuilder
    },
    data: function () {
        return {
            heroes: [] as Array<any>,
            alliedTeam: [] as Array<any>,
            enemyTeam: [] as Array<any>,
            selectedMap: "" as String
        }
    },
    computed: {

    },
    methods: {
        ...mapActions("heroes", ["getHeroesList"]),
        ...mapActions("map", ["getHeroWinratesForMap"]),

        async getHeroesForMap() {
            // * update the store

            await this.getHeroWinratesForMap(this.selectedMap);

            const that:any = this;
            let heroWinrates = that.$store.state.map.heroWinrates;

            console.log("Got hero winrates for map : ", this.selectedMap);
            console.log(heroWinrates);
        }
    },
    created: async function () {
        // * update the store
        await this.getHeroesList();

        // * get from the store
        const that:any = this;
        this.heroes = that.$store.state.heroes.heroesList;

        console.log("Got heroes from state ", this.heroes);
    }
})
</script>