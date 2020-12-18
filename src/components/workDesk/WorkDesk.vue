<template lang="pug">
    .WorkDesk(
      ref="workdesk"
      @mouseup="saveData"
      @mousemove="processMouseMove"
      @mouseleave="saveData"
    )
      Tile(
        v-for="({ width, height, top, left, zIndex, isDisplayed }, index) in tiles"
        :key="index"
        :width="index === editedTileIndex ? editedTile.width : width"
        :height="index === editedTileIndex ? editedTile.height : height"
        :top="index === editedTileIndex ? editedTile.top : top"
        :left="index === editedTileIndex ? editedTile.left : left"
        :deskSizes="deskSizes"
        :zIndex="index === editedTileIndex ? editedTile.zIndex : zIndex"
        :isDisplayed="isDisplayed"
        :isEdited="editedTileIndex === index"
        :tileIndex="index"
        @editing="setEditedTileData"
        @moving="moveTile"
        @deleting="deleteTile"
      )
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Tile from "./elements/Tile";
import { ITile } from '../../bootstrap/store/modules/workDesk';
import { MUTATIONS } from "../../bootstrap/store/actionsMutations";
import MoveResizeService from "./moveResizeService";


const workDeskModule = namespace('workDesk');

@Component({
  components: { Tile }
})
export default class WorkDesk extends Vue {
  @Ref() readonly workdesk!;
  @workDeskModule.State tiles!: ITile[];
  @workDeskModule.Mutation(MUTATIONS.WORKDESK.CHANGE_TILE_DATA) changeTileData!;
  @workDeskModule.Mutation(MUTATIONS.WORKDESK.REMOVE_TILE) removeTile!;
  @workDeskModule.Mutation(MUTATIONS.WORKDESK.GENERATE_TILE) generateTile!;

  editedTileIndex: number = -1;
  editedTile = null;
  editingData = {
    moveStartX: 0,
    moveStartY: 0,
    changeWidth: '',
    changeHeight: ''
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
      this.changeTileData({
        tileIndex: this.editedTileIndex,
        data: {
          width: this.editedTile.width,
          height: this.editedTile.height,
          top: this.editedTile.top,
          left: this.editedTile.left
        }
      });
    }
    this.resetEditingData();
  }

  setEditedTileData(index: number, moveStartCoords: { x: number, y: number }, widthChange?: string, heightChange?: string) {
    this.editedTileIndex = index;
    this.editedTile = {
      ...this.tiles[index],
      zIndex: 6
    };
    this.editingData = {
      moveStartX: moveStartCoords.x,
      moveStartY: moveStartCoords.y,
      changeWidth: widthChange || '',
      changeHeight: heightChange || ''
    };
  }

  resizeTile({ clientX, clientY }: Partial<MouseEvent>): void {
    const { changeWidth, changeHeight } = this.editingData;
    const { offsetLeft: deskOffsetLeft, offsetTop: deskOffsetTop } = (this.$refs.workdesk as HTMLElement);
    const {
      newCoords: { left, top },
      newSizes: { width, height },
      newMoveStartCoords: { moveStartX, moveStartY }
    } = MoveResizeService.getResizeNewSizesAndCoords(
      { x: !!changeWidth, y: !!changeHeight, standardX: changeWidth === 'E', standardY: changeHeight === 'S' },
      { width: 300, height: 100 },
      this.editedTile,
      { ...this.deskSizes, left: deskOffsetLeft, top: deskOffsetTop },
      { x: clientX as number, y: clientY as number},
      { x: this.editingData.moveStartX, y: this.editingData.moveStartY }
    );
    this.editedTile = { ...this.editedTile, width, left, height, top };
    this.editingData = { ...this.editingData, moveStartX, moveStartY };
  }

  moveTile({ clientX, clientY }: Partial<MouseEvent>): void {
    const { offsetLeft: deskOffsetLeft, offsetTop: deskOffsetTop } = (this.$refs.workdesk as HTMLElement);
    const {
      newCoords: { left, top },
      newMoveStartCoords: { moveStartX, moveStartY }
    } = MoveResizeService.getMoveNewCoords(
      this.editedTile,
      { ...this.deskSizes, left: deskOffsetLeft, top: deskOffsetTop },
      { x: clientX as number, y: clientY as number},
      { x: this.editingData.moveStartX, y: this.editingData.moveStartY }
    );
    this.editedTile = { ...this.editedTile, left, top };
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
      changeHeight: ''
    };
  }

  get isResizing(): boolean {
    return !!this.editingData.changeWidth || !!this.editingData.changeHeight;
  }

  get deskSizes(): { width: number, height: number } {
    if (!this.isRefMounted) {
      return { width: 0, height: 0 };
    }
    const { width, height } = (this.$refs.workdesk as Element).getBoundingClientRect();
    return { width, height };
  }
}
</script>

<style lang="sass">
  .WorkDesk
    display: flex
    position: relative
    box-sizing: border-box
    max-width: 900px
    height: 650px
    border: 1px solid black
</style>
