import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type User = {
    uid: string
    name: string,
    email: string,
    photourl: string
}
type AuthState = {
    user: User | null
}
const initialState: AuthState = {
    user: null
}
export const UserSlice = createSlice({
    name: "userSlice",
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    }
})
export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;