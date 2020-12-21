import { Commit, Dispatch } from "vuex";


type IAxisDirectionsX = 'left' | 'right';
type IAxisDirectionsY = 'top' | 'bottom';
type ICompassDirectionsAxisX = 'W' | 'E';
type ICompassDirectionsAxisY = 'N' | 'S';
type ICompassAxisesDirections = ICompassDirectionsAxisX | ICompassDirectionsAxisY;
type ICompassAxisesHybridDirections = 'NW' | 'NE' | 'SW' | 'SE';
type ICompassDoubleSideAxisDirections = 'WE' | 'EW' | 'NS' | 'SN';
type ICompassAllSidesDirection = 'NESW' | 'NWSE';
type ICompassDirections = ICompassAxisesDirections | ICompassAxisesHybridDirections;
type ICursorType = ICompassAllSidesDirection | ICompassDoubleSideAxisDirections | IAxisCompassDirection | 'default';
export type IAxisDirections = IAxisDirectionsX | IAxisDirectionsY;
export type IAxisCompassDirection = ICompassAxisesDirections | string;
export type ITileCursorType = ICompassDirections | 'default';
export type IResizeDirection = ICompassAxisesDirections | ICompassAxisesHybridDirections | string;
export type IResizeElemCoordsStyles = { [key in IAxisDirections]?: string; }
export interface ICoords {
  x: number;
  y: number;
}
export interface ISizes {
  width: number;
  height: number;
}
export interface ICoordsAndSizes {
  width: ISizes['width'];
  height: ISizes['height'];
  left: ICoords['x'];
  top: ICoords['y'];
}
export interface ITile {
  width: number;
  height: number;
  top: number;
  left: number;
  zIndex: number;
  order: number;
}
export interface IWorkDeskState {
  tiles: ITile[];
}
export interface IChangeTileMutationData {
  tileIndex: number;
  data: Omit<ITile, 'zIndex'>;
}
export interface ITileStyles extends IResizeElemCoordsStyles {
  width: string;
  height: string;
  zIndex: ITile['zIndex']
}
export interface IAxisDirectionsSettings {
  defaultDir: ICompassAxisesDirections;
  altDir: ICompassAxisesDirections;
  switchDoubleCursorSides?: boolean;
}
export interface IAxisesResizeData {
  x: boolean;
  y: boolean;
  farSideX: boolean;
  farSideY: boolean
}
export interface IAxisMoveData {
  newAxisCoord: number;
  newAxisMoveStartCoord: number;
}
export interface IMoveData {
  newCoords: ICoords,
  newMoveStartCoords: ICoords;
}
export interface IAxisResizeData {
  newAxisSize: number;
  newAxisCoord: number;
  newAxisMoveStartCoord: number;
}
export interface IResizeData {
  newSizes: ISizes
  newCoords: ICoords,
  newMoveStartCoords: ICoords;
}
export interface IWorkdeskActionContext {
  state: IWorkDeskState;
  commit: Commit;
  dispatch: Dispatch;
  payload?: any;
}
export interface IAxisResizeSideAndCursor {
  elemAxisSideWithCursor: ICompassAxisesDirections | string;
  cursorType: ICompassDoubleSideAxisDirections | IAxisCompassDirection;
}
export interface IResizeSideAndCursor {
  resizedSides: {
    x: ICompassAxisesDirections | string;
    y: ICompassAxisesDirections | string;
  };
  cursorType: ICursorType;
}
export interface IResizeAllowances {
  width: ICompassDirectionsAxisX | string;
  height: ICompassDirectionsAxisY | string;
  xSide: ICompassDirectionsAxisY | string;
  ySide: ICompassDirectionsAxisY | string;
}
