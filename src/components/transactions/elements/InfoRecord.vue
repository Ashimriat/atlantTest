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
import { ITransactionData } from "../../../interfaces/iTransactions";


@Component
export default class InfoRecord extends Vue {
  @Prop() readonly from!: ITransactionData['from'];
  @Prop() readonly to!: ITransactionData['to'];
  @Prop() readonly amount!: ITransactionData['amount'];
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
