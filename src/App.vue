<template>
  <div class="app">
    <Weather />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Weather from './components/Weather.vue'

@Component({
  components: {
    Weather
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
.app {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 150px;
}
</style>
