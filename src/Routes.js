import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './components/Home'
import Profile from './components/Profile'
import ContactProfile from './components/ContactProfile'

export default function Routes() {
  // eslint-disable-next-line
	const contactProfileLocation = JSON.parse(localStorage.getItem('location'))

	return (
		<BrowserRouter>
            <Switch>
               	<Route exact path='/' component={Home} />

               	<Route path='/profile' component={Profile} />

               	<Route path='/:contactProfileLocation' component={ContactProfile} />
            </Switch>
        </BrowserRouter>        		
	)
}
