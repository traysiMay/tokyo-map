import React, { useReducer, createContext } from "react";

let reducer = (state, action) => {
  const { place, file, extension } = action;
  switch (action.type) {
    case "map":
      return { ...state, view: "map" };
    case "theater":
      return { ...state, view: "theater", place, file, extension };
    default:
      return;
  }
};

const initialState = { view: "map", place: "", file: "", extension: "" };
const MapContext = createContext(initialState);

function MapProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {props.children}
    </MapContext.Provider>
  );
}

export { MapContext, MapProvider };
