<style>

</style>

<template>
    <div class="text-center w-[100%] content-center">
        <!-- // todo this will need to emit an event with the map's name so we can send to server -->
        <!-- // todo also when you scrape the maps like a big boy pass them as a prop here -->
        <MapSelection/>

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
import { getHeroes } from "../api/heroes";
import { mapActions } from 'vuex';


export default defineComponent({

    components: {
        HelloWorldButtonVue,
        MapSelection,
        TeamBuilder
    },
    data: function () {
        return {
            heroes: [] as Array<any>
        }
    },
    computed: {

    },
    methods: {
        ...mapActions("heroes", ["getHeroesList"])

    },
    created: async function () {
        // * update the store
        await this.getHeroesList();

        const that:any = this;
        this.heroes = that.$store.state.heroes.heroesList;

        console.log("Got heroes from state ", this.heroes);
    }
})
</script>