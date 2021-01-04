import React, {useState, useEffect, createContext} from 'react'

import { auth, firestore } from '../firebase.js'

export const UserContext = createContext()

export default function UserProvider(props) {

	const [userName, setUserName] = useState('')
	const [userId, setUserId] = useState('')
	const [userEmail, setUserEmail] = useState('')
	const [userPhotoURL, setUserPhotoURl] = useState('')
	const [userAbout, setUserAbout] = useState('')
	const [userFollowers, setUserFollowers] = useState('')
	const [userFollowing, setUserFollowing] = useState('')
	const [postsLiked, setPostsLiked] = useState([])


	useEffect(() => { 

		auth.onAuthStateChanged(async userAuth => {

			if (userAuth) {

				try {

					await firestore.collection('users').get()
					.then(querySnapshot => {
						querySnapshot.forEach(doc => {

							if (doc.data().email === userAuth.email) {

								setUserName(doc.data().name)
								setUserEmail(doc.data().email)
								setUserPhotoURl(doc.data().photoURL || '')
								setUserAbout(doc.data().about)
								setUserFollowers(doc.data().followers)
								setUserFollowing(doc.data().following)
								setUserId(doc.id)

								setPostsLiked(doc.data().posts_liked || [])

							}
						})
					})
				} catch(error) {
					console.error('Error getting user data...', error)
				}	
					
			}
		})
		

	}, [])
	
	



	return (
		<UserContext.Provider 
		value={{
			userEmail, 
			userName,
			userPhotoURL,
			userId,
			userAbout,
			userFollowers,
			userFollowing,

			postsLiked
		}} >
			{props.children}
		</UserContext.Provider>
	)
	
}
