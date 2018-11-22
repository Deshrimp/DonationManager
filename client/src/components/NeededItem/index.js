import React from "react"
import { FaPlus, FaMinus } from "react-icons/fa"
import title from "./title"
import description from "./description"
import quantity from "./quantity"
import categories from "./categories"
import deleteItem from "./deleteItem"
import saveItem from "./saveItem"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: white;
  border-radius: 25px;
  margin: 1rem;
  padding: 0 1rem 1rem 1rem;

  @media screen and (min-width: 576px) {
    max-width: 50%;

    span {
      width: 25%;
    }
  }

  h1 {
    flex-basis: 100%;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 400;
  }
  .save {
    background-color: #4caf50;
    color: white;
    padding: 0.4rem;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .delete {
    background-color: #000;
    color: white;
    padding: 0.4rem;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
  }
`

class NeededItem extends React.PureComponent {
  render() {
    const { children, ...others } = this.props
    return <Wrapper {...others}>{children}</Wrapper>
  }
}

NeededItem.title = title
NeededItem.description = description
NeededItem.quantity = quantity
NeededItem.categories = categories
NeededItem.deleteItem = deleteItem
NeededItem.saveItem = saveItem

export default NeededItem
