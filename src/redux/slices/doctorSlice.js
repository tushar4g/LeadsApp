import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  doctors: [],
}

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    addDoctor: (state, action) => {
      state.doctors.push(action.payload)
    },
    // You can add more reducers like removeDoctor, updateDoctor, etc.
  },
})

export const { addDoctor } = doctorSlice.actions
export default doctorSlice.reducer