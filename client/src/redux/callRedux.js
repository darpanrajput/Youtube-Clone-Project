import {
    themeChangedStart, themeChanged,
    themeChangedFailed
} from "./themeSlice";

export const changeTheme = (dispatch, isDark) => {
    dispatch(themeChangedStart());
    try {
        dispatch(themeChanged(isDark));
    } catch (error) {
        dispatch(themeChangedFailed(error));
    }
}