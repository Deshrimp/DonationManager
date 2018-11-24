import React from "react"
import { FaTrash } from "react-icons/fa"
import styled from "styled-components"
const RedTrash = styled(FaTrash)`
  color: red;
`

export default ({ handleDelete, className, index }) => (
  <button
    className={className + " delete"}
    data-index={index}
    onClick={handleDelete}
  >
    <RedTrash /> Eliminar
  </button>
)
