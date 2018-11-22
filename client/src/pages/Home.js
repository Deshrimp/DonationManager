import React from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
class Home extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/manage">Manage</Link>
      </Layout>
    )
  }
}

export default Home
