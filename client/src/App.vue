<script setup lang="ts">
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    import DashboardView from './views/DashboardView.vue';
    import Title from './layouts/Title.vue';

</script>

<template>
    <div>
        <Title>
            <DashboardView/>
        </Title>
    </div>
</template>