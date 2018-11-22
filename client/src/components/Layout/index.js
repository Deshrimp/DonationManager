import React from "react"
import styled from "styled-components"
import Header from "../Header"

const Wrapper = styled.div`
  margin: 1rem;
`

class Layout extends React.PureComponent {
  render() {
    return (
      <>
        <Header />
        <Wrapper>{this.props.children}</Wrapper>
      </>
    )
  }
}

export default Layout
