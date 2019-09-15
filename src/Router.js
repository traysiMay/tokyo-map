import React, { useContext } from "react"
import { Map } from "./components/Map"
import { Theater } from "./components/Theater"
import { MapContext } from "./Context"

export const Router = () => {
  const { state } = useContext(MapContext)
  return (
    <div>
      {state.view === "map" && <Map />}
      {state.view === "theater" && <Theater />}
    </div>
  )
}
