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
                    <button v-if="heroes.length > 0 && selectedMap.length > 0" @click="getHeroesForMap()">
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
            selectedMap: "" as String,
            mapWinrates: [] as Array<any>
        }
    },
    computed: {

    },
    methods: {
        ...mapActions("heroes", ["getHeroesList"]),
        ...mapActions("map", ["getHeroWinratesForMap"]),

        async getHeroesForMap() {
            // * update the store
            console.log("Getting winrates for map ", this.selectedMap);

            await this.getHeroWinratesForMap(this.selectedMap);

            const that:any = this;
            let heroWinrates = that.$store.state.map.heroWinrates;

            // * the hero's role is not accessible on the map winrate thing
            // * a bit expensive for not much, but it's a small loop
            if (this.heroes.length > 0) {
                for (let i = 0; i < heroWinrates.length; i++) {
                    let mapWinrateHero = heroWinrates[i];

                    let heroIndex = this.heroes.findIndex((hero : any) => hero.name === mapWinrateHero.name);
                    if (heroIndex !== -1) {

                        mapWinrateHero.role = this.heroes[heroIndex].role;
                    }
                    heroWinrates[i] = mapWinrateHero;
                }
            }

            console.log(heroWinrates);
            this.mapWinrates = heroWinrates;
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