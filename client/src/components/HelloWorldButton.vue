<template>
    <button class="bg-blue-500" @click="() => GetGreeting()">
        Get hello
    </button>
    <br/>
    <button class="bg-blue-600" @click="() => GetCats()">
        Get cats
    </button>
    <br/>
    <button class="bg-blue-700" @click="() => GetHeroesForMap()">
        Get heroes for map
    </button>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import {getCats} from '../api/cats';
    import {getHeroesForMap} from '../api/heroes';

    export default defineComponent({
        name: "HelloWorld",
        methods: {
            async GetGreeting() {
                console.log("Getting greeting from server");
            },
            async GetCats() {
                let catsResult = await getCats();

                console.log(catsResult);
            },
            async GetHeroesForMap() {
                let queryParams = {
                    name: "Alterac Pass",
                    minSampleSize: 35,
                    selectionRange: 8
                }
                let heroesList = await getHeroesForMap(queryParams);

                console.log("Got result ", heroesList);
            }
        }
    })

</script>