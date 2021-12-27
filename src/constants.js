export const IS_DEBUG_MODE = true;

export const FIELD_WIDTH_IN_CELLS = 30;
export const FIELD_HEIGHT_IN_CELLS = 30;
export const CELL_SIZE = 30;

export const defaultRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
};

export const defaultPosition = {
    left: 0,
    top: 0,
};

export const goals = [];
for (let i = 0; i < 5; i++) {
    goals.push({ id: String(i), left: Math.floor(Math.random() * 30), top: Math.floor(Math.random() * 30) });
}
