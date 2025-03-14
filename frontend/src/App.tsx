import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TrainCabin from './components/TrainCabin';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <TrainCabin />
        </Provider>
    );
};

export default App;
