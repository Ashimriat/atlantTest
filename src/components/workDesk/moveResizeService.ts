import { isInRange } from "../../utils";
import CONFIG from "../../config";
import {
  IAxisMoveData, IMoveData, IAxisResizeData, IResizeData,
  IResizeElemCoordsStyles, IAxisCompassDirection, IResizeDirection,
  ICoords, ISizes, ICoordsAndSizes, IAxisesResizeData, IAxisDirections,
  IAxisDirectionsSettings
} from "../../interfaces/iWorkDesk";


export default class MoveResizeService {
  // @ts-ignore
  static #getAxisMoveNewCoords(
    elemAxisBorderCoord: number,
    elemAxisSize: number,
    parentAxisBorderCoord: number,
    parentAxisSize: number,
    axisMouseCoord: number,
    axisMoveStartCoord: number
  ): IAxisMoveData {
    const res = { newAxisCoord: elemAxisBorderCoord, newAxisMoveStartCoord: axisMoveStartCoord };
    const moveCoordChange = axisMouseCoord - axisMoveStartCoord;
    const factCoordChange = Math.sign(moveCoordChange) * CONFIG.GRID_SIZE;
    const isNotOutOfAxisParentBorders = isInRange(
      elemAxisBorderCoord + factCoordChange + parentAxisBorderCoord,
      parentAxisBorderCoord,
      parentAxisBorderCoord + parentAxisSize - elemAxisSize
    );
    if (Math.abs(moveCoordChange) >= CONFIG.GRID_SIZE && isNotOutOfAxisParentBorders) {
      res.newAxisCoord += factCoordChange;
      res.newAxisMoveStartCoord += factCoordChange;
    }
    return res;
  };

  static getMoveNewCoords(
    elemData: ICoordsAndSizes,
    parentData: ICoordsAndSizes,
    mouseCoords: ICoords,
    moveStartCoords: ICoords
  ): IMoveData {
    const { left: elemX, top: elemY, width: elemWidth, height: elemHeight } = elemData;
    const { left: parentX, top: parentY, width: parentWidth, height: parentHeight } = parentData;
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
        x: newLeft,
        y: newTop
      },
      newMoveStartCoords: {
        x: newMoveStartX,
        y: newMoveStartY
      }
    }
  }

  // @ts-ignore
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
  ): IAxisResizeData {
    const res = { newAxisSize: elemAxisSize, newAxisCoord: elemAxisCoord, newAxisMoveStartCoord: axisMoveStartCoord };
    if (!isChangeOnAxisAllowed) return res;
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
    axisesData: IAxisesResizeData,
    minSizes: ISizes,
    elemData: ICoordsAndSizes,
    parentData: ICoordsAndSizes,
    mouseCoords: ICoords,
    moveStartCoords: ICoords
  ): IResizeData {
    const { x: allowResizeX, y: allowResizeY, standardX, standardY } = axisesData;
    console.log("STANDARD X: ", standardX);
    const { width: minWidth, height: minHeight } = minSizes;
    const { top: elemY, left: elemX, width: elemWidth, height: elemHeight } = elemData;
    const { width: parentWidth, height: parentHeight, left: parentX, top: parentY } = parentData;
    const { x: mouseX, y: mouseY } = mouseCoords;
    const { x: moveStartX, y: moveStartY } = moveStartCoords;
    const {
      newAxisSize: newWidth,
      newAxisCoord: newLeft,
      newAxisMoveStartCoord: newMoveStartX
    } = MoveResizeService.#getAxisResizeNewSizeAndCoords(
      allowResizeX, standardX, minWidth, mouseX,
      moveStartX, elemWidth, elemX, parentX, parentWidth
    );
    const {
      newAxisSize: newHeight,
      newAxisCoord: newTop,
      newAxisMoveStartCoord: newMoveStartY
    } = MoveResizeService.#getAxisResizeNewSizeAndCoords(
      allowResizeY, standardY, minHeight, mouseY,
      moveStartY, elemHeight, elemY, parentY, parentHeight
    );
    return {
      newSizes: {
        width: newWidth,
        height: newHeight,
      },
      newCoords: {
        x: newLeft,
        y: newTop,
      },
      newMoveStartCoords: {
        x: newMoveStartX,
        y: newMoveStartY
      }
    };
  }

  // @ts-ignore
  static #getInResizeElemAxisSideAndCoord(
    isChangeOnAxisAltSide: boolean,
    axisSides: { standard: IAxisDirections, alt: IAxisDirections },
    elemAxisCoord: number,
    elemAxisSize: number,
    parentAxisSize: number,
    borderInfelicity: number
  ): IResizeElemCoordsStyles {
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
    axisesData: { x: boolean, y: boolean },
    elemData: ICoordsAndSizes,
    parentData: ISizes,
    infelicities: { x: number, y: number }
  ): IResizeElemCoordsStyles {
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

  // @ts-ignore
  static #getAxisResizeDirectionAndCursorType(
    axisMouseCoord: number, // координаты указателя мыши относительно верхней и левой границ элемента
    elemAxisCoord: number,
    elemAxisSize: number,
    parentAxisSize: number,
    axisCompassDirections: IAxisDirectionsSettings,
    elemMinAxisSize: number
  ): IAxisCompassDirection {
    let resizeDirection: string = '',
        isResizableInBothSides: boolean = false;
    const isNotMinAxisSizeElem = elemAxisSize > elemMinAxisSize;
    if (axisMouseCoord < CONFIG.RESIZE_INDENT) {
      resizeDirection = 'alt';
      if (!elemAxisCoord) {
        resizeDirection = isNotMinAxisSizeElem ? 'default' : '';
      } else {
        isResizableInBothSides = isNotMinAxisSizeElem;
      }
    } else if (isInRange(axisMouseCoord, elemAxisSize - 20, elemAxisSize)) {
      // справа/снизу, направление по ходу оси
      resizeDirection = 'default';
      if ((elemAxisCoord + elemAxisSize) === parentAxisSize) {
        resizeDirection = isNotMinAxisSizeElem ? 'alt' : '';
      } else {
        isResizableInBothSides = isNotMinAxisSizeElem;
      }
    }
    return {
      resizeDirection: axisCompassDirections[resizeDirection as keyof IAxisDirectionsSettings] || '',
      isResizableInBothSides
    };
  }

  static getElemResizeDirectionAndCursorType(
    mouseData: ICoords,
    elemData: ICoordsAndSizes,
    parentData: ISizes
  ): IResizeDirection {
    const { x: mouseX, y: mouseY } = mouseData;
    const { left: elemX, top: elemY, width: elemWidth, height: elemHeight } = elemData;
    const { width: parentWidth, height: parentHeight } = parentData;
    const {
      resizeDirection: xResizeDirection,
      isResizableInBothSides: xResizableInBothSides
    } = MoveResizeService.#getAxisResizeDirectionAndCursorType(
      mouseX, elemX, elemWidth, parentWidth, { default: 'E', alt: 'W' }, CONFIG.MIN_TILE_SIZES.width
    );
    const {
      resizeDirection: yResizeDirection,
      isResizableInBothSides: yResizableInBothSides
    } = MoveResizeService.#getAxisResizeDirectionAndCursorType(
      mouseY, elemY, elemHeight, parentHeight, { default: 'S', alt: 'N' }, CONFIG.MIN_TILE_SIZES.height
    );
    return {
      resizeDirection: yResizeDirection + xResizeDirection,
      isResizableInBothSides: {
        x: xResizableInBothSides,
        y: yResizableInBothSides
      }
    };
  }
}
