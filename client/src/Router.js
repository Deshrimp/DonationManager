import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Home from "./pages/Home"
import Registration from "./pages/Registration"
import Management from "./pages/Management"

class Router extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Registration} />
          <Route exact path="/manage" component={Management} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router