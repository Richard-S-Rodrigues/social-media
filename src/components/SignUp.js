import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'

import { auth, createUser } from '../firebase.js'

export default function SignUp() {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [error, setError] = useState(null)

  const history = useHistory()

	const signUpHandler = async (event) => {  
    event.preventDefault() 

    
    try {
      
      const {user} = await auth.createUserWithEmailAndPassword(email, password)  

      await createUser(user, {name, about: '', following: [], followers: [], posts_liked: [] })

      history.push('/profile')
      window.location.reload()
    }
    catch(err) {
      setError(err.message)
    }
    
      
  
        
        

	}

	const onChangeHandler = event => {
		const {name, value} = event.currentTarget

		if (name === 'userEmail') {
			setEmail(value)

		} else if (name === 'userPassword') {
			setPassword(value)

		} else if (name === 'userName') {
			setName(value)
		}
	}

	return (
		<div className='d-block mx-auto w-50 mt-5'>
            <h1 className='text-center'>Sign Up</h1>

            <div className='form-group'>
                {error !== null && 
                  <div className='alert alert-danger p-2 font-weight-bold my-3'>
                    {error}
                  </div>
                }

                <form method='POST'>
                  <div>
                    <label htmlFor='userEmail'>
                      Email:
                    </label>
                    <input
                      className='form-control py-4 mb-4'
                      type='email'
                      name='userEmail'
                      value={email}
                      placeholder='Your email here...'
                      id='userEmail'
                      onChange={(event) => onChangeHandler(event)}
                    />

                    <label htmlFor='userName'>
                    	Name:
                    </label>
                    <input
                    	className='form-control py-4' 
                    	name='userName'
                    	id='userName'
                    	value={name}
                    	placeholder='Your name here... (The name that other users will see)'
                    	onChange={(event) => onChangeHandler(event)}
                    />

                  </div>

                  <div className='mt-4 mb-4'>
                      <label htmlFor="userPassword">
                          Password:
                      </label>
                      <input
                          className='form-control py-4'
                          type="password"
                            name="userPassword"
                            value = {password}
                            placeholder="Your Password"
                            id="userPassword"
                            onChange = {(event) => onChangeHandler(event)}
                      />
                  </div>

                      <div className='d-flex'>
                        <button
                          className='d-flex btn btn-primary w-50 py-2 justify-content-center mx-auto ' 
                          onClick={(event) => signUpHandler(event)}>
                          Sign Up
                        </button>

                      </div>

                      <div>
                      	<p>Already have an account? <Link to='/'>Sign In</Link></p>
                      </div>
                </form>

            </div>
        </div>
	)
}