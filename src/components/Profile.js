import React, { useContext, useState } from 'react'

import { Avatar } from '@material-ui/core'

import Header from './Header'

import { UserContext } from '../providers/UserProvider'

import { firestore, storage } from '../firebase.js'

import { v4 as uuidv4 } from 'uuid'

import { useHistory } from 'react-router-dom'

export default function Profile() {

	const { 
		userName, 
		userId, 
		userEmail, 
		userPhotoURL, 
		userAbout, 
		userFollowers,
		userFollowing } = useContext(UserContext)

	const [name, setName] = useState('')
	const [about, setAbout] = useState('')

	const [profileImageUrl, setProfileImageUrl] = useState(userPhotoURL)

	const [contacts, setContacts] = useState([])


	const handleProfileImage = (event) => {
		const image = event.target.files[0]

		if (image.name === '') {
			console.error('No image provided...')

		} else {

			try {
				const uploadTask = storage.ref(`/images/${image.name}`)
				.put(image)

				uploadTask.on('state_changed', 
					(snapshot) => {
						//takes a snap shot of the process as it is happening

					}, (err) => {
						console.error(err)

					}, () => {

						// Get the image url in firebase storage to set the profile picture url
						storage.ref('images').child(image.name).getDownloadURL()
						.then(firebaseUrl => {
							setProfileImageUrl(firebaseUrl)
						})
					}
				)

			} catch(err) {
				console.error(err)
			}
		}
	}

	const handleEditProfile = async (event) => {
		event.preventDefault()	

		try {		

			// Set the previous name and about if the user don't provide any new
			if (name === '') return setName(userName)
			if (about === '') return setAbout(userAbout)

			await firestore.collection('users').doc(userId).set({
				name,
				about,
				email: userEmail,
				followers: userFollowers,
				following: userFollowing,
				photoURL: profileImageUrl
			})

			// Reload the page to display the updated content
			window.location.reload()

		} catch (error) {
			console.error('Error updating user data...', error)
		}
		
	}

	// Handle profile changes
	const handleOnChange = (event) => {
		
		const { name, value } = event.currentTarget

		if (name === 'name') {
			setName(value)

		} else if (name === 'about') {
			setAbout(value)
		}
	}


	const handleUserContacts = (event) => {
		event.preventDefault()

		// Show or hide contacts
		document.getElementById('contacts').classList.toggle('d-block')

		const { name } = event.currentTarget

		if (name === 'following') {
	

			setContacts(
				[ ...userFollowing ] 
			)
								
		} else if (name === 'followers') {

			setContacts([
				...userFollowers
			])							
						
		}

	}

	const history = useHistory()

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
			<div id='edit' 
			className='d-none container justify-content-center mt-5 py-2 mw-auto bg-dark text-white flex-column rounded'>
				<div className='w-50 ml-5' >

					<div className='mt-2'>
						<Avatar src={profileImageUrl}
							style={{width: '8.5em', height: '8.5em'}} 
							alt='Profile picture' 
						/>

						<div className="upload-btn-wrapper">
							<button className='btn btn-primary'>Upload your profile photo</button>
							<input
								type="file" 
								name='image' 
								accept="image/*"
								onChange={handleProfileImage}
							/>
						</div>
					</div>

					<form className='form-group' onSubmit={handleEditProfile}>

						<div className='my-4'>
							<label htmlFor='nickname'>Name:</label>
							<input id='nickname'
								name='name' 
								placeholder='Change your name...' 
								className='form-control py-4'
								onChange={handleOnChange}
							/>
						</div>

						<div>
							<label htmlFor='about'>About:</label>
							<textarea 
								id='about'
								name='about' 
								className='form-control py-2' 
								placeholder='Write about you...'
								onChange={handleOnChange}
							/>
						</div>

						<div className='my-3'>
							<button className='btn btn-primary'>Edit profile</button>
						</div>

					</form>
				</div>
			</div>

			<div style={{width: '100%'}} className='
			container d-flex justify-content-center mt-5 mw-auto bg-dark text-white flex-column rounded'>
				

				<svg style={{cursor: 'pointer'}} alt='Edit profile'
					onClick={() => {
						document.getElementById('edit').classList.toggle('d-flex')
					}}  
					
					xmlns="http://www.w3.org/2000/svg" 
					width="48" height="48" 
					viewBox="0 0 24 24">
					<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
				</svg>								

				<section className='d-block ml-5'>
					<div className='row pt-2 mr-0 '>

						<div className='col'>
	
							<Avatar src={userPhotoURL}
								style={{width: '8.5em', height: '8.5em'}} 
								alt='Profile picture' 
							/>
						</div>

						<div className='col mt-5 mr-5'>
							<h1>{userName}</h1>
						</div>
					</div>

					<div className='mt-4'>
						<h3>About</h3>

						<textarea readOnly className='bg-dark text-white'
							value={userAbout}
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

					<form
					className='row mt-2'>

						<div className='col'>
							<button 
								className='btn btn-outline-primary'
								name='following'
								onClick={(event) => handleUserContacts(event)}
								>FOLLOWING
							</button>
						</div>

						<div className='col'>
							<button 
								className='btn btn-outline-primary'
								name='followers'
								onClick={(event) => handleUserContacts(event)}
								>FOLLOWERS
							</button>
						</div>
					</form>
				</section>

				<section id='contacts' className='d-none bg-dark align-center mt-5 container'>
					{contacts.map(data => (

						<ul className='w-100 col' key={uuidv4()}>
							<li id='contactsList' 
								className='row d-flex justify-content-between border-bottom py-4 border-secondary'
								style={{cursor: 'pointer', fontSize: '18px'}}

								onClick={() => handleContactProfile(data)}
							>{data}
				
							</li>
						</ul>	
					))}
					
				</section>
			</div>
		</div>
	)
}