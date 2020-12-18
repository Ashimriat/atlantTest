<template lang="pug">
  .Tile(
    ref="tile"
    :class="[isEdited && 'Tile--unselectable', `Tile--${tileIndex + 1}`]"
    :style="{ ...tileStyles, ...cursorStyle }"
    @mousedown.self="processMouseDown"
    @mousemove.self="processMouseMove"
  )
    | {{ `Блок ${tileIndex + 1}` }}
    .Tile__deleteIcon(@click="$emit('deleting', tileIndex)")
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import MoveResizeService from "../moveResizeService";
import {ICoords, ISizes, IResizeElemCoordsStyles, ITileStyles, ITileCursorType, IAxisDirections} from "../../../interfaces/iWorkDesk";


@Component
export default class Tile extends Vue {
  @Prop() readonly width!: number;
  @Prop() readonly height!: number;
  @Prop() readonly top!: number;
  @Prop() readonly left!: number;
  @Prop() readonly zIndex!: number;
  @Prop() readonly isDisplayed!: boolean;
  @Prop() readonly deskSizes!: ISizes;
  @Prop() readonly isEdited!: boolean;
  @Prop() readonly tileIndex!: number;
  @Ref() readonly tile!: HTMLElement;

  resizeDirection: ITileCursorType = 'default';
  isResizableInBothSides = { x: false, y: false };

  processMouseDown({ clientX, clientY }: MouseEvent): void {
    const args: [number, ICoords, string?] = [this.tileIndex, { x: clientX, y: clientY }];
    if (this.resizeDirection !== 'default') {
      const horizontalMatch = this.resizeDirection.match(/[WE]/);
      const verticalMatch = this.resizeDirection.match(/[NS]/);
      args.push(horizontalMatch ? horizontalMatch[0] : '');
      args.push(verticalMatch ? verticalMatch[0] : '');
    }
    this.$emit('editing', ...args);
  }

  processMouseMove({ offsetX, offsetY }: MouseEvent): void {
    if (this.isEdited) return;
    const { width, height, left, top, deskSizes } = this;
    const { resizeDirection, isResizableInBothSides } = MoveResizeService.getElemResizeDirectionAndCursorType(
      { x: offsetX, y: offsetY },
      { width, height, left, top },
      deskSizes
    );
    this.resizeDirection = ((resizeDirection || 'default') as ITileCursorType);
    console.log("RESIZE DIRECTION: ", resizeDirection);
    this.isResizableInBothSides = isResizableInBothSides;
    console.log("RESIZE ON BOTH: ", isResizableInBothSides);
  }

  get cursorStyle(): { cursor: string } {
    let cursor;
    if (this.resizeDirection === 'default') {
      cursor = 'move'
    } else if (!this.resizeDirection.match(/[N|S]/) && this.isResizableInBothSides.x) {
      cursor = 'ew-resize';
    } else if (!this.resizeDirection.match(/[W|E]/) && this.isResizableInBothSides.y) {
      cursor = 'ns-resize';
    } else {
      cursor = `${this.resizeDirection}-resize`;
    }
    return { cursor };
  }

  get tilePosition(): IResizeElemCoordsStyles {
    const { width, height, top, left, deskSizes, resizeDirection } = this;
    const horizontalMatch = resizeDirection.match(/[WE]/);
    const verticalMatch = resizeDirection.match(/[NS]/);
    return MoveResizeService.getInResizeElemCoords(
      { x: !!(horizontalMatch && horizontalMatch[0] !== 'E'), y: !!(verticalMatch && verticalMatch[0] !== 'S') },
      { width, height, top, left},
      deskSizes,
      { x: 1, y: 1 },
    );
  }

  get tileStyles(): ITileStyles {
    return {
      ...this.tilePosition,
      width: this.width + 'px',
      height: this.height + 'px',
      zIndex: this.zIndex,
    };
  }
}
</script>

<style lang="sass">
  .Tile
    display: flex
    position: absolute
    border: 1px solid black
    box-sizing: border-box
    max-width: 100%
    max-height: 100%
    padding: 15px
    &--1
      background-color: aquamarine
    &--2
      background-color: bisque
    &--3
      background-color: cadetblue
    &--4
      background-color: crimson
    &--5
      background-color: chocolate
    &--unselectable
      user-select: none
    &__head
      display: flex
      border: 1px solid black
      border-bottom: none
      height: 30px
      justify-content: center
      align-items: center
    &__content
      display: flex
      border: 1px solid black
      height: 100%
    &__deleteIcon
      position: absolute
      top: 20px
      right: 25px
      &::before, &::after
        content: ''
        position: absolute
        width: 10px
        height: 2px
        background-color: black
        cursor: pointer
      &::before
        transform: rotate(45deg)
      &::after
        transform: rotate(-45deg)
</style>
