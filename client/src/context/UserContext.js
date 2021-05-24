import * as React from "react";

const UserContext = React.createContext();

function userReducer(store = [], action) {
  // console.log("INSIDE REDUCER FUNCTION");
  switch (action.type) {
    case "REGISTER":
      return {
        ...store,
        isAuthenticated: true,
        data: action.data,
        token: action.token,
      };
    case "LOGIN_SUCCESS":
      return { ...store, isAuthenticated: true };
    case "SIGN_OUT":
      return { ...store, isAuthenticated: false };
    case "ADD_DATA":
      return { ...store };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function UserProvider({ children }) {
  const [store, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });
  const value = { store, dispatch };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

const registerUser = async (dispatch, data, token) => {
  try {
    localStorage.setItem("id_token", token);
    await dispatch({ type: "REGISTER", data, token });
  } catch (e) {
    console.log(e);
  }
};

function loginUser(dispatch, email, password, token) {
  if (!!email && !!password) {
    setTimeout(() => {
      localStorage.setItem("id_token", token);
      dispatch({ type: "LOGIN_SUCCESS" });
    }, 2000);
  }
}

function logoutUser(dispatch, email, password, token) {
  if (!!email && !!password) {
    setTimeout(() => {
      localStorage.removeItem("id_token");
      dispatch({ type: "SIGN_OUT" });
    }, 2000);
  }
}

const addDataToStore = async (dispatch, data) => {
  try {
    await dispatch({ type: "ADD_DATA", payload: data });
  } catch (e) {
    console.log(e);
  }
};

export {
  UserProvider,
  useUserContext,
  registerUser,
  loginUser,
  logoutUser,
  addDataToStore,
};
