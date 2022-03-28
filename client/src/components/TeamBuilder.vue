<template>
    <div>

        <div v-if="heroesLoaded === false">
            Retrieving heroes
            <LoadingSpinner/>
        </div>
        <div v-for="i in 5" :key="('HeroSelector' + i)">
            <HeroSelector
                :heroes="heroes"
                :heroes-loaded="heroesLoaded"
                @hero-selected="(hero: any) => newHeroChosen(i, hero)"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import HeroSelector from "./HeroSelector.vue"
import LoadingSpinner from "./LoadingSpinner.vue"

export default defineComponent({
    components: { HeroSelector, LoadingSpinner },
    props: {
        heroes : {
            type: Array,
            required: true
        }
    },
    data: function() {

        return ({
            currentTeam: [] as Array<any>
        });
    },
    methods: {
        newHeroChosen(index: number, hero : any) {
            this.currentTeam[index] = hero;
            this.$emit("teamUpdated", this.currentTeam);
        }
    },
    computed: {
        heroesLoaded() : boolean {
            return (this.heroes.length > 0);
        },
    }
})
</script>