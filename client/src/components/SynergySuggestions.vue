<template>
    <div>
        <div v-for="(allyHero, index) in currentAllies">
            <div class="flex" :key="index">
                <!-- ally hero portrait -->
                <HeroInfoPopover :hero-data="(allyHero as any)"/>

                <!-- div with stacked things -->
                <HeroSuggestions :hero-suggestions="getSynergiesForAlly(allyHero)"/>

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
        currentAllies: {
            type: Array,
            required: true
        },
        heroSuggestions: {
            type: Array,
            required: true
        }
    },
    methods: {
        getSynergiesForAlly(ally: any) {
            // * the idea here is to filter by hero name
            let heroesSynergiesForAlly = this.heroSuggestions.filter(
                (heroSuggestion: any) => {

                    for (const property in (heroSuggestion as Hero).winRatePerDuo) {
                        if (property === (ally as Hero).name) {
                            return (true);
                        }
                    }
                    return (false);
                }
            );

            return (heroesSynergiesForAlly);
        }
    },
    components: { HeroInfoPopover, HeroSuggestions }
});

</script>