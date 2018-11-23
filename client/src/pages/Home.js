import React from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import GoogleMap from "google-map-react"
import styled from "styled-components"

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

const InfoWindow = ({ text }) => (
  <InfoWindowWrapper>
    <div />
    {text}
  </InfoWindowWrapper>
)

class Home extends React.PureComponent {
  static defaultProps = {
    zoom: 11
  }

  state = {
    pos: {
      lat: 19.4271749,
      lng: -99.1687312
    }
  }

  componentDidMount() {
    this.setState({ lat: 0, lng: 0 })
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

  render() {
    const { pos } = this.state
    return (
      <Layout>
        <Link to="/manage">Manage</Link>
        <div style={{ height: "50vw", width: "50vw" }}>
          <GoogleMap
            bootstrapURLKeys={{
              key: "AIzaSyAZ2Ctykt1TmoaUCune3iUTUWQltHZHd_E"
            }}
            defaultCenter={pos}
            defaultZoom={this.props.zoom}
          >
            <InfoWindow lat={0} lng={0} text={"Kreyser Avrora"} />
          </GoogleMap>
        </div>
      </Layout>
    )
  }
}

export default Home
