<template lang="pug">
  .Transactions
    .Transactions__operations(v-if="!isConnecting")
      button.Transactions__operation(
        v-for="({ type, name }) in buttons"
        :class="`Transactions__operation--${type}`"
        @click="processButton(type)"
      )
        | {{ name }}
    .Transactions__content
      .Transactions__loaderContainer(v-if="isConnecting")
        .Transactions__loader
        .Transactions__loaderText
          | Идет соединение с сервером, подождите...
      .Transactions__error(v-else-if="error")
        | {{ `Произошла ошибка подключения. ${error}` }}
      template(v-else-if="isSocketInitialized")
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
      .Transactions__waitText(v-else)
        | Для получения информации нажмите кнопку 'Запуск'
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ACTIONS, MUTATIONS } from "../../bootstrap/store/actionsMutations";
import { ITransactionPanelOperations } from "../../interfaces/iTransactions";
import { ITransactionsState } from "../../bootstrap/store/modules/transactions";
import InfoRecord from "./elements/InfoRecord";


const transactionsModule = namespace('transactions');

@Component({
  components: { InfoRecord }
})
export default class Transactions extends Vue {
  isConnecting: boolean = false;
  @transactionsModule.State isSocketInitialized!: ITransactionsState['isSocketInitialized'];
  @transactionsModule.State transactionsData!: ITransactionsState['transactionsData'];
  @transactionsModule.State error!: ITransactionsState['error'];
  @transactionsModule.Action(ACTIONS.TRANSACTIONS.INIT_SOCKET) initSocket!: Function;
  @transactionsModule.Action(ACTIONS.TRANSACTIONS.DISCONNECT_FROM_SOCKET) disconnectFromSocket!: Function;
  @transactionsModule.Mutation(MUTATIONS.TRANSACTIONS.RESET_LIST) resetList!: Function;
  @transactionsModule.Getter transactionsTotalAmount! : Function;

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
    let displayedButtons = Object.keys(BUTTONS_NAMES);
    if (!this.isSocketInitialized) {
      displayedButtons = displayedButtons.filter(button => button === 'connect')
    }
    return displayedButtons.map(key => ({ type: key, name: BUTTONS_NAMES[key as keyof typeof BUTTONS_NAMES] }));
  }

  get headerCells() {
    return ['Отправитель', 'Получатель', 'Сумма'];
  }
}
</script>

<style lang="sass">
@keyframes rotate
  0%
    transform: rotate(0deg)
  50%
    transform: rotate(180deg)
  100%
    transform: rotate(360deg)

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
    border-radius: 10px
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
    height: 100%
  &__loaderContainer
    display: flex
    justify-content: center
    align-items: center
    height: 100%
  &__loader
    width: 200px
    height: 200px
    border: 5px solid green
    border-radius: 50%
    border-right: none
    border-top: none
    animation: rotate 2s infinite
    position: absolute
  &__loaderText
    flex-basis: 10%
    text-align: center
    font-size: 24px
    font-weight: 600
  &__error
    color: crimson
    text-align: center
    font-size: 20px
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
  &__waitText
    font-size: 20px
    text-align: center
</style>
