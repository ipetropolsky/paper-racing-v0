import { useCallback, useReducer } from 'react';

import { defaultPosition } from './constants';
import { log } from './debug';
import Path from './Path';
import Car from './Car';
import { calculateTrack } from './utils';
import Point from './Point';
import NextMove from './NextMove';

const START = 'START';
const MOVE = 'MOVE';

const initialState = {
    start: defaultPosition,
    position: defaultPosition,
    vector: { dx: 0, dy: 0 },
    speed: 0,
    exactSpeed: 0,
    history: [],
    track: [],
};

const startAction = ({ left, top }) => ({ type: START, payload: { left, top } });
const moveAction = ({ left, top }) => ({ type: MOVE, payload: { left, top } });

const makeStartState = (state, action) => {
    const { left, top } = action.payload;
    log('Start at ', { left, top });
    return { ...state, error: null, start: { left, top }, position: { left, top } };
};

const makeMoveState = (state, action) => {
    const { left, top } = action.payload;
    const { position: lastPosition, vector: lastVector } = state;
    const position = { left, top };
    const { vector, angle, speed, exactSpeed } = calculateTrack(lastPosition, position);
    if (Math.abs(vector.dx - lastVector.dx) > 1 || Math.abs(vector.dy - lastVector.dy) > 1) {
        log('Error at ', position, 'from', lastPosition);
        return { ...state, error: position };
    }
    log('Move to', position, 'from', lastPosition, { vector, angle, speed, exactSpeed });
    return {
        ...state,
        error: null,
        position,
        vector,
        angle,
        speed,
        exactSpeed,
        history: state.history.concat(action),
        track: state.track.concat({
            from: lastPosition,
            to: position,
            vector,
            angle,
            speed,
            exactSpeed,
        }),
    };
};

function reducer(state, action) {
    switch (action.type) {
        case START:
            return makeStartState(state, action);
        case MOVE:
            return makeMoveState(state, action);
    }
}

const usePlayer = (color) => {
    const [{ error, position, vector, track, angle, exactSpeed }, dispatch] = useReducer(reducer, initialState);
    const moveTo = useCallback((nextPosition) => {
        dispatch(moveAction(nextPosition));
    }, []);
    const render = () => (
        <>
            {position && <Car left={position.left} top={position.top} angle={angle} color={color} />}
            {track.map(({ from, angle, exactSpeed }) => {
                return <Path from={from} angle={angle} exactSpeed={exactSpeed} color={color} />;
            })}
            <Path from={position} angle={angle} exactSpeed={exactSpeed} color="#eee" last />
            {error && <Point left={error.left} top={error.top} color="red" />}
            <NextMove left={position.left + vector.dx} top={position.top + vector.dy} color="purple" />
        </>
    );
    return [moveTo, render];
};

export default usePlayer;
