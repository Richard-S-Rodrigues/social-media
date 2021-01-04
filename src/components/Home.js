import React, {useContext, useState, useEffect} from 'react'

import Header from './Header'

import { UserContext } from '../providers/UserProvider'

import { Avatar } from '@material-ui/core'

import ChatIcon from '@material-ui/icons/Chat'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'

import { firestore } from '../firebase.js'

import { v4 as uuidv4 } from 'uuid'

import { useHistory } from 'react-router-dom'

export default function Home() {

    const { userName, userPhotoURL, userId, postsLiked } = useContext(UserContext)

    const [statusContent, setStatusContent] = useState('')
    const [statusData, setStatusData] = useState([])

    const [replyData, setReplyData] = useState([])

    const [postsUserLiked, setPostsUserLiked] = useState([])

    useEffect(() => {
        // Render posts
        getPost()

    }, [])

    useEffect(() => {
        setPostsUserLiked(postsLiked)
    }, [postsLiked])

    // Set status content
    const handleStatusOnChange = (event) => {
        const {name, value} = event.currentTarget

        if(name === 'status') {
          setStatusContent(value)

        } 
    }
    // Submit status content
    const handleStatusSubmit = async (event) => {
        event.preventDefault()

        if (statusContent === '') {
            return 
        } else {

            const today = new Date()
            const date = today.getDate() + '-' + (today.getMonth() + 1) + '-'
            + today.getFullYear()

            try {

                await firestore.collection('posts').add({
                    content: statusContent,
                    userName,
                    photoURL: userPhotoURL,

                    userId,

                    date,
                    last_updated: today,

                })

            } 
            catch(error) {
                console.error('Error submiting status...', error)
            }

            setStatusContent('')

            getPost()
        }
        
    }

    const getPost = async () => {

        setStatusData([])


        try {
            await firestore.collection("posts")
            .orderBy("last_updated", "desc")
            .get()
            .then(snapshot => {

                snapshot.forEach(doc => {   

                    setStatusData(dataContent => ([
                        
                        ...dataContent,
                        {   
                            content: doc.data().content,
                            user: doc.data().userName,
                            photoURL: doc.data().photoURL,
                            postUserId: doc.data().userId,

                            postId: doc.id 
                        }
                    ]))
                                                
                })

            })    
        }
        catch (error) {
            console.error('Error getting posts', error)
        }

    }

    const handlePostLikes = (postId) => {
        

        if (postsUserLiked.indexOf(postId) !== -1) {
            // Remove like

            // Array without removed item
            postsUserLiked.splice(postsUserLiked.indexOf(postId), 1)

            firestore.collection('users').doc(userId).update({
                posts_liked: [...postsUserLiked]
            })

            setPostsUserLiked([...postsUserLiked])


        } else {
            // Set like

            firestore.collection('users').doc(userId).update({
                posts_liked: [ postId, ...postsUserLiked]
            })
            setPostsUserLiked([postId, ...postsUserLiked])

        }


    }

    const setReply = async (event, {postId}) => {
        event.preventDefault()

        const replyValue = event.currentTarget[0].value

        if (replyValue === '') {
            return
        } else {

            try {

                await firestore.collection('posts').doc(postId)
                .collection('replies').add({

                    user: userName,
                    userPhoto: userPhotoURL,
                    reply: replyValue,
                    statusId: postId
                })

            }
            catch (error) {
                console.error(error)
            }

        }

        getReplies(postId)
    }

    const getReplies = async (postId) => {

        setReplyData([])

        try {

            await firestore.collection('posts').doc(postId)
                .collection('replies').get()
                .then(snap => {

                    snap.forEach(doc => {

                        setReplyData(dataContent => ([
                            ...dataContent,
                            {
                                user: doc.data().user,
                                userPhoto: doc.data().userPhoto,
                                reply: doc.data().reply,
                                statusId: doc.data().statusId
                            }
                        ]))

                    })

                })

        }
        catch (error) {
            console.error(error)
        }

        
    }

    const history = useHistory()
    // Send to user profile
    const sendToUser = (idPath) => {
        localStorage.setItem('location', JSON.stringify(idPath))
        history.push(`/${idPath}`)
    }



	return (
		<div>
            <div>
                <Header />
            </div>
                      
            <div className='container w-60 mt-5 rounded'>
              	<div className=' d-flex bg-dark rounded w-100 py-2 flex-row'>
                    <div className='ml-2'>
                        <Avatar 
                            src={userPhotoURL} 
                            alt='Profile picture' 
                            style={{width: '4em', height: '4em'}}
                        />
                    </div>

                    <div className='ml-5 mt-2 text-primary'>
                        <h3>{userName}</h3>
                    </div>
                </div>

                <form className='mt-2' onSubmit={(event) => handleStatusSubmit(event)}>
                    <label htmlFor='status'>Add a status</label>
                    <input 
                        id='status'
                        name='status' 
                        placeholder="What's on your mind?"
                        className='form-control py-4'
                        value={statusContent}
                        onChange={handleStatusOnChange}
                    />

                    <button className='btn btn-primary form-control'>Add Status</button>
                </form>


                <div className='mt-5'>

                    {statusData.map(value => (

                    <div key={uuidv4()}
                    className='mt-2 border container'>
                                    
                        <div>
                            <div className='mb-2 d-inline-flex' style={{cursor: 'pointer'}}
                            onClick={() => sendToUser(value.postUserId)}>
                                <Avatar 
                                    src={value.photoURL}
                                    style={{width: '3em', height: '3em'}} 
                                />

                                <h4 className='ml-4 mt-2'>{value.user}</h4>
                            </div>

                            <div className='ml-4 mt-3'>
                                <article>
                                    <p>{value.content}</p>
                                </article>

                            </div>

                        </div>

                        <form className='row' onSubmit={(event) => setReply(event, value)}>
                            <input
                                className='my-4 col' 
                                placeholder='Reply'
                            />
                            <button className='col col-lg-2 my-4 btn btn-primary'>Send</button>
                                    
                        </form>
                        
                        <div>
                            <ChatIcon style={{cursor: 'pointer'}}   
                            onClick={() => getReplies(value.postId)}/>

                            
                            {(postsUserLiked.indexOf(value.postId) !== -1)
                            ?
                                <FavoriteIcon 
                                    onClick={() => 
                                        handlePostLikes(value.postId)
                                    }
                                    style={{
                                        marginLeft: '1em', 
                                        marginBottom: '0.1em', 
                                        cursor: 'pointer'
                                    }} 
                                />

                            :

                                <FavoriteBorderIcon 
                                    onClick={() => 
                                        handlePostLikes(value.postId)
                                    }
                                    style={{
                                        marginLeft: '1em', 
                                        marginBottom: '0.1em', 
                                        cursor: 'pointer'
                                    }} 
                                />
                                        
                            }

                        </div>

                        <section className='mt-5'>

                            {replyData.map(replyValue => (

                                (replyValue.statusId === value.postId) 
                                ?
                                    <div key={uuidv4()}
                                    className='border p-2 mb-2'>

                                        <div className='mb-2 d-inline-flex'>
                                            <Avatar 
                                                src={replyValue.userPhoto}
                                                style={{width: '2em', height: '2em'}} 
                                            />

                                            <h5 className='ml-4'>{replyValue.user}</h5>
                                        </div>

                                        <div className='mt-2'>
                                            <p>{replyValue.reply}</p>
                                        </div>

                                    </div>
                                : 
                                    <div key={uuidv4()}></div>
                                

                            ))}

                        </section>

                    </div>
                    ))}

                </div>
            </div>
        </div>
	)
}