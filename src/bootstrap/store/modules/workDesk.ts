import { MUTATIONS } from "../actionsMutations";


export interface ITile {
  width: number;
  height: number;
  top: number;
  left: number;
  zIndex: number;
  isDisplayed: boolean;
  coords?: { x: number, y: number };
}


export interface IWorkDeskState {
  tiles: ITile[];
}

const { CHANGE_TILE_DATA } = MUTATIONS.WORKDESK;

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
      /*
      {
        width: 300,
        height: 100,
        zIndex: 2,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        zIndex: 3,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        zIndex: 4,
        isDisplayed: true,
      },
      {
        width: 300,
        height: 100,
        zIndex: 5,
        isDisplayed: true,
      },

       */
    ],
  }),
  mutations: {
    [CHANGE_TILE_DATA](state, { index, data }) {
      Object.assign(state.tiles[index], data);
    },
  },
  actions: {

  }
}
