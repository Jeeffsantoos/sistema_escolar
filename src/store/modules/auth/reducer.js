/* eslint-disable default-param-last */
import * as types from "../types";

const initialState = {
  isLoggedIn: false,
  token: false,
  user: {},
  isLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      return state;
    }
    default:
      return state;
  }
}