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
            <TeamBuilder :heroes="heroes" @team-updated="(team : Array<any>) => setAlliedTeam(team)"/>
            <div>
                <div>
                    <button v-if="heroes.length > 0 && selectedMap.length > 0" @click="getHeroesForMap()">
                        Get map winrates
                    </button>
                    <HeroSuggestions v-if="mapWinrates.length > 0" :hero-suggestions="mapWinrates"/>
                    <LoadingSpinner v-if="loadingMapWinrates"/>
                </div>
                <div>
                    <button v-if="alliedTeam.length > 0" @click="getHeroSynergies()">
                        Get hero synergies
                    </button>
                    <SynergySuggestions v-if="heroSynergies.length > 0" :current-allies="alliedTeam" :hero-suggestions="heroSynergies" />
                    <LoadingSpinner v-if="loadingHeroSynergies"/>
                </div>
                <div>
                    Hero matchups
                </div>
            </div>
            <TeamBuilder :heroes="heroes" @team-updated="(team : Array<any>) => setEnemyTeam(team)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorldButtonVue from "../components/HelloWorldButton.vue";
import MapSelection from "../components/MapSelection.vue";
import TeamBuilder from "../components/TeamBuilder.vue";
import { mapActions } from 'vuex';
import HeroSuggestions from "../components/HeroSuggestions.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { Hero } from "../entities/hero";
import SynergySuggestions from "../components/SynergySuggestions.vue";

export default defineComponent({

    components: {
    HelloWorldButtonVue,
    MapSelection,
    TeamBuilder,
    HeroSuggestions,
    LoadingSpinner,
    SynergySuggestions
},
    data: function () {
        return {
            heroes: [] as Array<Hero>,
            alliedTeam: [] as Array<Hero>,
            enemyTeam: [] as Array<Hero>,
            selectedMap: "" as String,

            mapWinrates: [] as Array<Hero>,
            heroSynergies: [] as Array<Hero>,

            loadingMapWinrates: false as boolean,
            loadingHeroSynergies: false as boolean,
            loadingHeroMatchups: false as boolean
        }
    },
    computed: {

    },
    methods: {
        ...mapActions("heroes", ["getHeroesList"]),
        ...mapActions("map", ["getHeroWinratesForMap"]),
        ...mapActions("synergy", ["getTeamSynergies"]),

        setAlliedTeam(newTeam: Array<Hero>) {
            //  deep copy just in case
            this.alliedTeam = [...newTeam];

            console.log("Allied team updated ", this.alliedTeam);
        },
        setEnemyTeam(newTeam: Array<Hero>) {
            this.enemyTeam = [...newTeam];

            console.log("Enemy team updated ", this.alliedTeam);
        },
        async getHeroSynergies() {
            // * update the store
            console.log("Getting synergies for team ", this.alliedTeam);

            this.loadingHeroSynergies = true;

            let alliedTeamNames = this.alliedTeam.map(hero => hero.name);
            let enemyTeamNames = this.enemyTeam.map(hero => hero.name);

            console.log("Allied names ", alliedTeamNames);
            console.log("Enemy names ", enemyTeamNames);

            // todo send the query params and all
            await this.getTeamSynergies(alliedTeamNames, enemyTeamNames);

            const that:any = this;
            let heroSynergies = that.$store.state.synergy.synergiesList;

            // * the hero's role is not accessible on the map winrate thing
            // * a bit expensive for not much, but it's a small loop
            if (this.heroes.length > 0) {
                for (let i = 0; i < heroSynergies.length; i++) {
                    let synergyHero = heroSynergies[i];

                    let heroIndex = this.heroes.findIndex((hero : Hero) => hero.name === synergyHero.name);
                    if (heroIndex !== -1) {

                        // * set the overall winrate, the specifics will be in the per-case object
                        synergyHero.role = this.heroes[heroIndex].role;
                        synergyHero.winRate = this.heroes[heroIndex].winRate;
                    }
                    heroSynergies[i] = synergyHero;
                }
            }

            console.log(heroSynergies);
            this.loadingHeroSynergies = false;
            this.heroSynergies = heroSynergies;
        },
        async getHeroesForMap() {
            // * update the store
            console.log("Getting winrates for map ", this.selectedMap);

            this.loadingMapWinrates = true;

            await this.getHeroWinratesForMap(this.selectedMap);

            const that:any = this;
            let heroWinrates = that.$store.state.map.heroWinrates;

            // * the hero's role is not accessible on the map winrate thing
            // * a bit expensive for not much, but it's a small loop
            if (this.heroes.length > 0) {
                for (let i = 0; i < heroWinrates.length; i++) {
                    let mapWinrateHero = heroWinrates[i];

                    let heroIndex = this.heroes.findIndex((hero : Hero) => hero.name === mapWinrateHero.name);
                    if (heroIndex !== -1) {

                        mapWinrateHero.role = this.heroes[heroIndex].role;
                        // * set the overall winrate, the specifics will be in the per-case object
                        mapWinrateHero.winRate = this.heroes[heroIndex].winRate;
                    }
                    heroWinrates[i] = mapWinrateHero;
                }
            }

            console.log(heroWinrates);
            this.loadingMapWinrates = false;
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