import React from "react"
import Axios from "axios"
import Cookies from "js-cookie"
import Loader from "../components/Loader"
import NeededItem from "../components/NeededItem"
import categories from "../data/categories"
import produce from "immer"
import Layout from "../components/Layout"
import { withAlert } from "react-alert"

const Categories = categories.map(({ category, categoria }) => (
  <option key={category} value={category}>
    {categoria}
  </option>
))

class Management extends React.PureComponent {
  state = {
    name: "",
    category: "medicine",
    specifications: "",
    quantity: 0,
    loading: true,
    username: "",
    items: []
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  addItem = async () => {
    const { name, category, specifications, quantity } = this.state
    this.setState({ loading: true })
    // TODO:  we can assign the below request to ensure its success
    await Axios.post("/api/items/add", {
      name,
      category,
      specifications,
      quantity
    })
    const items = await this.getItems()
    this.props.alert.success("Elemento " + name + " agregado exitosamente")
    this.setState({ items, loading: false })
  }

  getItems = async () => {
    const items = await Axios.get("/api/items").then(r => r.data)
    return items
  }

  async componentDidMount() {
    //get username from cookies
    const username = Cookies.get("username")
    //load the items from the api
    const items = await this.getItems()
    this.setState({ username, loading: false, items })
  }

  //this is the remote save of the item, called by save button
  updateItem = async event => {
    const { index } = event.target.dataset
    const { id, name, specifications, quantity, category } = this.state.items[
      index
    ]
    const res = await Axios.patch(`/api/items/${id}`, {
      quantity,
      category,
      name,
      specifications
    }).then(r => r.data)

    if (!res.error) {
      this.props.alert.success(res.message)
    } else {
      this.props.alert.error(res.message)
    }
  }

  // this deletes the item
  deleteItem = async event => {
    const index = event.target.dataset.index || -1
    if (index === -1) {
      this.props.alert.error("Bad index, please refresh")
      return
    }
    const { items } = this.state
    const id = items[index].id
    const res = await Axios.delete(`/api/items/${id}`).then(r => r.data)

    if (!res.error) {
      this.props.alert.success(res.message)
    } else {
      this.props.alert.error(res.message)
    }
    this.setState({
      items: produce(items, nextItems => {
        nextItems.splice(index, 1)
      })
    })
  }

  //this only updates it client side, pending the actual "save" button press
  changeLocalItem = event => {
    const index = event.target.dataset.index
    const operation = event.target.name
    const { items } = this.state
    switch (operation) {
      case "add":
        this.setState({
          items: produce(items, draft => {
            draft[index].quantity++
          })
        })
        break
      case "subtract":
        this.setState({
          items: produce(items, draft => {
            draft[index].quantity--
          })
        })
        break
      case "quantity":
        this.setState({
          items: produce(items, draft => {
            draft[index].quantity = event.target.value
          })
        })
        break
      case "category":
        this.setState({
          items: produce(items, draft => {
            draft[index].category = event.target.value
          })
        })
        break
      default:
        break
    }
  }

  render() {
    const {
      handleChange,
      addItem,
      updateItem,
      changeLocalItem,
      deleteItem,
      state: { items, loading }
    } = this
    let Items
    // map the items to the NestItem component
    Items = items.map(
      ({ id, name, category, specifications, quantity }, index) => (
        <NeededItem key={"neededitem" + id}>
          <NeededItem.title>{name}</NeededItem.title>
          <NeededItem.description>{specifications}</NeededItem.description>
          <NeededItem.quantity
            handleChange={changeLocalItem}
            value={quantity}
            index={index}
          />
          <NeededItem.categories
            handleChange={changeLocalItem}
            value={category}
            index={index}
          />
          <NeededItem.deleteItem index={index} handleDelete={deleteItem} />
          <NeededItem.saveItem handleSave={updateItem} index={index} />
        </NeededItem>
      )
    )
    return (
      <Layout>
        <h1>Administrar donaciones</h1>
        <div>Agregar nuevo elemento</div>
        <div className="container">
          <div className="row">
            <div className="col-25">
              <label htmlFor="name">Nombre</label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Papel de oficina"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="category">Categoria</label>
            </div>
            <div className="col-75">
              <select onChange={handleChange} name="category">
                {Categories}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="specifications"> Especificaciones </label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="specifications"
                placeholder="Cualquier tipo de papel o cartulina. No importa su condicion pues se usara para fines didacticos"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="quantity"> Cantidad </label>
            </div>
            <div className="col-20">
              <input
                onChange={handleChange}
                type="text"
                name="quantity"
                placeholder="5"
              />
            </div>
          </div>
          <div className="row">
            <button onClick={addItem}>Solicitar</button>
          </div>
        </div>
        {loading ? <Loader /> : Items}
      </Layout>
    )
  }
}

export default withAlert(Management)
