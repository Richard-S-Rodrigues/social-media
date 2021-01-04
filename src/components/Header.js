import React from 'react'

import { Link, useHistory } from 'react-router-dom'

import { auth } from '../firebase.js'

export default function Header() {

	const history = useHistory()

	const signOutHandler = () => {
		auth.signOut()
		.then()
		.catch()

		history.push('/')
		window.location.reload()
	}


	return (
		<header className='d-flex container-fluid bg-dark text-white py-2 px-4 justify-content-between'>
			<div className=''>
				<Link to='/'><h1>Social Media</h1></Link>
			</div>

			<div className='py-2'>
	
				<Link className='btn btn-link' to='/profile'>PROFILE</Link>
				
				<button className='btn btn-primary' onClick={signOutHandler}>SIGN OUT</button>
			</div>
		</header>
	)
}