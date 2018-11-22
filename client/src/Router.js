import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Provider as AlertProvider } from "react-alert"
import AlertTemplate from "react-alert-template-basic"

import Home from "./pages/Home"
import Registration from "./pages/Registration"
import Management from "./pages/Management"
import Login from "./pages/Login"

const alertOptions = {
  timeout: 5000,
  position: "bottom center"
}

class Router extends React.PureComponent {
  render() {
    return (
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Registration} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/manage" component={Management} />
          </Switch>
        </BrowserRouter>
      </AlertProvider>
    )
  }
}

export default Router
