<template>
    <div class="pt-10 flex justify-center items-center">
        <!-- // * cf https://headlessui.dev/vue/combobox -->
        <div class="w-72 h-16">
            Select a map:

            <Combobox v-model="selectedMap">
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
                        :displayValue="(mapName) => (mapName as string)"
                        @change="(evt) => updateQuery(evt.target.value)"
                    />
                </div>
                <ComboboxOptions
                    class="
                        z-20
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
                        v-for="mapName in filteredMaps"
                        as="template"
                        :key="mapName"
                        :value="mapName"
                        v-slot="{ active }"
                    >
                        <li
                            :class="{
                                'bg-blue-500 text-white': active,
                                'text-gray-900': !active
                            }">

                            {{ mapName }}
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>

        </Combobox>
        </div>

    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import HelloWorldButtonVue from "../components/HelloWorldButton.vue";

import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";

export default defineComponent({
    components: {
        HelloWorldButtonVue,
        Combobox,
        ComboboxInput,
        ComboboxOptions,
        ComboboxOption
    },
    data: function () {
        return {
            selectedMap: "Alterac Pass" as string,
            query: "" as string,
            maps: [
                "Alterac Pass",
                "Garden Of Terror",
                "Hanamura Temple",
                "Volskaya Foundry",
                "Towers Of Doom",
                "Infernal Shrines",
                "Battlefield Of Eternity",
                "Tomb Of The Spider Queen",
                "Sky Temple",
                "Blackheart's Bay",
                "Dragon Shire",
                "Cursed Hollow",
                "Braxis Holdout",
                "Warhead Junction"
            ] as Array<string>
        }
    },
    watch: {
        selectedMap: function() {
            // todo emit an event here
            this.$emit("mapUpdated", this.selectedMap);
        }
    },
    computed: {
        filteredMaps() : Array<string> {
            let filteredMaps = this.query === ""
                            ? this.maps
                            : this.maps.filter((map:string) => map.toLowerCase().includes(this.query.toLowerCase()))

            return (filteredMaps);
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