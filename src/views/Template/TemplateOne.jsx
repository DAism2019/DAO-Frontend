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
import React, {useState, useEffect, useRef,Suspense,lazy} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { isMobile } from 'react-device-detect'
import { useWalletInfosContract,useTemplateOneContract} from 'hooks';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useTranslation } from 'react-i18next'
import Pagination from "material-ui-flat-pagination"
import {useWeb3Context} from 'web3-react';
import { getIndexArray,convertTimetoTimeString,getContract,calculateGasMargin,isAddress } from 'utils'
import styled from 'styled-components'
import { utils,constants } from 'ethers'


const useStyles = makeStyles(theme => ({
    cardCategoryWhite: {
        // color: "rgba(33,33,33,.99)",
        color: "white",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    copyText:{
     // width:"100%",
     textAlign:"right",
     textDecoration:"underline",
     fontSize:"13px",
     marginBottom: isMobile ? theme.spacing(0) : theme.spacing(-2)
    },
    RewardText:{
     // width:"100%",
     textAlign:"left",
     // textDecoration:"underline",
     color:"red",
     fontSize:isMobile?"13px":"18px",
     // marginBottom: isMobile ? theme.spacing(-1) : theme.spacing(-5)
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    },
      transferButton: {
        margin: theme.spacing(2),
        width:isMobile ? "40%" :"10%",
        backgroundColor:'#FF8623'
      },
    buttonWrapper:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

function TemplateOne({address}) {
    const classes = useStyles()
    const {t} = useTranslation()
    const showSnackbar= useSnackbarContext()
    const {library,account} = useWeb3Context()
    const template_one_contract = useTemplateOneContract(address)

    return (
        <Card>

        </Card>
    )
}

TemplateOne.propTypes = {
    classes: PropTypes.object
};

export default TemplateOne
