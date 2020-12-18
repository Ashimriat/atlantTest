import { MUTATIONS } from "../actionsMutations";


export interface ITile {
  width: number;
  height: number;
  top: number;
  left: number;
  zIndex: number;
  isDisplayed: boolean;
}


export interface IWorkDeskState {
  tiles: ITile[];
}

const { CHANGE_TILE_DATA, GENERATE_TILE, REMOVE_TILE } = MUTATIONS.WORKDESK;

export default {
  namespaced: true,
  state: (): IWorkDeskState => ({
    tiles: [
      {
        width: 300,
        height: 100,
        top: 300,
        left: 300,
        zIndex: 1,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        top: 200,
        left: 400,
        zIndex: 2,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        top: 0,
        left: 50,
        zIndex: 3,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        top: 200,
        left: 0,
        zIndex: 4,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        top: 0,
        left: 0,
        zIndex: 5,
        isDisplayed: true,
      }
    ],
  }),
  mutations: {
    [CHANGE_TILE_DATA](state: IWorkDeskState, { tileIndex, data }) {
      const { tiles } = state;
      const zIndexes = tiles.map(({ zIndex }) => zIndex);
      const editedTile = {
        ...tiles[tileIndex],
        ...data,
        zIndex: Math.max(...zIndexes)
      };
      state.tiles = tiles.map((tileData, index) => index !== tileIndex ? ({
        ...tileData,
        zIndex: tileData.zIndex > tiles[tileIndex].zIndex || tileData.zIndex === editedTile.zIndex ?
          tileData.zIndex - 1
          : tileData.zIndex
      }) : editedTile);
    },
    [GENERATE_TILE](state, tileOnTopIndex) {

    },
    [REMOVE_TILE](state, tileIndex) {

    }
  },
  actions: {

  }
}
