import { CELL_SIZE } from './constants';

import './Point.css';

const Point = ({ left, top, color = null }) => {
    const style = {
        left: left * CELL_SIZE,
        top: top * CELL_SIZE,
        ...(color ? { backgroundColor: color } : {}),
    };
    return <div className="point" style={style} />;
};

export default Point;
