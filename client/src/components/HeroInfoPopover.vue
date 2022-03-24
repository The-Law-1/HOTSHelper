<template>
    <Popover class="relative">
        <PopoverButton ref="popoverbtn" @mouseenter="() => triggerPopover()">
            <img class="inline rounded-full w-12" :src="heroData.portraitUrl"/>
        </PopoverButton>

        <!-- <PopoverOverlay class="bg-purple-600 opacity-50 fixed inset-0"/> -->

        <PopoverPanel class="z-10 bg-purple-600">
            <ul>
                <li>
                    Role: {{ heroData.role }}
                </li>
                <li>
                    Overall winrate: {{ heroData.winRate }}
                </li>
                <li>
                    Games played: {{ heroData.gamesPlayed }}
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