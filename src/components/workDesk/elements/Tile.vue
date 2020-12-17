<template lang="pug">
  .Tile(
    ref="tile"
    :class="[cursorTypeClass, isEdited && 'Tile--unselectable']"
    :style="tileStyles"
    @mousedown.self="processMouseDown"
    @mousemove.self="processMouseMove"
  )
    | {{ `Блок ${order}` }}
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import { isInRange } from "../../../utils";
import MoveResizeService from "../moveResizeService";


@Component
export default class Tile extends Vue {
  @Prop() readonly width!: number;
  @Prop() readonly height!: number;
  @Prop() readonly top!: number;
  @Prop() readonly left!: number;
  @Prop() readonly zIndex!: number;
  @Prop() readonly isDisplayed!: boolean;
  @Prop() readonly deskSizes!: { width: number, height: number };
  // @Prop({ default: { x: 0, y: 0 } }) readonly coords!: { x: number, y: number };
  @Prop({ default: 0 }) readonly order!: number;
  @Prop() readonly isEdited!: boolean;
  @Prop() readonly tileIndex!: number;
  @Ref() readonly tile!;

  cursorType: string = 'default';

  processMouseDown(e: MouseEvent) {
    const args: [number, { x: number, y: number}, string?] = [this.tileIndex, { x: e.clientX, y: e.clientY }];
    if (this.cursorType !== 'default') {
      const horizontalMatch = this.cursorType.match(/[WE]/);
      const verticalMatch = this.cursorType.match(/[NS]/);
      args.push(horizontalMatch ? horizontalMatch[0] : '');
      args.push(verticalMatch ? verticalMatch[0] : '');
    }
    this.$emit('editing', ...args);
  }

  processMouseMove(e: MouseEvent) {
    if (!this.isEdited) {
      this.cursorType = this.defineCursorType(e.offsetX, e.offsetY);
    }
  }

  defineCursorType(xOffset: number, yOffset: number): string {
    let xPoint = '',
        yPoint = '';
    if (xOffset < 20 && this.left) {
      xPoint = 'W';
    } else if (isInRange(xOffset, this.width - 20, this.width) && (this.left + this.width) < this.deskSizes.width) {
      xPoint = 'E';
    }
    if (yOffset < 20 && this.top) {
      yPoint = 'N';
    } else if (isInRange(yOffset, this.height - 20, this.height) && (this.top + this.height) < this.deskSizes.height) {
      yPoint = 'S';
    }
    const pointRes = yPoint + xPoint;
    return pointRes || 'default';
  }

  get cursorTypeClass(): string {
    if (this.cursorType === 'default') return 'Tile--move';
    return `Tile--resize${this.cursorType}`;
  }

  get tilePosition(): { top?: string, left?: string, right?: string, bottom?: string } {
    const { width, height, top, left, deskSizes, cursorType } = this;
    const horizontalMatch = cursorType.match(/[WE]/);
    const verticalMatch = cursorType.match(/[NS]/);
    return MoveResizeService.getInResizeElemCoords(
      { x: horizontalMatch && horizontalMatch[0] !== 'E', y: verticalMatch && verticalMatch[0] !== 'S' },
      { width, height, top, left},
      deskSizes,
      { x: 1, y: 1 },
    );
  }

  get tileStyles() {
    return {
      ...this.tilePosition,
      width: this.width + 'px',
      height: this.height + 'px',
      zIndex: this.zIndex,
      display: this.isDisplayed ? 'flex' : 'none'
    };
  }
}
</script>

<style lang="sass">
  .Tile
    flex-direction: column
    position: absolute
    border: 1px solid black
    box-sizing: border-box
    max-width: 100%
    max-height: 100%
    &--unselectable
      user-select: none
    &--move
      cursor: move
    &--resizeW
      cursor: w-resize
    &--resizeE
      cursor: e-resize
    &--resizeN
      cursor: n-resize
    &--resizeS
      cursor: s-resize
    &--resizeNW
      cursor: nw-resize
    &--resizeNE
      cursor: ne-resize
    &--resizeSW
      cursor: sw-resize
    &--resizeSE
      cursor: se-resize
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
</style>
