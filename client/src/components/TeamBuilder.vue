<template>
    <div>

        <div v-if="heroesLoaded === false">
            Retrieving heroes
            <LoadingSpinner/>
        </div>
        <div v-for="i in 5" :key="('HeroSelector' + i)">
            <HeroSelector :heroes="heroes" :heroes-loaded="heroesLoaded"/>
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
    computed: {
        heroesLoaded() : boolean {
            return (this.heroes.length > 0);
        },
    }
})
</script>