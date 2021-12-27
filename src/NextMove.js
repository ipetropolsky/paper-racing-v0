import { CELL_SIZE } from './constants';

import './NextMove.css';

const NextMove = ({ left, top }) => {
    const style = {
        left: left * CELL_SIZE,
        top: top * CELL_SIZE,
    };
    return <div className="next-move" style={style} />;
};

export default NextMove;
