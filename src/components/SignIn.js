import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import { auth } from '../firebase.js'

export default function SignIn() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)


    const signInHandler = async (event) => {
        event.preventDefault()

        try {

          await auth.signInWithEmailAndPassword(email, password)

        }
        catch(err) {
          setError("User don't exist")
        }
       

    }


    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget

        if(name === 'userEmail') {
          setEmail(value)

        } else if(name === 'userPassword') {
          setPassword(value)
        }
    }

	return (
        
    <div className='d-block mx-auto w-50 mt-5'>
      <h1 className='text-center'>Sign In</h1>

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
                  className='form-control py-4'
                  type='email'
                  name='userEmail'
                  value={email}
                  placeholder='Your email here...'
                  id='userEmail'
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
                onClick={(event) => signInHandler(event)}>
                Sign In
              </button>

            </div>

            <div>
              <p>Don't have an account? <Link to='signup' >Sign Up</Link></p>
            </div>
          </form>

        </div>
    </div>
      
	)
}