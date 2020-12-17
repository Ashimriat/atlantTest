<template functional lang="pug">
  .InfoRecord
    .InfoRecord__cell
      | {{ props.from }}
    .InfoRecord__cell
      | {{ props.to }}
    .InfoRecord__cell
      | {{ `${props.amount} BTC` }}
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";


@Component
export default class InfoRecord extends Vue {
  @Prop() readonly from!: string;
  @Prop() readonly to!: string;
  @Prop() readonly amount!: number;
}
</script>

<style lang="sass">
  .InfoRecord
    display: flex
    height: 3vh
    &__cell
      flex-basis: calc(100% / 3)
      border: 1px solid black
      border-right: none
      display: flex
      justify-content: center
      align-items: center
      &:last-child
        border-right: 1px solid black
</style>
