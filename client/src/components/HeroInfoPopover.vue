<template>
    <Popover class="relative" v-slot="{ open }">
        <!-- <PopoverButton ref="popoverbtn" @mouseenter="() => triggerPopover()"> -->
        <PopoverButton ref="popoverbtn">

            <!-- // todo if winrate < 50 red color outline -->
            <img :class="open ? 'w-12' : 'w-12'" class="inline rounded-full" :src="heroData.portraitUrl"/>
        </PopoverButton>

        <!-- <PopoverOverlay class="bg-purple-600 opacity-50 fixed inset-0"/> -->

        <PopoverPanel class="absolute border-black border-2 z-10 w-72 bg-purple-300">
            <ul>
                <li>
                    {{ heroData.name }}
                </li>
                <li>
                    <u>Role</u>: {{ heroData.role }}
                </li>
                <!-- // todo if winrate < 50 red color text -->
                <li>
                    <u>Overall winrate</u>: {{ heroData.winRate }}%
                </li>
                <li>
                    <u>Games played</u>: {{ heroData.gamesPlayed }}
                </li>
                <li v-if="heroData.winRatePerMap !== {}">
                    <div v-for="(winRate, mapName, index) in heroData.winRatePerMap">
                        <u>{{ mapName }} win % </u>: {{ winRate }} %
                    </div>
                </li>
                <li v-if="heroData.winRatePerDuo !== {}">
                    <div v-for="(winRate, heroName, index) in heroData.winRatePerDuo">
                        <u>win % with {{ heroName }} </u>: {{ winRate }} %
                    </div>
                </li>
                <li v-if="heroData.winRatePerMatchup !== {}">
                    <div v-for="(winRate, heroName, index) in heroData.winRatePerMatchup">
                        <u>win % against {{ heroName }}</u> : {{ winRate }} %
                    </div>
                </li>
            </ul>

        </PopoverPanel>

    </Popover>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue'

export default defineComponent({
    components: {
        Popover, PopoverButton, PopoverPanel, PopoverOverlay
    },
    props: {
        heroData: {
            type: Object,
            required: true
        }
    },
    methods: {
        triggerPopover() {
            const elem : any = this.$refs.popoverbtn;
            elem.$el.click();
        }
    }
});
</script>