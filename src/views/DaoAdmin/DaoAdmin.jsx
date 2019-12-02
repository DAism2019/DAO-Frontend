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
// React components
import React, {useState, useEffect,Suspense,lazy} from "react";
import {withRouter} from 'react-router'
import {useWeb3Context} from 'web3-react';
import {useTranslation} from 'react-i18next'
import {isMobile} from 'react-device-detect'
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//custom ui
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import {useSnackbarContext} from 'contexts/SnackBarProvider.jsx';

//custom tools or hooks
import {useWalletInfosContract,useWalletCommonContract} from 'hooks';
import {convertTimetoTimeString,isAddress} from 'utils'

//other libraries
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import {constants} from 'ethers'

const TemplateOne = lazy(() => import('../Template/TemplateOne.jsx'));

const ContentWrapperTwo = styled.p`
     margin: auto;
     font-size:1.1rem;
 `

const useStyles = makeStyles(theme => ({
    cardCategoryWhite: {
        color: "rgba(255,255,255,.80)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    copyText:{
        textAlign:"right",
        textDecoration:"underline",
        fontSize:"13px",
        marginBottom: isMobile ? theme.spacing(0) : theme.spacing(-2)
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
}));

const dao_info_init = {
    address:'',
    creator:'',
    createTime:'',
    name:'',
    templateIndex:0
}



function DaoDetail({history}) {
    const classes = useStyles()
    const {t} = useTranslation()
    const showSnackbar= useSnackbarContext()
    const hash = history.location.hash
    const {account} = useWeb3Context()
    const [daoInfo,setdaoInfo] = useState(dao_info_init)
    const wallet_infos_contract = useWalletInfosContract()
    const common_contract = useWalletCommonContract(daoInfo.address)
    const [tip,setTip] = useState('')
    const [isOwner,setIsOwner] = useState(false)

    const copyURL = event =>{
        event.preventDefault();
        if(copy(window.location.href)){
            showSnackbar(t("url_copied"),'info')
        }
    };

    //judge dao is exist or not
    useEffect(()=>{
        if(hash && wallet_infos_contract && hash.length > 1){
            let _hash = hash.substring(1);
            if(!isAddress(_hash)){
                setTip(t('search_dao_first'));
            }else{
                //get infos of dapp
                setTip(t('getting'));
                let stale = false;
                async function getDaoInfo() {
                    let infos = await wallet_infos_contract.getWalletInfo(_hash);
                    let creator = infos[0]
                    if (constants.AddressZero === creator){
                        if(!stale){
                           setTip(t('no_dao'))
                        }
                    } else {
                        let templateIndex =  + infos[2]
                        let createTime = (+ infos[3]) * 1000
                        createTime = convertTimetoTimeString(createTime)
                        let name = infos[1]
                        if(!stale){
                            setTip("")
                            setdaoInfo({
                                "address":_hash,
                                creator,
                                templateIndex,
                                createTime,
                                name
                            });
                        }
                    }
                }
                getDaoInfo()

                return ()=>{
                    stale = true
                }
            }
        }else{
            setTip(t('search_dao_first'))
        }
    },[hash,wallet_infos_contract,t])

    //refresh account is owner or not
    useEffect(()=>{
        if( account && common_contract) {
            let stale = false;
            common_contract.isOwner(account).then( result =>{
                if(!stale){
                    setIsOwner(result)
                }
            }).catch(err => {})

            return ()=>{
                stale = true
            }
        }
    },[account,common_contract])

    //show brief info of dao
    function showDaoInfos() {
        const { address,creator,createTime } = daoInfo;
        return (
            <div>
                {isMobile ? <>
                    <ContentWrapperTwo>
                      {t("address") + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {address}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("creator") + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {creator}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("create_time") + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {createTime}
                    </ContentWrapperTwo>
                </>
                : <>
                    <ContentWrapperTwo>
                        {t("address") + ": " + address}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("creator") + ": " + creator}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("create_time") + ": " + createTime}
                    </ContentWrapperTwo>
                </>
              }
            </div>
        )
    }

    function showDaoDetail() {
        switch (daoInfo.templateIndex) {
            case 0:
                return <TemplateOne template_address = {daoInfo.address} />
            default:
                return <TemplateOne  template_address = {daoInfo.address}/>
        }
    }

    //render
    const hasDao = daoInfo.address && true
    return (<>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{t("name") + ": " + daoInfo.name}</h4>
                <p className={classes.cardCategoryWhite}>
                  {tip}
                </p>
            </CardHeader>
            <CardBody>
                {hasDao &&  <div className={classes.copyText}>
                    <Button onClick={copyURL} color='secondary'>
                      {t('click_share')}
                    </Button>
                 </div> }
                {hasDao && showDaoInfos()}
            </CardBody>
        </Card>
        {isOwner && <Suspense fallback={<div>Loading</div>}>
                        {showDaoDetail()}
                    </Suspense>}
    </>)
}

DaoDetail.propTypes = {
    classes: PropTypes.object
};

export default withRouter(DaoDetail)
