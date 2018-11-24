import React from "react"
import Modal from "react-modal"
import Axios from "axios"
import styled from "styled-components"
import Loader from "../Loader"
const customStyles = {
  content: {
    zIndex: 10000,
    backgroundColor: "white",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
}
Modal.setAppElement("#root")

const ItemWrapper = styled.div`
  border-bottom: 1px solid black;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  h5 {
    flex-basis: 40%;
    margin: 0;
  }
  h6 {
    flex-basis: 40%;
    margin: 0;
  }
  div {
    flex-basis: 100%;
  }
`

const ItemComponent = props => (
  <ItemWrapper>
    <h5>{props.name}</h5>
    <h6>Tipo: {props.category}</h6>
    <div>{props.specifications}</div>
    <span>Cantidad Necesitada:{props.quantity}</span>
  </ItemWrapper>
)

class CenterModal extends React.PureComponent {
  state = { name: "", items: [], loading: true }

  updateView = async () => {
    this.setState({ name: "", items: [], loading: true })
    console.log(this.props.centerId)
    const items = await Axios.get(`/api/items/${this.props.centerId}`).then(
      r => r.data
    )
    console.log(items)
    this.setState({ items, loading: false })
  }
  render() {
    const { updateView } = this
    const { items, loading } = this.state
    const itemView = items.map(
      ({ name, category, quantity, specifications, id }) => (
        <ItemComponent
          name={name}
          category={category}
          quantity={quantity}
          key={id}
          specifications={specifications}
        />
      )
    )
    console.log("modal is open: ", this.props.modalIsOpen)
    return (
      <Modal
        onAfterOpen={updateView}
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {loading ? <Loader /> : itemView}
        <button onClick={this.props.onRequestClose}>Cerrar</button>
      </Modal>
    )
  }
}

export default CenterModal
