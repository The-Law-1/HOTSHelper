<template>
    <div>
        <div v-for="(enemyHero, index) in currentEnemies">
            <div class="flex items-center justify-center" :key="index">

                <!-- div with stacked things -->
                <HeroSuggestions :hero-suggestions="getMatchupsForEnemy(enemyHero)"/>

                Against:
                <!-- ally hero portrait -->
                <HeroInfoPopover :hero-data="(enemyHero as any)"/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeroInfoPopover from "./HeroInfoPopover.vue";
import HeroSuggestions from "./HeroSuggestions.vue";
import { Hero } from "../entities/hero";

export default defineComponent({
    props: {
        currentEnemies: {
            type: Array,
            required: true
        },
        heroSuggestions: {
            type: Array,
            required: true
        }
    },
    methods: {
        getMatchupsForEnemy(enemy: any) {
            // * the idea here is to filter by hero name
            let heroMatchupsForEnemy = this.heroSuggestions.filter(
                (heroSuggestion: any) => {

                    for (const property in (heroSuggestion as Hero).winRatePerMatchup) {
                        if (property === (enemy as Hero).name) {
                            return (true);
                        }
                    }
                    return (false);
                }
            );

            return (heroMatchupsForEnemy);
        }
    },
    components: { HeroInfoPopover, HeroSuggestions }
});

</script>