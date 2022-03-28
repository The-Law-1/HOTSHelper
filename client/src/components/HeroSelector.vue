<template>
    <div class="pt-10">
        <!-- // * if you want to stop moving the whole page, set a max height but then z-index issues -->
        <div class="w-72 max-h-12">

            <Combobox v-model="selectedHero">
                <div
                    class="
                        w-full
                        relative
                    "
                >

                    <ComboboxInput
                        class="
                            w-full
                            relative
                            duration-100
                            focus:border-b-2
                            focus:border-cyan-300
                            focus:outline-none
                            rounded
                            z-0
                        "
                        :displayValue="(hero : any) => (heroesLoaded ? hero.name : '')"
                        @change="(evt) => updateQuery(evt.target.value)"
                    />
                </div>
                <ComboboxOptions
                    class="
                        w-72
                        absolute
                        z-10
                        bg-white
                        rounded-md
                        shadow-lg
                        max-h-60
                        overflow-auto
                        focus:outline-none
                        ring-1 ring-black ring-opacity-5
                    "
                >
                    <ComboboxOption
                        v-for="hero in filteredHeroes"
                        as="template"
                        :key="hero.name"
                        :value="hero"
                        v-slot="{ active, activeOption }"
                    >
                        <div>
                            <li
                                :class="{
                                    'bg-blue-500 text-white': active,
                                    'text-gray-900': !active
                                }">

                                {{ hero.name }}
                                <span v-if="active">
                                    <img class=" inline rounded-full w-12" :src="hero.portraitUrl"/>
                                </span>
                            </li>
                        </div>
                    </ComboboxOption>
                </ComboboxOptions>
                <span v-if="selectedHero && heroesLoaded">
                    <HeroInfoPopover :heroData="selectedHero"/>
                    <!-- <img class="inline rounded-full w-12" :src="selectedHero.portraitUrl"/> -->
                </span>
            </Combobox>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import HeroInfoPopover from "./HeroInfoPopover.vue";
import { Hero } from "../entities/hero";

export default defineComponent({
    components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    HeroInfoPopover
},
    props: {
        heroes : {
            type: Array,
            required: true
        },
        heroesLoaded : {
            type: Boolean,
            required: true
        }
    },
    data: function () {
        return {
            selectedHero: Hero,
            query: "" as string
        }
    },
    computed: {
        filteredHeroes() : Array<Hero> {
            let filteredHeroes = this.query === ""
                                ? this.heroes
                                : this.heroes.filter((hero) => {
                                    let heroName = (hero as Hero).name.toLowerCase().replace(/[. \']/g, "");
                                    return (heroName.includes(this.query.toLowerCase()))
                                });
            return (filteredHeroes as Array<Hero>);
        }
    },
    watch: {
        selectedHero(val: Hero, oldVal : Hero) {
            console.log(`Selected hero went from ${oldVal.name} to ${val.name}`);
            this.$emit("heroSelected", val.name);
        }
    },
    methods: {
        updateQuery(value : string) {
            this.query = value;
        }
    },
    created: async function () {
    }
})
</script>