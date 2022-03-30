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
            <TeamBuilder :hero-list-error="heroListError" :heroes-loaded="!loadingHeroList" :heroes="heroes" @team-updated="(team : Array<any>) => setAlliedTeam(team)"/>
            <div>
                <div class="bg-blue-300 rounded-xl">
                    <div v-if="mapWinratesError" class="text-red-600">
                        {{ mapWinratesError }}
                    </div>
                    <button v-if="selectedMap.length > 0" @click="getHeroesForMap()">
                        Get map winrates
                    </button>
                    <HeroSuggestions v-if="mapWinrates.length > 0" :hero-suggestions="mapWinrates"/>
                    <LoadingSpinner v-if="loadingMapWinrates"/>
                </div>
                <div class="bg-green-300 rounded-xl">
                    <div v-if="teamSynergiesError" class="text-red-600">
                        {{ teamSynergiesError }}
                    </div>
                    <Disclosure v-slot="{ open }">
                        <DisclosureButton class="flex justify-between text-left text-green-900 py-2 rounded-lg bg-green-200 w-full">
                            <span>
                                Show hero synergies
                            </span>
                            <ChevronUpIcon
                                :class="open ? 'transform rotate-180' : ''"
                                class="w-5 h-5 text-purple-500"
                            />
                        </DisclosureButton>
                        <DisclosurePanel>
                            <button v-if="alliedTeam.length > 0" @click="getHeroSynergies()">
                                Load synergies
                            </button>
                            <SynergySuggestions v-if="heroSynergies.length > 0" :current-allies="alliedTeam" :hero-suggestions="heroSynergies" />
                            <LoadingSpinner v-if="loadingHeroSynergies"/>
                        </DisclosurePanel>
                    </Disclosure>
                </div>
                <div class="bg-red-300 rounded-xl">
                    <div v-if="teamMatchupsError" class="text-red-600">
                        {{ teamMatchupsError }}
                    </div>
                    <Disclosure v-slot="{ open }">
                        <DisclosureButton class="flex justify-between text-left text-red-900 py-2 rounded-lg bg-red-200 w-full">

                            <span>
                                Show hero matchups
                            </span>
                            <ChevronUpIcon
                                :class="open ? 'transform rotate-180' : ''"
                                class="w-5 h-5 text-purple-500"
                            />
                        </DisclosureButton>
                        <DisclosurePanel>
                            <button v-if="enemyTeam.length > 0" @click="getHeroMatchups()">
                                Get hero matchups
                            </button>
                            <MatchupSuggestions v-if="heroMatchups.length > 0" :current-enemies="enemyTeam" :hero-suggestions="heroMatchups"/>
                            <LoadingSpinner v-if="loadingHeroMatchups"/>
                        </DisclosurePanel>
                    </Disclosure>
                </div>
            </div>
            <TeamBuilder :hero-list-error="(heroListError)" :heroes-loaded="!loadingHeroList" :heroes="heroes" @team-updated="(team : Array<any>) => setEnemyTeam(team)"/>
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
import MatchupSuggestions from "../components/MatchupSuggestions.vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from '@heroicons/vue/solid'

export default defineComponent({

    components: {
    HelloWorldButtonVue,
    MapSelection,
    TeamBuilder,
    HeroSuggestions,
    LoadingSpinner,
    SynergySuggestions,
    MatchupSuggestions,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon
},
    data: function () {
        return {
            heroes: [] as Array<Hero>,
            alliedTeam: [] as Array<Hero>,
            enemyTeam: [] as Array<Hero>,
            selectedMap: "" as String,

            mapWinrates: [] as Array<Hero>,
            heroSynergies: [] as Array<Hero>,
            heroMatchups: [] as Array<Hero>,

            loadingHeroList: false as boolean,
            loadingMapWinrates: false as boolean,
            loadingHeroSynergies: false as boolean,
            loadingHeroMatchups: false as boolean,

            minSampleSize: 30 as Number,
            selectionRange: 8 as Number,
            heroSelectionRange: 2 as Number,
            playMode: "QuickMatch" as String,

            heroListError: "" as String,
            mapWinratesError: "" as String,
            teamSynergiesError: "" as String,
            teamMatchupsError: "" as String
        }
    },
    computed: {

    },
    methods: {
        ...mapActions("heroes", ["getHeroesList"]),
        ...mapActions("map", ["getHeroWinratesForMap"]),
        ...mapActions("synergy", ["getTeamSynergies"]),
        ...mapActions("matchup", ["getTeamMatchups"]),

        setAlliedTeam(newTeam: Array<Hero>) {
            //  deep copy just in case
            this.alliedTeam = [...newTeam];

            console.log("Allied team updated ", this.alliedTeam);
        },
        setEnemyTeam(newTeam: Array<Hero>) {
            this.enemyTeam = [...newTeam];

            console.log("Enemy team updated ", this.enemyTeam);
        },

        setHeroRolesAndWinrate(heroesToUpdate: Array<Hero>) {
            // * the hero's role is not accessible on the map winrate thing
            // * a bit expensive for not much, but it's a small loop
            if (this.heroes.length > 0) {
                for (let i = 0; i < heroesToUpdate.length; i++) {
                    let heroToUpdate = heroesToUpdate[i];

                    let heroIndex = this.heroes.findIndex((hero : Hero) => hero.name === heroToUpdate.name);
                    if (heroIndex !== -1) {

                        // * set the overall winrate, the specifics will be in the per-case object
                        heroToUpdate.role = this.heroes[heroIndex].role;
                        heroToUpdate.winRate = this.heroes[heroIndex].winRate;
                    }
                    heroesToUpdate[i] = heroToUpdate;
                }
            }
            return (heroesToUpdate);
        },

        async getHeroMatchups() {
            console.log("Getting matchups agains team ", this.enemyTeam);

            this.loadingHeroMatchups = true;

            let alliedTeamNames = this.alliedTeam.map(hero => hero.name);
            let enemyTeamNames = this.enemyTeam.map(hero => hero.name);

            console.log("Dashboard sending enemy team names", enemyTeamNames);
            const { error } = await this.getTeamMatchups({
                alliedTeamNames,
                enemyTeamNames,
                "minSampleSize": this.minSampleSize,
                "selectionRange": this.selectionRange
            });

            this.teamMatchupsError = error || "";
            if (this.teamMatchupsError.length > 0) {
                this.loadingHeroMatchups = false;
                return;
            }

            const that:any = this;
            let heroMatchups = that.$store.state.matchup.matchupsList;

            heroMatchups = this.setHeroRolesAndWinrate(heroMatchups);

            console.log(heroMatchups);
            this.loadingHeroMatchups = false;
            this.heroMatchups = heroMatchups;
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
            const { error } = await this.getTeamSynergies({
                alliedTeamNames,
                enemyTeamNames,
                "minSampleSize": this.minSampleSize,
                "selectionRange": this.selectionRange
            });

            this.teamSynergiesError = error || "";

            if (this.teamSynergiesError.length > 0) {
                this.loadingHeroSynergies = false;
                return;
            }

            const that:any = this;
            let heroSynergies = that.$store.state.synergy.synergiesList;

            heroSynergies = this.setHeroRolesAndWinrate(heroSynergies);

            console.log(heroSynergies);
            this.loadingHeroSynergies = false;
            this.heroSynergies = heroSynergies;
        },
        async getHeroesForMap() {
            // * update the store
            console.log("Getting winrates for map ", this.selectedMap);

            this.loadingMapWinrates = true;

            // todo gotta be a way to write this without the this
            const {error} = await this.getHeroWinratesForMap({
                mapName: this.selectedMap,
                minSampleSize: this.minSampleSize,
                selectionRange: this.selectionRange
            });

            this.mapWinratesError = error || "";
            if (this.mapWinratesError.length > 0) {
                this.loadingMapWinrates = false;
                return;
            }

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
        this.loadingHeroList = true;
        const {error} = await this.getHeroesList();

        this.heroListError = error || "";

        if (this.heroListError !== "") {
            this.loadingHeroList = false;
            return;
        }

        // * get from the store
        const that:any = this;
        this.heroes = that.$store.state.heroes.heroesList;

        console.log("Got heroes from state ", this.heroes);
        this.loadingHeroList = false;
    }
})
</script>