<template>
    <div class="pt-10 flex justify-center items-center">
        <!-- // * cf https://headlessui.dev/vue/combobox -->
        <div class="w-72">

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
                        "
                        :displayValue="(hero : any) => (hero.name as string)"
                        @change="(evt) => updateQuery(evt.target.value)"
                    />
                </div>
                <ComboboxOptions
                    class="
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
                        :value="hero.name"
                        v-slot="{ active }"
                    >
                        <li
                            :class="{
                                'bg-blue-500 text-white': active,
                                'text-gray-900': !active
                            }">

                            {{ hero.name }}
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>

        </Combobox>
        </div>

    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import { getHeroes } from "../api/heroes";

export default defineComponent({
    components: {
        Combobox,
        ComboboxInput,
        ComboboxOptions,
        ComboboxOption
    },
    props: {
        heroes : {
            type: Array,
            required: true
        }
    },
    data: function () {
        return {
            selectedHero: "" as string,
            query: "" as string
        }
    },
    computed: {
        filteredHeroes() : Array<any> {
            let filteredHeroes = this.query === ""
                                ? this.heroes
                                : this.heroes.filter((hero:any) => hero.name.toLowerCase().includes(this.query.toLowerCase()))

            // todo include some lenience for ('. ) in names

            return (filteredHeroes);
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