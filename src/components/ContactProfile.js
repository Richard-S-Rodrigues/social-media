import React, { useState, useEffect, useContext} from 'react'

import Header from './Header'

import { UserContext } from '../providers/UserProvider'

import { useHistory } from 'react-router-dom'

import { firestore } from '../firebase.js'

import { Avatar } from '@material-ui/core'

import { v4 as uuidv4 } from 'uuid'

export default function ContactProfile() {

	const { userEmail, userId, userFollowing } = useContext(UserContext)

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [photoURL, setPhotoURL] = useState('')
	const [about, setAbout] = useState('')
	const [followers, setFollowers] = useState('')
	const [following, setFollowing] = useState('')

	const [contacts, setContacts] = useState([])

	const [isFollowing, setIsFollowing] = useState(false)

	const history = useHistory()

	useEffect(() => {

		const pathId = window.location.pathname.replace('/', '')

		if (pathId === userId) {
			history.push('/profile')
		}

		try {

			firestore.collection('users').get()
			.then(snapshot => {

				snapshot.forEach(doc => {

					if (doc.id === pathId) {

						// Check if the user is already following
						Array.from(doc.data().followers).forEach(value => {
							if (value === userEmail) {
								setIsFollowing(true)
							} else {
								setIsFollowing(false)
							}
						})

						setName(doc.data().name)
						setEmail(doc.data().email)
						setPhotoURL(doc.data().photoURL)
						setAbout(doc.data().about)
						setFollowers(doc.data().followers)
						setFollowing(doc.data().following)
					}


				})

			})

		}
		catch (error) {
			console.error(error)
		}
		// eslint-disable-next-line
	}, [])

	const handleUserContacts = async (event) => {
		event.preventDefault()

		// Show or hide contacts
		document.getElementById('contacts').classList.toggle('d-block')

		const { name } = event.currentTarget

		if (name === 'following') {		

			setContacts([
				...following
			])

		} else if (name === 'followers') {		

			setContacts([
				...followers
			])
						

		}


	}

	const handleFollowBtn = async (event) => {

		const pathId = window.location.pathname.replace('/', '')

		try {

			await firestore.collection('users').get()
			.then(snapshot => {

				snapshot.forEach(doc => {

					if (doc.id === pathId) {


						setFollowers([...followers])
						
						firestore.collection('users').doc(doc.id).update({
							followers: followers !== '' ? [...followers, userEmail] : [userEmail]
						})

						firestore.collection('users').doc(userId).update({
							following: userFollowing !== '' ? [...userFollowing, email] : [email]
						})
						
					}


				})

			})

			setIsFollowing(!isFollowing)
			

		}
		catch (error) {
			console.error(error)
		}


	}

	const handleContactProfile = (contactEmail) => {


		try {

			firestore.collection('users').get()
			.then(snapshot => {

				snapshot.forEach(doc => {

					if (doc.data().email === contactEmail) {

						localStorage.setItem('location', JSON.stringify(doc.id))
						history.push(`/${doc.id}`)
					}

				})

			})

		}
		catch (error) {
 			console.error(error)

		}

		

	}

	return (
		<div>
			<div>
				<Header />
			</div>

			<div style={{width: '65%'}} className='
			container d-flex justify-content-center mt-5 mw-auto bg-dark text-white flex-column rounded'>
												

				<section className='d-block ml-5'>
					<div className='row pt-2 mr-0 '>

						<div className='col'>
	
							<Avatar src={photoURL}
								style={{width: '8.5em', height: '8.5em'}} 
								alt='Profile picture' 
							/>
						</div>

						<div className='col mt-5 mr-5'>
							<h1>{name}</h1>
						</div>
					</div>

					<div className='mt-4'>
						<h3>About</h3>

						<textarea readOnly className='bg-dark text-white'
							value={about}
							style={{
								width: '20em', 
								height: '9em', 
								padding: '1em 1em', 
								fontSize: '20px',
								fontWeight: '700',
								border: '0.1em solid #007bff',
								borderRadius: '0.5em'
							}}
						/> 
					</div>

					<div
					className='row mt-2'>

						<form className='col d-flex'>
							<div >
								<button 
									className='btn btn-outline-primary'
									name='following'
									onClick={(event) => handleUserContacts(event)}
									>FOLLOWING
									
								</button>
							</div>

							<div className='ml-4'>
								<button 
									className='btn btn-outline-primary'
									name='followers'
									onClick={(event) => handleUserContacts(event)}
									>FOLLOWERS
									
								</button>
							</div>
						</form>

						<div className='col'>

							{(isFollowing)

								?
									<button
										className='btn btn-danger'

										onClick={async (event) => {

											// Remove from his followers
											followers.splice(userEmail, 1)
											// his id
											let id = window.location.pathname.replace('/', '')
											await firestore.collection('users').doc(id).update({
												followers: [...followers]
											})

											setFollowers([...followers])

											// Remove from my following list
											userFollowing.splice(email, 1)

											await firestore.collection('users').doc(userId).update({
												following: [...userFollowing]
											})

											setIsFollowing(false)

										}}

									>STOP FOLLOWING</button>

								:
									<button 
										onClick={handleFollowBtn} 
										className='btn btn-primary'
										>FOLLOW
									</button>

							}
							
						</div>
					</div>

					
				</section>

				<section id='contacts' className='d-none bg-dark align-center mt-5 container'>
					{contacts.map(data => (
						

						<ul className='w-100 col' key={uuidv4()}>
							<li onClick={() => handleContactProfile(data)} 
								className='row border-bottom py-4 border-secondary'
								style={{cursor: 'pointer'}}
							>{data}</li>
						</ul>	
					))}
				</section>
			</div>
		</div>
	)
}