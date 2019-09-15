import React from "react"
import { Router } from "./Router"
import { MapProvider } from "./Context"

function App() {
  return (
    <MapProvider>
      <Router />
    </MapProvider>
  )
}
export default App
