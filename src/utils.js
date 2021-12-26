import { CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS } from './constants';

export const getSafeCell = (left, top) => ({
    left: Math.max(0, Math.min(left, FIELD_WIDTH_IN_CELLS - 1)),
    top: Math.max(0, Math.min(top, FIELD_HEIGHT_IN_CELLS - 1)),
});

export const getCellByCoords = (x, y) => getSafeCell(Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE));
