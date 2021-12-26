import { useCallback, useEffect, useRef, useState } from 'react';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS, FIELD_HEIGHT_IN_CELLS } from './constants';
import Point from './Point';
import { log } from './debug';

import './Field.css';

const defaultBoundingClientRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
};

const defaultPointPosition = {
    left: 0,
    top: 0,
};

const fieldStyle = {
    width: FIELD_WIDTH_IN_CELLS * CELL_SIZE - 1,
    height: FIELD_HEIGHT_IN_CELLS * CELL_SIZE - 1,
};

const Field = () => {
    const fieldRef = useRef();
    const [fieldMetrics, setFieldMetrics] = useState(defaultBoundingClientRect);
    const [pointPosition, setPointPosition] = useState(defaultPointPosition);
    useEffect(() => {
        const resizeHandler = () => {
            if (fieldRef.current) {
                const newMetrics = fieldRef.current.getBoundingClientRect();
                setFieldMetrics(
                    Object.keys(defaultBoundingClientRect).reduce((result, key) => {
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
            const left = Math.floor((pageX - fieldMetrics.left) / CELL_SIZE);
            const top = Math.floor((pageY - fieldMetrics.top) / CELL_SIZE);
            log('Move point to', { left, top });
            setPointPosition({ left, top });
        },
        [fieldMetrics]
    );

    return (
        <div style={{ position: 'relative', margin: 30 }}>
            <div className="field" ref={fieldRef} onMouseMove={onMouseMove} style={fieldStyle}>
                <Point left={pointPosition.left} top={pointPosition.top} />
            </div>
        </div>
    );
};

export default Field;
