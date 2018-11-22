import React from "react"
import { Redirect } from "react-router-dom"
import Axios from "axios"

class Login extends React.PureComponent {
  state = {
    success: false,
    username: "",
    password: "",
    message: ""
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  login = () => {
    const { username, password } = this.state
    Axios.post("/api/login", { username, password })
      .then(({ data: res }) => {
        if (res.error === false) {
          this.setState({ success: true })
        }
      })
      .catch(err => {
        const { message } = err.response.data
        this.setState({ message })
      })
  }

  render() {
    const {
      login,
      handleChange,
      state: { username, password, success, message }
    } = this
    return (
      <div>
        {success && <Redirect to="/manage" />}
        <label htmlFor="username">RFC: </label>
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
        <button onClick={login}>Login</button>{" "}
        {message && <div className="error">{message}</div>}
      </div>
    )
  }
}

export default Login
