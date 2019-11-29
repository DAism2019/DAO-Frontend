/* !

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. */
import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import Web3Provider, {Connectors} from 'web3-react'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ThemeProvider from 'theme'
import Web3ReactManager from 'Web3ReactManager'
import { getPathBase } from 'utils'
// core components
import Admin from "layouts/Admin.jsx";
import "assets/css/material-dashboard-react.css?v=1.7.0";
//multi language
import './i18n'
//provider
import SnackBarProvider from 'contexts/SnackBarProvider.jsx'

const {InjectedConnector, NetworkOnlyConnector} = Connectors
const Injected = new InjectedConnector({
    supportedNetworks: [Number(process.env.REACT_APP_NETWORK_ID || '1')]
})
const Network = new NetworkOnlyConnector({
    providerURL: process.env.REACT_APP_NETWORK_URL || ''
})
const connectors = {
    Injected,
    Network
}

function LoginPanel() {
    return (
        <>
            <ThemeProvider>
                <Web3Provider connectors={connectors} libraryName="ethers.js">
                    <SnackBarProvider>
                         <MainPanel/>
                    </SnackBarProvider>
                </Web3Provider>
            </ThemeProvider>
        </>

    )
}

function MainPanel() {
    return (
          <Suspense fallback = {null} >
               <Web3ReactManager >
                   <Router  basename={getPathBase()}>
                       <Switch>
                           <Route path="/" component={Admin}/>
                       </Switch>
                   </Router>
                </Web3ReactManager>
           </Suspense >
    )
}

ReactDOM.render(<LoginPanel/>, document.getElementById("root"));
