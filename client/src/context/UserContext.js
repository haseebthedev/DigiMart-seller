import * as React from "react";

const UserContext = React.createContext();

function userReducer(store = [], action) {
  switch (action.type) {
    case "REGISTER":
      return {
        isAuthenticated: true,
        data: { data: action.data, token: action.token },
      };
    case "COMPLETE_REGISTRATION":
      return {
        isAuthenticated: true,
        data: { data: action.data, token: action.token },
      };
    case "LOGIN_SUCCESS":
      return { ...store, isAuthenticated: true };
    case "SIGN_OUT":
      return { ...store, isAuthenticated: false };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function UserProvider({ children }) {
  const [store, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!JSON.parse(localStorage.getItem("USER_DATA")),
    data: JSON.parse(localStorage.getItem("USER_DATA")),
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
    localStorage.setItem("USER_DATA", JSON.stringify({ data, token }));
    await dispatch({ type: "REGISTER", data, token });
  } catch (e) {
    console.log(e);
  }
};

function loginUser(dispatch, email, password, token) {
  if (!!email && !!password) {
    setTimeout(() => {
      dispatch({ type: "LOGIN_SUCCESS" });
    }, 2000);
  }
}

function logoutUser(dispatch, email, password) {
  if (!!email && !!password) {
    setTimeout(() => {
      localStorage.removeItem("USER_DATA");
      dispatch({ type: "SIGN_OUT" });
    }, 2000);
  }
}

const completeRegistration = async (dispatch, data, token) => {
  try {
    localStorage.removeItem("USER_DATA");
    localStorage.setItem("USER_DATA", JSON.stringify({ data, token }));
    await dispatch({ type: "COMPLETE_REGISTRATION", data, token });
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
  completeRegistration,
};
