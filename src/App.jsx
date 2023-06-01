// import { useState } from 'react'
//JFA: Import useEffect from React
import React, {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// JFA: Import the ForgeRock Login Widget
import Widget, {component, configuration, journey, user} from '@forgerock/login-widget';
import '@forgerock/login-widget/widget.css';


function App() {
  // const [count, setCount] = useState(0)

  // JFA: Log the current value used for the baseUrl
  console.log("JFA: AMURL: " + import.meta.env.VITE_AMURL);

  // JFA: Create a constant to hold the User Info value returned
  const [userInfo, setUserInfo] = useState(null);

  // JFA: Instantiate all the ForgeRock Login Widget Modules
  const config = configuration();
  const componentEvents = component();
  const journeyEvents = journey();

  // JFA: Initially tell React this has depenencies at this point and should only run once
  useEffect(() => {}, []);

  useEffect(() => {
    // JFA: Configure the ForgeRock Login Widget to call the ForgRock platform
    config.set({
      forgerock: {
        serverConfig: {
          // baseUrl: 'https://FQDN/am/',
          baseUrl: import.meta.env.VITE_AMURL,
          timeout: 3000,
        },
        clientId: 'ForgeRockSDKClient',
        scope: 'openid profile email address phone',
        redirectUri: window.location.href,
      },
    });
    
    // JFA: Instantiate the ForgeRock Login Widget
    const widget = new Widget({target:document.getElementById('widget-root')});

    // JFA: Unsubsribe from the observable to avoid memory leaks at component mounts and unmounts
    const journeyEventsUnsub = journeyEvents.subscribe((event) => {
      console.log("JFA: === Begin ===")
      console.log(event);
      if (event.user.response) {
        console.log("JFA: User Response:")
        console.log(event.user.response);
        if(userInfo !== event.user.response) {
          console.log("JFA: New User Info received")
          setUserInfo(event.user.response);
        }
      }
      console.log("JFA: === End ===");
    });

    return () => {
      widget.$destroy();
      journeyEventsUnsub();
    };
  }, [config, journeyEvents, userInfo]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>JFA: ForgeRock Login Widget Demo</h2>
      <div className="card">
        {
          !userInfo ? (
            <button
              onClick={() => {
                journeyEvents.start();
                componentEvents.open();
              }}>
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                user.logout();
              }}>
              Logout
            </button>
          )
        }
        <h2>JFA: User Profile Attributes</h2>
        <pre>{JSON.stringify(userInfo, null, ' ')}</pre>
      </div>
        <p>JFA: The ForgeRock baseUrl is set using the <b>VITE_AMURL</b> environment variable. You can use a dotenv file or simply set it from the command line.</p>
        <p>JFA: For example, <b>export VITE_AMURL=https://openam.example.com/am</b>. Replace the FQDN with your host and if required adjust the /am path.</p>
        <p>JFA: Check console log for the current VITE_AMURL value.</p>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
