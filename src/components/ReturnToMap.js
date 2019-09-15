import React, { useContext } from "react"
import styled from "styled-components"
import { MapContext } from "../Context"

const ButtonOverlay = styled.div`
  position: absolute;
  background: red;
  color: white;
  width: 20rem;
  left: 2rem;
  top: 10rem;
  text-align: center;
  height: 4rem;
  line-height: 4rem;
  font-size: 28px;
  font-family: sans-serif;
  border: 6px white solid;
  position: absolute;
  background: red;
  color: white;
  width: 20rem;
  cursor: pointer;
`

export const ReturnToMap = () => {
  const { dispatch } = useContext(MapContext)

  return (
    <ButtonOverlay onClick={() => dispatch({ type: "map" })}>
      RETURN TO MAP
    </ButtonOverlay>
  )
}
