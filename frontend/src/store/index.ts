import { configureStore } from '@reduxjs/toolkit';
import simulationReducer from './simulationSlice';

const store = configureStore({
  reducer: {
    simulation: simulationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 