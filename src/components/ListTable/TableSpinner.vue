<script setup lang='ts'>
import { mdiGoogleCirclesExtended } from '@/assets/svg/iconPath';

</script>
<script lang='ts'> export default { name: 'TableSpinner' };</script>
<template>
  <div class="spinner-wrap">
    <div class="spinner">
      <SvgIcon
        type="mdi"
        size="3.6rem"
        :path="mdiGoogleCirclesExtended"
      />
    </div>
  </div>
</template>