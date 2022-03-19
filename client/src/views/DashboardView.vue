<style>

</style>

<template>
    <div class="text-center w-[100%] content-center">
        <!-- // todo this will need to emit an event with the map's name so we can send to server -->
        <MapSelection/>


        <div
            class="
                pt-10
                flex
                justify-between
            "
        >
            <!-- // todo the team builders will probably emit events to build the request body -->
            <TeamBuilder/>
            <div>
                Hero choices
            </div>
            <TeamBuilder/>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import HelloWorldButtonVue from "../components/HelloWorldButton.vue";
    import MapSelection from "../components/MapSelection.vue";
    import TeamBuilder from "../components/TeamBuilder.vue";

    export default defineComponent({
        components: {
    HelloWorldButtonVue,
    MapSelection,
    TeamBuilder
},
        data: function () {
            return {

            }
        },
        computed: {

        },
        methods: {

        },
        created: async function () {
        }
    })
</script>