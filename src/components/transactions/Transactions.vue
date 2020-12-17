<template lang="pug">
  .Transactions
    .Transactions__operations
      button.Transactions__operation(v-for="({ type, name }) in buttons"
        :class="`Transactions__operation--${type}`"
        @click="processButton(type)"
      )
        | {{ name }}
    .Transactions__content
      .Transactions__loader(v-if="isConnecting")
      .Transactions__error(v-else-if="false")
      template(v-else)
        .Transactions__totalAmount
          | Общая сумма транзакций:&nbsp;
          span
            | {{ `${transactionsTotalAmount} BTC` }}
        .Transactions__tableHeader
          .Transactions__headerCell(
            v-for="cell in headerCells"
            :key="cell"
          )
            | {{ cell }}
        .Transactions__tableContent
          InfoRecord(
            v-for="({ from, to, amount }, index) in transactionsData"
            :key="index"
            :from="from"
            :to="to"
            :amount="amount"
          )
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ACTIONS, MUTATIONS } from "../../bootstrap/store/actionsMutations";
import { ITransactionPanelOperations } from "../../interfaces";
import { ITransactionsState } from "../../bootstrap/store/modules/transactions";
import InfoRecord from "./elements/InfoRecord";


const transactionsModule = namespace('transactions');

@Component({
  components: { InfoRecord }
})
export default class Transactions extends Vue {
  isConnecting: boolean = false;
  @transactionsModule.State transactionsData!: ITransactionsState['transactionsData'];
  @transactionsModule.State error!: ITransactionsState['error'];
  @transactionsModule.Action(ACTIONS.TRANSACTIONS.INIT_SOCKET) initSocket;
  @transactionsModule.Action(ACTIONS.TRANSACTIONS.DISCONNECT_FROM_SOCKET) disconnectFromSocket;
  @transactionsModule.Mutation(MUTATIONS.TRANSACTIONS.RESET_LIST) resetList;
  @transactionsModule.Getter transactionsTotalAmount;

  processButton(buttonType: ITransactionPanelOperations): void {
    this[buttonType]();
  }

  async connect(): Promise<void> {
    this.isConnecting = true;
    await this.initSocket();
    this.isConnecting = false;
  }

  disconnect(): void {
    if (this.isConnecting) return;
    this.disconnectFromSocket();
  }

  reset(): void {
    if (this.isConnecting) return;
    this.resetList();
  }

  get buttons() {
    const BUTTONS_NAMES = {
      connect: 'Запуск',
      disconnect: 'Остановка',
      reset: 'Сброс'
    };
    return Object.keys(BUTTONS_NAMES).map(key => ({ type: key, name: BUTTONS_NAMES[key] }));
  }

  get headerCells() {
    return ['Отправитель', 'Получатель', 'Сумма'];
  }
}
</script>

<style lang="sass">
  .Transactions
    display: flex
    flex-direction: column
    &__operations
      display: flex
      min-height: 7vh
      justify-content: center
      align-items: center
    &__operation
      display: flex
      width: 10vw
      height: 4vh
      justify-content: center
      align-items: center
      cursor: pointer
      font-size: 16px
      font-weight: 600
      &:not(:last-child)
        margin-right: 20px
      &:focus
        outline: none
      &--connect
        background-color: green
      &--disconnect
        background-color: yellow
      &--reset
        background-color: red
    &__content
      padding: 0 20px
      max-height: 91%
    &__totalAmount
      display: flex
      justify-content: center
      align-items: center
      font-size: 16px
      margin-bottom: 10px
      & > span
        font-weight: 600
    &__tableHeader
      display: flex
      justify-content: space-around
      height: 4vh
    &__tableContent
      overflow-y: scroll
      max-height: 90%
    &__headerCell
      flex-basis: calc(100% / 3)
      justify-content: center
      align-items: center
      display: flex
      font-weight: 600
      font-size: 16px
      background-color: lightgray
      border: 1px solid black
      border-right: none
      &:last-child
        border-right: 1px solid black
</style>
