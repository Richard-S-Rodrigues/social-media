import React from 'react'

import './Global.css'

import UserProvider from './providers/UserProvider'

import Application from './Application'

function App() {


    return (
        
        <UserProvider>
          <Application/>
        </UserProvider>

    );
}

export default App;
