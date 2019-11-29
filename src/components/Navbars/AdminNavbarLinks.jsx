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
import React from 'react'
import Web3Status from 'Web3Status'
// import withStyles from "@material-ui/core/styles/withStyles";
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect'
import PropTypes from "prop-types";
import {useWeb3Context} from 'web3-react'
import styled from 'styled-components'
import {Spinner} from 'theme'
import Circle from 'assets/img/circle.svg'
import LanguageBtn from "components/LanguageBtn"

const fontColor = isMobile ? "white" : "black";

const SpinnerWrapper = styled(Spinner)`
  font-size: 4rem;
  svg {
    path {
      color: ${ ({
    theme}) => theme.uniswapPink};
    }
  }
`

const useStyles = makeStyles(theme => ({
    web3Wrapper:{
        // width:"100%",
        display: 'flex',
        flexDirection: 'column',
        // margin:theme.spacing(5),
        alignItems: 'center'
    },
    web3WrapperMobile:{
        // width:"100%",
        display: 'flex',
        flexDirection: 'column',
        marginBottom:theme.spacing(-3),
        alignItems: 'center'
    },
    displayAll:{
        // width:"100%",
        display:"flex",
        flexDirection: isMobile ? "column" : "row",
    },
    showLoading:{
        marginTop:theme.spacing(2.5),
        marginRight:theme.spacing(2),
    }
}));

function AdminNavbarLinks() {
    const {active} = useWeb3Context()
    const classes = useStyles();

    return (
        <div className={classes.displayAll} >
                {active
                ? <div className={classes.web3Wrapper}>
                    <Web3Status/>
                </div>
                : <div className={isMobile ? classes.none :classes.showLoading } >
                    <SpinnerWrapper src={Circle} /><span style={{color: isMobile ? "white" : "balck"}} >loading...</span>
                </div>}

             <div className={ isMobile ? classes.web3WrapperMobile : classes.none}>
                 <LanguageBtn fontColor={fontColor} />
            </div>
        </div>
       )
}

AdminNavbarLinks.propTypes = {
  classes: PropTypes.object
};

export default AdminNavbarLinks;
