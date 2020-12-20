import { ACTIONS, MUTATIONS } from "../actionsMutations";
import CONFIG from "../../../config";
import {IWorkDeskState, IChangeTileMutationData, ITile} from "../../../interfaces/iWorkDesk";
import {Commit, Dispatch} from "vuex";
import {ITransactionsState} from "./transactions";


const { UPDATE_TILE, CREATE_TILE, DELETE_TILE } = MUTATIONS.WORKDESK;
const { CHANGE_TILE, GENERATE_TILE, REMOVE_TILE, SAVE_TO_STORAGE } = ACTIONS.WORKDESK;

interface IActionContext {
  state: IWorkDeskState;
  commit: Commit;
  dispatch: Dispatch;
  payload?: any;
}


export default {
  namespaced: true,
  state: (): IWorkDeskState => {
    const storageData = localStorage.getItem(CONFIG.TILES_STORAGE_KEY);
    let tiles = storageData ? JSON.parse(storageData) : null;
    if (!tiles) {
      tiles = CONFIG.START_TILES;
    }
    return { tiles };
  },
  mutations: {
    [UPDATE_TILE](state: IWorkDeskState, { tileIndex, data }: IChangeTileMutationData): void {
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
          tileData.zIndex - 1 :
          tileData.zIndex
      }) : editedTile);
    },
    [CREATE_TILE](state: IWorkDeskState): void {
      const tiles = state.tiles.map(tile => ({ ...tile }));
      const accStart: { zIndexes: number[], orders: number[] } = { zIndexes: [], orders: [] };
      const { zIndexes, orders } = tiles.reduce((acc, { zIndex, order }, index) => {
        acc.zIndexes.push(zIndex);
        acc.orders.push(order);
        if (index === tiles.length - 1) acc.orders.sort();
        return acc;
      }, accStart);
      let i = 0,
          elemOrder,
          currOrder,
          nextOrder;
      do {
        currOrder = orders[i];
        nextOrder = orders[i + 1];
        if (!nextOrder || (nextOrder - currOrder) >= 2) {
          elemOrder = currOrder + 1;
        }
        i++;
      } while (!elemOrder);
      const newTile = {
        ...CONFIG.MIN_TILE_SIZES,
        top: (CONFIG.WORKDESK_SIZES.height - CONFIG.MIN_TILE_SIZES.height) / 2,
        left: (CONFIG.WORKDESK_SIZES.width- CONFIG.MIN_TILE_SIZES.width) / 2,
        zIndex: Math.max(...zIndexes),
        order: elemOrder
      };
      tiles.push(newTile);
      state.tiles = tiles.map((tile, index) => (index !== tiles.length - 1) ? {
        ...tile,
        zIndex: tile.zIndex > newTile.zIndex || tile.zIndex === newTile.zIndex ?
          tile.zIndex - 1 :
          tile.zIndex
      } : newTile);
    },
    [DELETE_TILE](state: IWorkDeskState, tileIndex: number): void {
      state.tiles.splice(tileIndex, 1);
    }
  },
  actions: {
    [GENERATE_TILE]({ commit, dispatch }: IActionContext): void {
      commit(CREATE_TILE);
      dispatch(SAVE_TO_STORAGE);
    },
    [CHANGE_TILE]({ commit, dispatch }: IActionContext, payload: Partial<ITile>) {
      commit(UPDATE_TILE, payload);
      dispatch(SAVE_TO_STORAGE);
    },
    [REMOVE_TILE]({ commit, dispatch }: IActionContext, payload: number) {
      commit(DELETE_TILE, payload);
      dispatch(SAVE_TO_STORAGE);
    },
    [SAVE_TO_STORAGE]({ state }: IActionContext) {
      localStorage.setItem(CONFIG.TILES_STORAGE_KEY, JSON.stringify(state.tiles));
    }
  },
}
