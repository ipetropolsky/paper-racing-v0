import { createContext } from 'react';

import './App.css';
import './Field';
import Field from './Field';

const PlayersContext = createContext({});

function App() {
    return (
        <div className="App">
            <Field />
        </div>
    );
}

export default App;
