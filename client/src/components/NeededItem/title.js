import React from "react"

export default props => {
  const { children, ...others } = props
  return <h1 {...others}>{props.children}</h1>
}
