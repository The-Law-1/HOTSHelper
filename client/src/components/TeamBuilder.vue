<template>
    <div>

        <div v-if="heroListError.length > 0" class="text-red-600">
            {{ heroListError }}
        </div>
        <div v-if="heroesLoaded === false">
            Retrieving heroes...
            <LoadingSpinner/>
        </div>

        <div v-for="i in 5" :key="('HeroSelector' + i)">
            <HeroSelector
                :heroes="heroes"
                :heroes-loaded="heroesLoaded"
                @hero-selected="(hero: any) => newHeroChosen(i - 1, hero)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Hero } from "../entities/hero";
import HeroSelector from "./HeroSelector.vue"
import LoadingSpinner from "./LoadingSpinner.vue"
import { PropType } from "vue";

export default defineComponent({
    components: { HeroSelector, LoadingSpinner },
    props: {
        heroes : {
            type: Array,
            required: true
        },
        heroListError: {
            type: String as PropType<String>,
            required: true
        },
        heroesLoaded: {
            type: Boolean,
            required: true
        }
    },
    data: function() {

        return ({
            currentTeam: [] as Array<Hero>
        });
    },
    methods: {
        newHeroChosen(index: number, hero : Hero) {
            console.log("Teambuilder got index ", index);

            this.currentTeam[index] = hero;
            console.log("Team from teambuilder ", this.currentTeam);
            this.$emit("teamUpdated", this.currentTeam);
        }
    },
    computed: {
    }
})
</script>