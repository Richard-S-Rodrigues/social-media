import firebase from 'firebase'
import "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyCVQiK4Yixx4n8-iqwdDPS0U85dMnEo6Iw",
  authDomain: "social-media-7d6af.firebaseapp.com",
  databaseURL: "https://social-media-7d6af.firebaseio.com",
  projectId: "social-media-7d6af",
  storageBucket: "social-media-7d6af.appspot.com",
  messagingSenderId: "23756131077",
  appId: "1:23756131077:web:9d19ff1b357911cbb8056c",
  measurementId: "G-X97CPMJXRN"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const createUser = async (user, {name, about, following, followers, posts_liked}) => {
	if (!user) return

	const { email } = user

	try {
		await firestore.collection('users').add({
			name,
			email,
			about,
			following,
			followers,

			posts_liked
		})
	} catch (error) {
		console.error('Error creating user document...', error)
	} 

}

