import React, { useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

import Routes from './Routes'

import {UserContext} from './providers/UserProvider.js'

export default function Application() {

    const { userId } = useContext(UserContext)
 
    return (
          
            userId ?
              <Routes />
               
            :

              <BrowserRouter>
                <Switch>
                  <Route exact path='/' component={SignIn} />

                  <Route path='/signup' component={SignUp} />
                </Switch>
              </BrowserRouter>
    );
}
