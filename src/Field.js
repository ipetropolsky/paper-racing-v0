import { useCallback, useEffect, useRef, useState } from 'react';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS, FIELD_HEIGHT_IN_CELLS, defaultRect, defaultPosition } from './constants';
import Point from './Point';
import { log } from './debug';
import { getCellByCoords } from './utils';

import './Field.css';

const fieldStyle = {
    width: FIELD_WIDTH_IN_CELLS * CELL_SIZE - 1,
    height: FIELD_HEIGHT_IN_CELLS * CELL_SIZE - 1,
};

const Field = () => {
    const fieldRef = useRef();
    const [fieldMetrics, setFieldMetrics] = useState(defaultRect);
    const [cursor, setCursor] = useState(defaultPosition);
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

    const onMouseMove = useCallback(
        ({ pageX, pageY }) => {
            const cell = getCellByCoords(pageX - fieldMetrics.left, pageY - fieldMetrics.top);
            log('Cursor position', cell);
            setCursor(cell);
        },
        [fieldMetrics]
    );

    return (
        <div style={{ position: 'relative', margin: 30 }}>
            <div className="field" ref={fieldRef} onMouseMove={onMouseMove} style={fieldStyle}>
                <Point left={cursor.left} top={cursor.top} />
            </div>
        </div>
    );
};

export default Field;
