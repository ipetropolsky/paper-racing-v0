import { useCallback, useReducer } from 'react';

import { defaultPosition } from './constants';
import { log } from './debug';
import Path from './Path';
import Car from './Car';
import { calculateTrack } from './utils';
import Point from './Point';
import NextMove from './NextMove';

const MOVE = 'MOVE';
const UNDO = 'UNDO';
const REDO = 'REDO';

const initialState = {
    current: {
        position: defaultPosition,
        vector: { dx: 0, dy: 0 },
        angle: Math.PI / 4,
        speed: 0,
        exactSpeed: 0,
    },
    history: [],
    future: [],
    track: [],
};

const moveAction = ({ left, top }) => ({ type: MOVE, payload: { left, top } });
const undoAction = () => ({ type: UNDO });
const redoAction = (dispatch) => ({ type: REDO, payload: { dispatch } });

const makeMoveState = (state, action) => {
    const { left, top } = action.payload;
    const { current } = state;
    const next = calculateTrack(current.position, { left, top });
    log('Move', next, 'from', current);
    if (Math.abs(next.vector.dx - current.vector.dx) > 1 || Math.abs(next.vector.dy - current.vector.dy) > 1) {
        return { ...state, error: { ...next.position } };
    }
    return {
        ...state,
        error: null,
        current: next,
        history: state.history.concat(action),
        future: action.doNotClearFuture ? state.future : [],
        track: state.track.concat({
            from: current,
            to: next,
        }),
    };
};

const makeUndoState = (state) => {
    if (state.history.length) {
        const lastAction = state.history[state.history.length - 1];
        log('Undo', lastAction);
        if (lastAction.type === MOVE) {
            const { from } = state.track[state.track.length - 1];
            return {
                ...state,
                error: null,
                current: { ...from },
                history: state.history.slice(0, state.history.length - 1),
                future: [lastAction, ...state.future],
                track: state.track.slice(0, state.track.length - 1),
            };
        }
    }
    return state;
};

const makeRedoState = (state, action) => {
    if (state.future.length) {
        const { dispatch } = action.payload;
        const nextAction = state.future[0];
        log('Redo', nextAction);
        dispatch({ ...nextAction, doNotClearFuture: true });
        return {
            ...state,
            future: state.future.slice(1),
        };
    }
};

function reducer(state, action) {
    switch (action.type) {
        case MOVE:
            return makeMoveState(state, action);
        case UNDO:
            return makeUndoState(state, action);
        case REDO:
            return makeRedoState(state, action);
    }
}

const usePlayer = (color) => {
    const [{ error, current, track, future }, dispatch] = useReducer(reducer, initialState);

    const moveTo = (nextPosition) => {
        dispatch(moveAction(nextPosition));
    };

    const undo = () => {
        dispatch(undoAction());
    };

    const redo = () => {
        dispatch(redoAction(dispatch));
    };

    const render = () => (
        <>
            {current.position && (
                <Car left={current.position.left} top={current.position.top} angle={current.angle} color={color} />
            )}
            {track.map(({ from, to }, index) => {
                return (
                    <Path
                        key={index}
                        position={from.position}
                        angle={to.angle}
                        exactSpeed={to.exactSpeed}
                        color={color}
                    />
                );
            })}
            <Path position={current.position} angle={current.angle} exactSpeed={current.exactSpeed} color="#eee" last />
            {error && <Point left={error.left} top={error.top} color="red" />}
            <NextMove
                left={current.position.left + current.vector.dx}
                top={current.position.top + current.vector.dy}
                color="purple"
            />
        </>
    );
    return [moveTo, render, undo, redo];
};

export default usePlayer;
