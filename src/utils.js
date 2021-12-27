import { CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS } from './constants';
import { log } from './debug';

export const getSafeCell = (left, top) => ({
    left: Math.max(0, Math.min(left, FIELD_WIDTH_IN_CELLS - 1)),
    top: Math.max(0, Math.min(top, FIELD_HEIGHT_IN_CELLS - 1)),
});

export const getCellByCoords = (x, y) => getSafeCell(Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE));

export const calculateTrack = (from, to) => {
    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const speed = Math.max(Math.abs(dx), Math.abs(dy));
    const exactSpeed = Math.sqrt(dx * dx + dy * dy);
    const vector = { dx, dy };
    const angle = Math.atan(dy / dx) + (dx < 0 ? Math.PI : 0);
    return {
        vector,
        angle,
        speed,
        exactSpeed,
    };
};
