import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser: null,
    fetching: false,
    error: false,
}
const userSlice = createSlice({
    name: "user", initialState,
    reducers: {
        loginStart: (state) => {
            state.fetching = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.fetching = false;
            state.currentUser = action.payload;
        },
        loginFailed: (state) => {
            state.fetching = false;
            state.error = true;
        },

        logout: (state) => {
            state.currentUser = null;
            state.error = false;
            state.fetching = false;
        },

        subscription: (state, action) => {
            if (state.currentUser.subscribedUsers.includes(action.payload)) {
                // if already subscribed then remove the subscriptionl;
                state.currentUser.subscribedUsers.splice(
                    state.currentUser.subscribedUsers.findIndex(channelId => channelId === action.payload),
                    1
                )
            } else {
                // if not subscribed then add the subscription or channel ID(another user id) to 
                //current User subscribed list and also increase the subscription count for the same channel id(another user)
                state.currentUser.subscribedUsers.push(action.payload)
            }
        }
    }
})


export const { loginStart, loginSuccess, loginFailed, logout, subscription
} = userSlice.actions;
export default userSlice.reducer;