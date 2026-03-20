<script setup>
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
</script>

<template>
  <TresCanvas clear-color="#6077EA" window-size>
    <TresPerspectiveCamera :position="[0, 2, 5]" />
    <OrbitControls />

    <TresMesh :position="[0, 0.5, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="#FF4893" />
    </TresMesh>

    <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
      <TresPlaneGeometry :args="[10, 10]" />
    </TresMesh>

    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight :position="[3, 5, 2]" :intensity="1" />
  </TresCanvas>
</template>
