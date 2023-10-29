<script setup lang="ts">

import { useAuth } from '~/components/stores/useAuth';

const auth = useAuth();
auth.logout();

</script>

<template>
	Logout
</template>

<style scoped>

</style>