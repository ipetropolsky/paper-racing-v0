import { CELL_SIZE } from './constants';

import './Path.css';

const Path = ({ position: { left, top }, angle, exactSpeed, color, last }) => {
    const style = {
        left: left * CELL_SIZE + CELL_SIZE / 2,
        top: top * CELL_SIZE + CELL_SIZE / 2,
        width: exactSpeed * CELL_SIZE,
        transform: `rotate(${angle}rad`,
        borderColor: color,
    };
    return <div className={`path ${last ? 'path_last' : ''}`} style={style} />;
};

export default Path;
