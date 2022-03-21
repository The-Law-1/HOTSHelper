<template>
    <div>
        <HeroSelector :heroes="heroes"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import HeroSelector from "./HeroSelector.vue"

export default defineComponent({
    components: { HeroSelector },
    props: {
        heroes : {
            type: Array,
            required: true
        }
    }
})
</script>