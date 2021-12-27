import { useCallback, useEffect, useRef, useState } from 'react';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS, FIELD_HEIGHT_IN_CELLS, defaultRect, defaultPosition } from './constants';
import Point from './Point';
import { getCellByCoords } from './utils';

import './Field.css';
import usePlayer from './usePlayer';

const fieldStyle = {
    width: FIELD_WIDTH_IN_CELLS * CELL_SIZE - 1,
    height: FIELD_HEIGHT_IN_CELLS * CELL_SIZE - 1,
};

const Field = () => {
    const fieldRef = useRef();
    const [fieldMetrics, setFieldMetrics] = useState(defaultRect);
    const [cursor, setCursor] = useState(null);
    const [movePlayer1, renderPlayer1] = usePlayer('#4d4dff');
    useEffect(() => {
        const resizeHandler = () => {
            if (fieldRef.current) {
                const newMetrics = fieldRef.current.getBoundingClientRect();
                setFieldMetrics(
                    Object.keys(defaultRect).reduce((result, key) => {
                        result[key] = newMetrics[key];
                        return result;
                    }, {})
                );
            }
        };
        window.addEventListener('resize', resizeHandler);
        resizeHandler();

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    const onClick = useCallback(
        ({ pageX, pageY }) => {
            const cell = getCellByCoords(pageX - fieldMetrics.left, pageY - fieldMetrics.top);
            movePlayer1(cell);
        },
        [fieldMetrics]
    );

    const onMouseMove = useCallback(
        ({ pageX, pageY }) => {
            const cell = getCellByCoords(pageX - fieldMetrics.left, pageY - fieldMetrics.top);
            setCursor(cell);
        },
        [fieldMetrics]
    );

    return (
        <div style={{ position: 'relative', margin: 30 }}>
            <div className="field" ref={fieldRef} onMouseMove={onMouseMove} onClick={onClick} style={fieldStyle}>
                {cursor && <Point left={cursor.left} top={cursor.top} color="#ddd" />}
                {renderPlayer1()}
            </div>
        </div>
    );
};

export default Field;
