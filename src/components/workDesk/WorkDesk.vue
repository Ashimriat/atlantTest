<template lang="pug">
  .WorkDesk
    button.WorkDesk__newTileButton(
      :class="{ 'WorkDesk__newTileButton--hidden': isMaximumTilesAmount }"
      @click="generateTile"
    )
      | Сгенерировать блок
    .WorkDesk__desk(
      ref="workdesk"
      :style="{ width: deskSizes.width + 'px', height: deskSizes.height + 'px' }"
      @mouseup="saveData"
      @mousemove="processMouseMove"
      @mouseleave="saveData"
    )
      Tile(
        v-for="({ width, height, top, left, zIndex, order }, index) in tiles"
        :key="index"
        :width="index === editedTileIndex ? editedTile.width : width"
        :height="index === editedTileIndex ? editedTile.height : height"
        :top="index === editedTileIndex ? editedTile.top : top"
        :left="index === editedTileIndex ? editedTile.left : left"
        :deskSizes="deskSizes"
        :zIndex="index === editedTileIndex ? editedTile.zIndex : zIndex"
        :isEdited="editedTileIndex === index"
        :tileIndex="index"
        :order="order"
        @editing="setEditedTileData"
        @moving="moveTile"
        @deleting="deleteTile"
      )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Tile from "./elements/Tile";
import { ICoords, ISizes, ICoordsAndSizes, ITile } from "../../interfaces/iWorkDesk";
import { ACTIONS } from "../../bootstrap/store/actionsMutations";
import MoveResizeService from "../../services/moveResizeService";
import CONFIG from '../../config';


const workDeskModule = namespace('workDesk');

@Component({
  components: { Tile }
})
export default class WorkDesk extends Vue {
  @Ref() readonly workdesk!: HTMLElement;
  @workDeskModule.State tiles!: ITile[];
  @workDeskModule.Action(ACTIONS.WORKDESK.CHANGE_TILE) changeTile!: Function;
  @workDeskModule.Action(ACTIONS.WORKDESK.REMOVE_TILE) removeTile!: Function;
  @workDeskModule.Action(ACTIONS.WORKDESK.GENERATE_TILE) generateTile!: Function;

  editedTileIndex: number = -1;
  editedTile: null | ITile = null;
  editingData = {
    moveStartX: 0,
    moveStartY: 0,
    changeWidth: '',
    changeHeight: '',
    sideX: '',
    sideY: ''
  };
  isRefMounted: boolean = false;

  mounted(): void {
    // Попытка вызвать getBoundingClientRect() на рефе до маунту приводит к ошибке
    this.isRefMounted = true;
  }

  processMouseMove(e: MouseEvent): void {
    if (!this.editedTile) return;
    if (this.isResizing) {
      this.resizeTile(e);
    } else {
      this.moveTile(e);
    }
  }

  saveData(): void {
    if (this.editedTile) {
      const { width, height, top, left } = this.editedTile;
      this.changeTile({
        tileIndex: this.editedTileIndex,
        data: { width, height, top, left }
      });
    }
    this.resetEditingData();
  }

  setEditedTileData(index: number, moveStartCoords: ICoords, resizeAllowance: { width: string, height: string, xSide: string, ySide: string }): void {
    this.editedTileIndex = index;
    this.editedTile = {
      ...this.tiles[index],
      zIndex: 6
    };
    this.editingData = {
      moveStartX: moveStartCoords.x,
      moveStartY: moveStartCoords.y,
      changeWidth: resizeAllowance?.width || '',
      changeHeight: resizeAllowance?.height || '',
      sideX: resizeAllowance?.xSide || '',
      sideY: resizeAllowance?.ySide || ''
    };
  }

  resizeTile({ clientX, clientY }: MouseEvent): void {
    const { changeWidth, changeHeight, sideX, sideY } = this.editingData;
    const { offsetLeft: deskOffsetLeft, offsetTop: deskOffsetTop } = this.workdesk;
    const {
      newCoords: { x: left, y: top },
      newSizes: { width, height },
      newMoveStartCoords: { x: moveStartX, y: moveStartY }
    } = MoveResizeService.getResizeNewSizesAndCoords(
      { x: !!changeWidth, y: !!changeHeight, farSideX: sideX === 'E', farSideY: sideY === 'S' },
      { width: 300, height: 100 },
      this.editedTile as ICoordsAndSizes,
      { ...this.deskSizes, left: deskOffsetLeft, top: deskOffsetTop },
      { x: clientX as number, y: clientY as number},
      { x: this.editingData.moveStartX, y: this.editingData.moveStartY }
    );
    this.editedTile = { ...this.editedTile as ITile, width, left, height, top };
    this.editingData = { ...this.editingData, moveStartX, moveStartY };
  }

  moveTile({ clientX, clientY }: MouseEvent): void {
    const { offsetLeft: deskOffsetLeft, offsetTop: deskOffsetTop } = this.workdesk;
    const {
      newCoords: { x: left, y: top },
      newMoveStartCoords: { x: moveStartX, y: moveStartY }
    } = MoveResizeService.getMoveNewCoords(
      this.editedTile as ICoordsAndSizes,
      { ...this.deskSizes, left: deskOffsetLeft, top: deskOffsetTop },
      { x: clientX as number, y: clientY as number},
      { x: this.editingData.moveStartX, y: this.editingData.moveStartY }
    );
    this.editedTile = { ...this.editedTile as ITile, left, top };
    this.editingData = { ...this.editingData, moveStartX, moveStartY };
  }

  deleteTile(tileIndex: number): void {
    this.removeTile(tileIndex);
  }

  resetEditingData(): void {
    this.editedTileIndex = -1;
    this.editedTile = null;
    this.editingData = {
      moveStartX: 0,
      moveStartY: 0,
      changeWidth: '',
      changeHeight: '',
      sideX: '',
      sideY: ''
    };
  }

  get isResizing(): boolean {
    return !!this.editingData.changeWidth || !!this.editingData.changeHeight;
  }

  get deskSizes(): ISizes {
    return CONFIG.WORKDESK_SIZES
  }

  get isMaximumTilesAmount(): boolean {
    return this.tiles.length === CONFIG.MAX_TILES_AMOUNT;
  }
}
</script>

<style lang="sass">
  .WorkDesk
    display: flex
    justify-content: space-evenly
    align-items: center
    flex-direction: column
    &__newTileButton
      cursor: pointer
      width: 200px
      height: 50px
      &--hidden
        visibility: hidden
    &__desk
      display: flex
      position: relative
      box-sizing: border-box
      border: 1px solid black
</style>
