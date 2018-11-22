import React from "react"
import { Redirect } from "react-router-dom"
import Axios from "axios"

class Login extends React.PureComponent {
  state = {
    success: false,
    username: "",
    password: ""
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  login = async () => {
    const { username, password } = this.state
    const res = await Axios.post("/api/login", { username, password })
    if ((res.status = 200)) {
      this.setState({ success: true })
    }
  }

  render() {
    const {
      login,
      handleChange,
      state: { username, password, success }
    } = this
    return (
      <div>
        {success && <Redirect to="/manage" />}
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          name="username"
        />
        <label htmlFor="password">Password: </label>
        <input
          type="text"
          name="password"
          onChange={handleChange}
          value={password}
        />
        <button onClick={login}>Login</button>
      </div>
    )
  }
}

export default Login
