import { IS_DEBUG_MODE } from './constants';

export const log = (...values) => {
    IS_DEBUG_MODE && console.log(...values);
};
