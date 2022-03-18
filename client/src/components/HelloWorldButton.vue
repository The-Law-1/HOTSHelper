<template>
    <button @click="() => GetGreeting()">
        Get hello
    </button>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "HelloWorld",
        methods: {
            async GetGreeting() {
                console.log("Getting greeting from server");
            }
        }
    })

</script>