<template lang="pug">
  .App
    .App__navigation
      RouterLink.App__navLink(
        v-for="({ path, name }) in routes"
        :key="path"
        :to="path"
        activeClass="App__navLink--active"
      )
        | {{ name }}
    .App__content
      RouterView
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ROUTES } from "../constants";


@Component
export default class App extends Vue {
  mounted(): void {
    window.VUE = this.$root;
  }

  get routes() {
    return Object.keys(ROUTES).map(key => ROUTES[key]);
  }
}
</script>

<style lang="sass">
  body
    width: 100vw
    height: 100vh
    margin: 0

  .App
    display: flex
    flex-direction: column
    height: 100%
    justify-content: center
    align-items: center
    &__content
      display: flex
      height: 90vh
      max-height: 90vh
      width: 100%
      justify-content: center
      & > div
        width: 100%
    &__navigation
      display: flex
      min-height: 10vh
      justify-content: center
      align-items: center
      width: 100%
    &__navLink
      display: flex
      width: 20vw
      height: 3vw
      border: 1px solid aqua
      cursor: pointer
      justify-content: center
      align-items: center
      color: black
      text-decoration: none
      background-color: lightblue
      font-size: 18px
      font-weight: 600
      &:not(:last-child)
        margin-right: 5vw
      &--active
        background-color: lightsteelblue
</style>
