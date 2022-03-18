<template>
    <div>
        <div>
            Howdy
        </div>
        <div class="underline">
            Styled howdy
        </div>
        <HelloWorldButtonVue/>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import HelloWorldButtonVue from "../components/HelloWorldButton.vue";

    export default defineComponent({
        components: {
            HelloWorldButtonVue
        }
    })
</script>