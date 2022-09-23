import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentVideo: null,
    fetching: false,
    error: false,
}
const videoSlice = createSlice({
    name: "video", initialState,
    reducers: {
        fetchVideoStart: (state) => {
            state.fetching = true;
            state.error = false;
        },
        fetchVideoSuccess: (state, action) => {
            state.fetching = false;
            state.currentVideo = action.payload;
        },
        fetchVideoFailed: (state) => {
            state.fetching = false;
            state.error = true;
        },

        deleteVideoCache: (state) => {
            state.currentVideo = null;
            state.error = false;
            state.fetching = false;
        },

        like: (state, action) => {
            if (!state.currentVideo.likes.includes(action.payload)) {
                state.currentVideo.likes.push(action.payload);
                const i = state.currentVideo.dislikes.findIndex((userId => userId === action.payload))
                state.currentVideo.dislikes.splice(i, 1);
            }
        },

        dislike: (state, action) => {
            if (!state.currentVideo.dislikes.includes(action.payload)) {
                state.currentVideo.dislikes.push(action.payload);
                const i = state.currentVideo.likes.findIndex((userId => userId === action.payload))
                state.currentVideo.likes.splice(i, 1);
            }
        },


    }
})


export const { fetchVideoStart, fetchVideoSuccess, fetchVideoFailed, deleteVideoCache, like, dislike

} = videoSlice.actions;
export default videoSlice.reducer;