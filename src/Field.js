import { useCallback, useEffect, useRef, useState } from 'react';

import { CELL_SIZE, MAGNET_DISTANCE } from './constants';
import Point from './Point';

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

const Field = () => {
    const fieldRef = useRef();
    const [fieldMetrics, setFieldMetrics] = useState(defaultBoundingClientRect);
    const [pointMetrics, setPointMetrics] = useState(defaultPointPosition);
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
            const x = pageX - fieldMetrics.left;
            const y = pageY - fieldMetrics.top;
            const left = Math.round(x / CELL_SIZE);
            const top = Math.round(y / CELL_SIZE);
            const dx = x - left * CELL_SIZE;
            const dy = y - top * CELL_SIZE;
            const isMagnetic = Math.sqrt(dx * dx + dy * dy) <= MAGNET_DISTANCE;
            isMagnetic && setPointMetrics({ left, top });
        },
        [fieldMetrics]
    );

    return (
        <div style={{ position: 'relative', margin: 10 }}>
            <div className="field" ref={fieldRef} onMouseMove={onMouseMove}>
                <Point left={pointMetrics.left} top={pointMetrics.top} />
            </div>
        </div>
    );
};

export default Field;
