import React from "react"
import styled from "styled-components"
import { Link, Redirect } from "react-router-dom"
import Cookies from "js-cookie"

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid green;
  padding-bottom: 1rem;
`

const NavItems = styled.div`
  flex-basis: 25%;
  display: flex;
  justify-content: flex-end;
`

const Logout = styled.button`
  cursor: pointer;
  background-color: unset;
  border: 0;
  font-weight: 500;
  font-size: 1rem;
  padding: 0;
  color: red;
`

const NavItem = styled.div`
  font-size: 1rem;
  a {
    text-decoration: none;
    color: #000;
  }
  margin-right: 1rem;
`

const Title = styled(NavItem)`
  font-size: 1.5rem;
`

class Header extends React.PureComponent {
  state = { loggedout: false }
  componentDidMount() {
    const username = Cookies.get("username")
    this.setState({ username })
  }

  logout = () => {
    Cookies.remove("username")
    Cookies.remove("session")
    this.setState({ loggedout: true })
  }

  render() {
    const {
      logout,
      state: { loggedout, username }
    } = this
    return (
      <Nav>
        <Title>
          <Link to="/">¿Dondé puedo donar?</Link>
        </Title>
        <NavItems>
          {username && (
            <NavItem>
              <Link to="/manage">Administrar donaciones</Link>
            </NavItem>
          )}
          <NavItem>
            {username ? (
              <Logout onClick={logout}>Salir sesion, {username}</Logout>
            ) : (
              <Link to="/login">Inicia sesion</Link>
            )}
          </NavItem>
          <NavItem>
            {!username && (
              <Link to="/register">Registro para centros de apoyo</Link>
            )}
          </NavItem>
        </NavItems>
        {loggedout && <Redirect to="/" />}
      </Nav>
    )
  }
}

export default Header
