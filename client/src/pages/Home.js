import React from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import GoogleMap from "google-map-react"
import styled from "styled-components"
import Geocode from "react-geocode"
import Axios from "axios"
import CenterModal from "../components/CenterModal"

Geocode.setApiKey("AIzaSyAZ2Ctykt1TmoaUCune3iUTUWQltHZHd_E")

const InfoWindowWrapper = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.25rem;
  display: inline-block;
  position: relative;
  div {
    position: absolute;
    width: 0;
    height: 0;
    bottom: -1.5rem;
    left: 0;
    border-top: 30px solid white;
    border-right: 30px solid transparent;
  }
`

const InfoWindow = ({ data, children, handler, $hover }) => (
  <InfoWindowWrapper data-id={data} onClick={handler}>
    <div />
    {$hover ? children : null}
  </InfoWindowWrapper>
)

class Home extends React.PureComponent {
  getCenters = async () => {
    const result = await Axios.get("/api/centers").then(res => res.data)
    return result
  }

  static defaultProps = {
    zoom: 11
  }

  state = {
    modalIsOpen: false,
    currentId: -1,
    pos: {
      lat: 19.4271749,
      lng: -99.1687312
    },
    centers: []
  }

  //Get client's location
  async componentDidMount() {
    //load all centers into state
    const centers = await this.getCenters()
    this.setState({ centers })
    //set map center using user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.setState({ pos })
        //infoWindow.setPosition(pos)
        ////infoWindow.setContent("Location found.")
        //infoWindow.open(Map)
      })
    }
  }

  openModal = event => {
    const currentId = event.target.dataset.id
    this.setState({ currentId, modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const {
      closeModal,
      openModal,
      state: { pos, centers, modalIsOpen, currentId }
    } = this
    const InfoWindows = centers.map(({ id, lat, lng, name, phone }) => (
      <InfoWindow
        key={name}
        lat={lat}
        lng={lng}
        text={name}
        data={id}
        handler={openModal}
      >
        {name}
      </InfoWindow>
    ))
    return (
      <Layout>
        <Link to="/manage">Manage</Link>

        <div style={{ height: "80vh", width: "100vw" }}>
          <GoogleMap
            bootstrapURLKeys={{
              key: "AIzaSyAZ2Ctykt1TmoaUCune3iUTUWQltHZHd_E"
            }}
            center={pos}
            zoom={this.props.zoom}
          >
            {InfoWindows}
          </GoogleMap>
          <CenterModal
            centerId={currentId}
            onRequestClose={closeModal}
            modalIsOpen={modalIsOpen}
          />
        </div>
      </Layout>
    )
  }
}

export default Home
