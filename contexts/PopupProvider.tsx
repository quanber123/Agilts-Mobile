import { createContext, useCallback, useReducer } from 'react';
type InitialState = {
  visibleToastPopup: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  };
  visibleLoadingPopup: boolean;
};
const SET_VISIBLE_POPUP = 'SET_VISIBLE_POPUP';
const CLOSE_ALL_POPUP = 'CLOSE_ALL_POPUP';
const reducer = (state: InitialState, action: any) => {
  const currentPopup = action.payload?.popup;
  const resetState = {} as InitialState;
  switch (action.type) {
    case SET_VISIBLE_POPUP:
      if (typeof action.payload?.popup === 'object') return currentPopup;
      if (currentPopup === null) return { ...resetState };
      return {
        ...resetState,
        [currentPopup]: !state[currentPopup as keyof InitialState],
      };
    case CLOSE_ALL_POPUP:
      return { ...resetState };

    default:
      return state;
  }
};
const initialState = {} as InitialState;
export type InitialPopupContext = {
  state: InitialState;
  setVisiblePopup: (modal: string | Partial<InitialState>) => void;
  closeAllPopup: () => void;
};
export const PopupContext = createContext({} as InitialPopupContext);

export const PopupProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setVisiblePopup = useCallback(
    (popup: any) => {
      dispatch({ type: SET_VISIBLE_POPUP, payload: { popup } });
    },
    [dispatch]
  );
  const closeAllPopup = useCallback(() => {
    dispatch({ type: CLOSE_ALL_POPUP });
  }, [dispatch]);
  const contextValue = {
    state,
    setVisiblePopup,
    closeAllPopup,
  };
  return (
    <PopupContext.Provider value={contextValue}>
      {children}
    </PopupContext.Provider>
  );
};
