import { MUTATIONS } from "../actionsMutations";
import CONFIG from "../../../config";
import { IWorkDeskState, IChangeTileMutationData } from "../../../interfaces/iWorkDesk";


const { CHANGE_TILE, GENERATE_TILE, REMOVE_TILE } = MUTATIONS.WORKDESK;

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
      },
      {
        width: 300,
        height: 100,
        top: 200,
        left: 400,
        zIndex: 2,
      },
      {
        width: 300,
        height: 100,
        top: 0,
        left: 50,
        zIndex: 3,
      },
      {
        width: 300,
        height: 100,
        top: 200,
        left: 0,
        zIndex: 4,
      },
      {
        width: 300,
        height: 100,
        top: 0,
        left: 0,
        zIndex: 5,
      }
    ],
  }),
  mutations: {
    [CHANGE_TILE](state: IWorkDeskState, { tileIndex, data }: IChangeTileMutationData): void {
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
    [GENERATE_TILE](state: IWorkDeskState): void {

    },
    [REMOVE_TILE](state: IWorkDeskState, tileIndex: number): void {

    }
  },
  actions: {

  }
}
