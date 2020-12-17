import { isInRange } from "../../utils";


type IAxisMoveCoords = { newAxisCoord: number, newAxisMoveStartCoord: number };
type IAxisResizeSizeAndCoords = { newAxisSize: number, newAxisCoord: number, newAxisMoveStartCoord: number };
type IAxisElemCoordInResize = { [newAxisFixedSide: string]: string; }

export default class MoveResizeService {
  static #getAxisMoveNewCoords(
    elemAxisBorderCoord: number,
    elemAxisSize: number,
    parentAxisBorderCoord: number,
    parentAxisSize: number,
    axisMouseCoord: number,
    axisMoveStartCoord: number
  ): IAxisMoveCoords {
    const res = { newAxisCoord: elemAxisBorderCoord, newAxisMoveStartCoord: axisMoveStartCoord };
    const moveCoordChange = axisMouseCoord - axisMoveStartCoord;
    const factCoordChange = Math.sign(moveCoordChange) * 10;
    const isNotOutOfAxisParentBorders = isInRange(
      elemAxisBorderCoord + factCoordChange + parentAxisBorderCoord,
      parentAxisBorderCoord,
      parentAxisBorderCoord + parentAxisSize - elemAxisSize
    );
    if (Math.abs(moveCoordChange) >= 10 && isNotOutOfAxisParentBorders) {
      res.newAxisCoord += factCoordChange;
      res.newAxisMoveStartCoord += factCoordChange;
    }
    return res;
  };

  static getMoveNewCoords(elemData, parentData, mouseCoords, moveStartCoords) {
    const { top: elemY, left: elemX, width: elemWidth, height: elemHeight } = elemData;
    const { top: parentY, left: parentX, width: parentWidth, height: parentHeight } = parentData;
    const { x: mouseX, y: mouseY } = mouseCoords;
    const { x: startX, y: startY } = moveStartCoords;
    const {
      newAxisCoord: newLeft,
      newAxisMoveStartCoord: newMoveStartX
    } = MoveResizeService.#getAxisMoveNewCoords(elemX, elemWidth, parentX, parentWidth, mouseX, startX);
    const {
      newAxisCoord: newTop,
      newAxisMoveStartCoord: newMoveStartY
    } = MoveResizeService.#getAxisMoveNewCoords(elemY, elemHeight, parentY, parentHeight, mouseY, startY);
    return {
      newCoords: {
        left: newLeft,
        top: newTop
      },
      newMoveStartCoords: {
        moveStartX: newMoveStartX,
        moveStartY: newMoveStartY
      }
    }
  }

  static #getAxisResizeNewSizeAndCoords(
    isChangeOnAxisAllowed: boolean,
    isResizingInStandardAxisDirection: boolean,
    minAxisSize: number,
    axisMouseCoord: number,
    axisMoveStartCoord: number,
    elemAxisSize: number,
    elemAxisCoord: number,
    parentAxisBorderCoord: number,
    parensAxisSize: number
  ): IAxisResizeSizeAndCoords {
    const res = { newAxisSize: elemAxisSize, newAxisCoord: elemAxisCoord, newAxisMoveStartCoord: axisMoveStartCoord };
    if (!isChangeOnAxisAllowed) {
      return res;
    }
    const multiplier = isResizingInStandardAxisDirection ? 1 : -1;
    const moveSizeChange = (axisMouseCoord - axisMoveStartCoord) * multiplier;
    const factSizeChange = Math.sign(moveSizeChange) * 10;
    const newAxisSize = elemAxisSize + factSizeChange;
    const isChangingSize = Math.abs(moveSizeChange) >= 10 && newAxisSize >= minAxisSize;
    const newAxisCoord = isResizingInStandardAxisDirection ? elemAxisCoord : elemAxisCoord - factSizeChange;
    const isOutOfParentAxisBorders = isResizingInStandardAxisDirection ?
      (parentAxisBorderCoord + newAxisCoord + newAxisSize) > (parentAxisBorderCoord + parensAxisSize) :
      newAxisCoord < 0;
    if (isChangingSize && !isOutOfParentAxisBorders) {
      res.newAxisSize = newAxisSize;
      res.newAxisCoord = newAxisCoord;
      res.newAxisMoveStartCoord = axisMouseCoord;
    }
    return res;
  }

  static getResizeNewSizesAndCoords(
    axisesData,
    minSizes,
    elemData,
    parentData,
    mouseCoords,
    moveStartCoords
  ) {
    const { x: allowResizeX, y: allowResizeY, standardX, standardY } = axisesData;
    const { width: minWidth, height: minHeight } = minSizes;
    const { top: elemTop, left: elemLeft, width: elemWidth, height: elemHeight } = elemData;
    const { width: parentWidth, height: parentHeight, left: parentLeft, top: parentTop } = parentData;
    const { x: mouseX, y: mouseY } = mouseCoords;
    const { x: moveStartX, y: moveStartY } = moveStartCoords;
    const {
      newAxisSize: newWidth,
      newAxisCoord: newLeft,
      newAxisMoveStartCoord: newMoveStartX
    } = MoveResizeService.#getAxisResizeNewSizeAndCoords(
      !!allowResizeX, standardX, minWidth, mouseX,
      moveStartX, elemWidth, elemLeft, parentLeft, parentWidth
    );
    const {
      newAxisSize: newHeight,
      newAxisCoord: newTop,
      newAxisMoveStartCoord: newMoveStartY
    } = MoveResizeService.#getAxisResizeNewSizeAndCoords(
      allowResizeY, standardY, minHeight, mouseY,
      moveStartY, elemHeight, elemTop, parentTop, parentHeight
    );
    return {
      newSizes: {
        width: newWidth,
        height: newHeight,
      },
      newCoords: {
        top: newTop,
        left: newLeft,
      },
      newMoveStartCoords: {
        moveStartX: newMoveStartX,
        moveStartY: newMoveStartY
      }
    };
  }


  static #getInResizeElemAxisSideAndCoord(
    isChangeOnAxisAltSide: boolean,
    axisSides: { standard: string, alt: string },
    elemAxisCoord: number,
    elemAxisSize: number,
    parentAxisSize: number,
    borderInfelicity: number
  ): IAxisElemCoordInResize {
    let newAxisFixedSide = axisSides.standard;
    let newAxisCoord = elemAxisCoord - borderInfelicity;
    if (newAxisCoord < 0) newAxisCoord = 0;
    if (isChangeOnAxisAltSide) {
      newAxisFixedSide = axisSides.alt;
      newAxisCoord = parentAxisSize - elemAxisCoord - elemAxisSize - borderInfelicity;
      if (newAxisCoord < 0) {
        newAxisCoord = -borderInfelicity;
      }
    }
    return { [newAxisFixedSide]: newAxisCoord + 'px' };
  }

  static getInResizeElemCoords(
    axisesData,
    elemData,
    parentData,
    infelicities
  ) {
    const { x: revertX, y: revertY } = axisesData;
    const { width: elemWidth, height: elemHeight, top: elemY, left: elemX } = elemData;
    const { width: parentWidth, height: parentHeight } = parentData;
    const { x: infelicityX, y: infelicityY } = infelicities;
    const horizontalCoord = MoveResizeService.#getInResizeElemAxisSideAndCoord(
      revertX, { standard: 'left', alt: 'right' }, elemX, elemWidth, parentWidth, infelicityX
    );
    const verticalCoord = MoveResizeService.#getInResizeElemAxisSideAndCoord(
      revertY, { standard: 'top', alt: 'bottom' }, elemY, elemHeight, parentHeight, infelicityY
    );
    return { ...horizontalCoord, ...verticalCoord };
  }
}
