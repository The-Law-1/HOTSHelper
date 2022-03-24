<template>
    <div>
        <!-- good choices -->
        <div class="flex">
            Strong choices
            <div v-for="(hero, index) in heroSuggestions">
                <HeroInfoPopover v-if="index < heroSuggestions.length / 2" :key="index" :hero-data="(hero as any)"/>
            </div>
        </div>
        <!-- bad choices -->
        <div class="flex">
            Weak choices
            <div v-for="(hero, index) in heroSuggestions">
                <HeroInfoPopover v-if="index >= heroSuggestions.length / 2" :key="index" :hero-data="(hero as any)"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeroInfoPopover from "./HeroInfoPopover.vue";

export default defineComponent({
    props: {
        heroSuggestions: {
            type: Array,
            required: true
        }
    },
    components: { HeroInfoPopover }
});

</script>