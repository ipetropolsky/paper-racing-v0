import { CELL_SIZE } from './constants';

import './Point.css';

const Point = ({ left, top }) => {
    return <div className="point" style={{ left: left * CELL_SIZE, top: top * CELL_SIZE }}></div>;
};

export default Point;
