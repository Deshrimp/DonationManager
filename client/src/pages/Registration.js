import React from "react"
import { Redirect } from "react-router-dom"
import Axios from "axios"
import Layout from "../components/Layout"
import {
  FaUser,
  FaAddressCard,
  FaHandHoldingHeart,
  FaRegStickyNote,
  FaClock,
  FaEnvelope,
  FaKey,
  FaUserTie,
  FaRegIdCard
} from "react-icons/fa"
import { withAlert } from "react-alert"
import geocode from "react-geocode"

geocode.setApiKey("AIzaSyAZ2Ctykt1TmoaUCune3iUTUWQltHZHd_E")
geocode.enableDebug()

class Registration extends React.PureComponent {
  state = {
    registered: false,
    form: {
      name: "",
      cause: "",
      description: "",
      rfc: "",
      email: "",
      street: "",
      city: "",
      cp: "",
      state: "",
      colonia: "",
      delegacion: "",
      phone: "",
      schedule: "",
      responsible: "",
      password: ""
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ form: { ...this.state.form, [name]: value } })
  }

  // returns lat and lng of given address or null if failure
  getCoordinates = async address => {
    try {
      const res = await geocode.fromAddress(address)
      const { lat, lng } = res.results[0].geometry.location
      return { lat, lng }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  register = async () => {
    const { form } = this.state

    const addressString = `${form.street}, ${form.colonia}, ${
      form.delegacion
    }, ${form.city}, ${form.state} ${form.cp}`
    const result = await this.getCoordinates(addressString)

    if (!result) {
      this.props.alert.error("Bad address, try again")
      return
    } else {
      form.lat = result.lat
      form.lng = result.lng
    }
    //Here you can do some client side validation of all of the fields,
    //if there is some kind of error in the form, return early, and put a message on the screen
    // for instance if we dont have a street return some kind of error message
    if (!form.name) {
      alert("You must enter your name.")
      return
    }

    //once you believe the data is valid, submit the request
    try {
      const result = await Axios.post("/api/centers/create", form).then(
        r => r.data
      )
      console.log(result)
      if (!result.error) {
        this.props.alert.success(result.message)
        this.setState({ registered: true })
      } else {
        this.props.alert.error(result.message)
      }
    } catch (err) {
      console.log(err.response)

      this.props.alert.error("Direccion no encontrada, intenta de nuevo")
    }
  }

  render() {
    const {
      handleChange,
      register,
      state: { registered }
    } = this

    return (
      <Layout>
        {registered && <Redirect to="/manage" />}
        <h1>Registro para centros de ayuda</h1>
        <div className="container">
          <div className="row">
            <div className="col-25">
              <label htmlFor="name">
                <FaUser /> Nombre
              </label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Fundacion Huellitas"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="adress">
                <FaAddressCard /> Direccion
              </label>
            </div>
            <div className="col-20">
              <label htmlFor="st">Calle</label>
              <input
                onChange={handleChange}
                type="text"
                name="street"
                placeholder="Ayuntamiento 123"
              />
            </div>
            <div className="col-20">
              <label htmlFor="col">Colonia</label>
              <input
                onChange={handleChange}
                type="text"
                name="colonia"
                placeholder="San Rafael"
              />
            </div>
            <div className="col-20">
              <label htmlFor="del">Delegacion</label>
              <input
                onChange={handleChange}
                type="text"
                name="delegacion"
                placeholder="Coyoacan"
              />
            </div>
            <div className="col-10">
              <label htmlFor="cp">C.P</label>
              <input
                onChange={handleChange}
                type="text"
                name="cp"
                placeholder="01234"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="phone"> </label>
            </div>
            <div className="col-20">
              <label htmlFor="state">Estado</label>
              <input
                onChange={handleChange}
                type="text"
                name="state"
                placeholder="Ciudad de México"
              />
            </div>
            <div className="col-20">
              <label htmlFor="city">Ciudad</label>
              <input
                onChange={handleChange}
                type="text"
                name="city"
                placeholder="Ciudad de México"
              />
            </div>
            <div className="col-20">
              <label htmlFor="phone">Numero Telefonico </label>
              <input
                onChange={handleChange}
                type="text"
                name="phone"
                placeholder="(+52-55)1234-5678"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaHandHoldingHeart /> <label htmlFor="cause">Causa</label>
            </div>
            <div className="col-75">
              <select onChange={handleChange} name="cause">
                <option value="children">Niños</option>
                <option value="womengirls">Mujeres y niñas</option>
                <option value="diseases">Enfermedades</option>
                <option value="oldage">Tercera Edad</option>
                <option value="specialneeds">Discapacidad</option>
                <option value="immigrants">Imigrantes</option>
                <option value="education">Educacion</option>
                <option value="rehab">Rehabilitación</option>
                <option value="homeless">Sin hogar</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaRegStickyNote />{" "}
              <label htmlFor="description">Descripcion</label>
            </div>
            <div className="col-75">
              <textarea
                onChange={handleChange}
                name="description"
                placeholder="Fundada en 1997, en la Ciudad de México como institución sin lucro, brindamos apoyo a niñas adolescentes desamparados y en riesgo, incluyendo casa, comida, vestimenta, educación, atención médica y psicológica más recreación de varias htmlFormas."
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaClock /> <label htmlFor="schedule">Horario de atención</label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="schedule"
                placeholder="Lun-Vi 7:00 am-8:00pm"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaRegIdCard /> <label htmlFor="rfc"> RFC</label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="rfc"
                placeholder="ABC123456DEF"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaUserTie />{" "}
              <label htmlFor="responsible"> Persona Responsable </label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="responsible"
                placeholder="Ana Fuentes"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaEnvelope /> <label htmlFor="mail"> Correo </label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="text"
                name="email"
                placeholder="ejemplo@gmail.com"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <FaKey /> <label htmlFor="pass"> Contraseña </label>
            </div>
            <div className="col-75">
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Minimo 6 caracteres"
              />
            </div>
          </div>
          <div className="row">
            <input type="button" onClick={register} value="Registrarme" />
          </div>
        </div>
      </Layout>
    )
  }
}

export default withAlert(Registration)
