<style>

</style>

<template>
    <div class="text-center">
        <div class="pt-10">

            <!-- <input
                class="
                    duration-100
                    focus:border-b-2
                    focus:border-cyan-300
                    focus:outline-none
                    rounded
                   "
                placeholder="Search for a map"> -->
                <!-- // * cf https://headlessui.dev/vue/combobox -->
            <Combobox>
                <ComboboxInput />
                <ComboboxOptions>
                    <ComboboxOption>
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
        }
    })
</script>