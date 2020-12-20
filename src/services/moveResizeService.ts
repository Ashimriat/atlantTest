import { isInRange } from "../utils";
import CONFIG from "../config";
import {
  IAxisMoveData, IMoveData, IAxisResizeData, IResizeData,
  IResizeElemCoordsStyles, IAxisCompassDirection, IResizeDirection,
  ICoords, ISizes, ICoordsAndSizes, IAxisesResizeData, IAxisDirections,
  IAxisDirectionsSettings
} from "../interfaces/iWorkDesk";


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
    isResizingElemFarAxisSide: boolean,
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
    const mouseCoordChange = axisMouseCoord - axisMoveStartCoord;
    const mouseMoveDirectionMultiplier = Math.sign(mouseCoordChange);
    const elemSideMultiplier = isResizingElemFarAxisSide ? 1 : -1;
    const sizeChange = CONFIG.GRID_SIZE * mouseMoveDirectionMultiplier * elemSideMultiplier;
    const coordChange = isResizingElemFarAxisSide ? 0 : -sizeChange;
    const newAxisSize = elemAxisSize + sizeChange;
    const newAxisCoord = elemAxisCoord + coordChange;
    const isChangingSize = Math.abs(mouseCoordChange) >= CONFIG.GRID_SIZE && newAxisSize >= minAxisSize;
    const isOutOfParentAxisBorders = isResizingElemFarAxisSide ?
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
    const { x: allowResizeX, y: allowResizeY, farSideX, farSideY } = axisesData;
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
      allowResizeX, farSideX, minWidth, mouseX,
      moveStartX, elemWidth, elemX, parentX, parentWidth
    );
    const {
      newAxisSize: newHeight,
      newAxisCoord: newTop,
      newAxisMoveStartCoord: newMoveStartY
    } = MoveResizeService.#getAxisResizeNewSizeAndCoords(
      allowResizeY, farSideY, minHeight, mouseY,
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
    if (isChangeOnAxisAltSide || !elemAxisSize) {
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
  static #getAxisResizedSideAndCursorType(
    inElemAxisMouseCoord: number, // координаты указателя мыши относительно левой границы элемента
    elemAxisCoord: number,
    elemAxisSize: number,
    parentAxisSize: number,
    axisDirectionsSettings: IAxisDirectionsSettings,
    elemMinAxisSize: number
  ): IAxisCompassDirection {
    const { defaultDir, altDir, switchDoubleCursorSides } = axisDirectionsSettings;
    let elemAxisSideWithCursor: string = '',
        cursorType: string = switchDoubleCursorSides ? defaultDir + altDir : altDir + defaultDir;
    const isMinAxisSizeElem = elemAxisSize === elemMinAxisSize;
    if (inElemAxisMouseCoord < CONFIG.RESIZE_INDENT) {
      elemAxisSideWithCursor = altDir;
      if (isMinAxisSizeElem) cursorType = altDir;
      if (!elemAxisCoord) {
        cursorType = isMinAxisSizeElem ? '' : defaultDir;
      }
    } else if (isInRange(inElemAxisMouseCoord, elemAxisSize - 20, elemAxisSize)) {
      // справа/снизу, направление по ходу оси
      elemAxisSideWithCursor = defaultDir;
      if (isMinAxisSizeElem) cursorType = defaultDir;
      if ((elemAxisCoord + elemAxisSize) === parentAxisSize) {
        cursorType = isMinAxisSizeElem ? '' : altDir;
      }
    } else {
      cursorType = '';
    }
    return { elemAxisSideWithCursor, cursorType };
  }

  static getResizedSidesAndCursorType(
    mouseData: ICoords,
    elemData: ICoordsAndSizes,
    parentData: ISizes
  ) {
    const { x: mouseX, y: mouseY } = mouseData;
    const { left: elemX, top: elemY, width: elemWidth, height: elemHeight } = elemData;
    const { width: parentWidth, height: parentHeight } = parentData;
    const {
      elemAxisSideWithCursor: xElemSide,
      cursorType: xCursor
    } = MoveResizeService.#getAxisResizedSideAndCursorType(
      mouseX, elemX, elemWidth, parentWidth, { defaultDir: 'E', altDir: 'W', switchDoubleCursorSides: true }, CONFIG.MIN_TILE_SIZES.width
    );
    const {
      elemAxisSideWithCursor: yElemSide,
      cursorType: yCursor
    } = MoveResizeService.#getAxisResizedSideAndCursorType(
      mouseY, elemY, elemHeight, parentHeight, { defaultDir: 'S', altDir: 'N' }, CONFIG.MIN_TILE_SIZES.height
    );
    let cursorType = yCursor + xCursor;
    if (cursorType.length >= 2 && yCursor && xCursor) {
      const isNESW = xElemSide === 'E' && yElemSide === 'N' || xElemSide === 'W' && yElemSide === 'S';
      const isNWSE = xElemSide === 'E' && yElemSide === 'S' || xElemSide === 'W' && yElemSide === 'N';
      if (isNESW || isNWSE) {
        cursorType = isNESW ? 'NESW' : 'NWSE';
      }
    }
    return {
      resizedSides: {
        x: xElemSide,
        y: yElemSide,
      },
      cursorType: cursorType || 'default'
    };
  }
}
