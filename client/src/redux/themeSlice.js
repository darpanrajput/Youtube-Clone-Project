import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",

    initialState: {
        isDark: true,
        error: false,
        fetching: false

    }
    ,

    reducers: {
        themeChangedStart: (state) => {
            state.fetching = true;
            state.error = false;
        },
        themeChanged: (state, action) => {
            state.fetching = false;
            state.isDark = action.payload;
        },
        themeChangedFailed: (state, action) => {
            state.fetching = false;
            state.error = action.payload;
        },
    }
})


export const { themeChangedStart, themeChanged, themeChangedFailed
} = themeSlice.actions;
export default themeSlice.reducer;