import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import themeReducer from "./themeSlice";
import userReducer from "./userSlice";
import videoReducer from "./videoSlice";

const persistConfig = {
    key: "root",
    version: 1,
    //blacklist: ["cart"],// the cart doesn't persist
    //whitelist: ["cart"],//only store the cart as persisted data
    storage,
};

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    video: videoReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);