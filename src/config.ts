export default {
  GRID_SIZE: 10,
  RESIZE_INDENT: 15,
  MAX_TILES_AMOUNT: 5,
  WORKDESK_SIZES: {
    width: 900,
    height: 600
  },
  MIN_TILE_SIZES: {
    width: 300,
    height: 100
  },
  TILES_STORAGE_KEY: 'appTiles',
  START_TILES: [
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
  ]
};
