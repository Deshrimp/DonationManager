import React from "react"

export default props => {
  let { children, className, index, handleSave, ...others } = props
  className += " save"
  return (
    <button
      data-index={index}
      className={className}
      onClick={handleSave}
      {...others}
    >
      Save
    </button>
  )
}
