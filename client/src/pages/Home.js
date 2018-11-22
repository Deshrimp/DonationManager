import React from "react"
import { Link } from "react-router-dom"

class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/manage">Manage</Link>
      </div>
    )
  }
}

export default Home
