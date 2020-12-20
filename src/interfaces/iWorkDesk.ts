type IAxisDirectionsX = 'left' | 'right';
type IAxisDirectionsY = 'top' | 'bottom';
type ICompassAxisesDirections = 'N' | 'S' | 'W' | 'E';
type ICompassAxisesHybridDirections = 'NW' | 'NE' | 'SW' | 'SE';
type ICompassDirections = ICompassAxisesDirections | ICompassAxisesHybridDirections;
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
  default: ICompassAxisesDirections;
  alt: ICompassAxisesDirections;
}
export interface IAxisesResizeData {
  x: boolean;
  y: boolean;
  standardX: boolean;
  standardY: boolean
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
