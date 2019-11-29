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
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import copy from 'copy-to-clipboard'
import { isMobile } from 'react-device-detect'
import { useWalletInfosContract,useTemplateOneContract} from 'hooks';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useTranslation } from 'react-i18next'
import Pagination from "material-ui-flat-pagination"
import {useWeb3Context} from 'web3-react';
import { getIndexArray,convertTimetoTimeString,getContract,getEtherBalance,
    shortenAddress,calculateGasMargin,isAddress } from 'utils'
import styled from 'styled-components'
import { utils,constants } from 'ethers'
import CustomInput from "components/CustomInput/CustomInput.jsx"
// import * as txDecoder from 'ethereum-tx-decoder';

const TemplateOne = lazy(() => import('../Template/TemplateOne.jsx'));

const GAS_MARGIN = utils.bigNumberify(1000);

const ContentWrapperTwo = styled.p`
     margin: auto;
     font-size:1.1rem;
 `

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
        width:isMobile ? "30%" :"10%",
        backgroundColor:'#FF8623'
      },
    buttonWrapper:{
        display: 'flex',
        justifyContent:"center"
    },
    typo: {
        paddingLeft: "25%",
        marginBottom: "20px",
        position: "relative"
    },
    note: {
     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
     bottom: "10px",
     color: "#00c1c2",
     display: "flex",
     flexDirection:"row",
     wrap:"wrap",
     fontWeight: "400",
     fontSize: isMobile ? "13px" : "18px",
     lineHeight:  isMobile ? "13px" : "18px",
     left: "0",
     marginLeft: isMobile ? "10px":"20px",
     position: "absolute",
     width: isMobile ? "90px" : "260px",
     marginTop:isMobile? theme.spacing(-15): theme.spacing(-20),
     maxWidth:isMobile ? "90px" : "260px"
    },
    addressTxt: {
        fontSize: isMobile ? "13px" : "18px",
        marginLeft: isMobile ? 20 : 0,
        width: "60%"
    },
}));

const dao_info_init = {
    address:'',
    creator:'',
    createTime:'',
    name:'',
    templateIndex:0
}

const handle_change_state_init = {
    newOwner:"",
    recipient:"",
    repalce_address:"",
    call_address:'',
    call_data:'',
    call_value:0,
    transferValue:0
}

function DaoDetail({history}) {
    const classes = useStyles()
    const {t} = useTranslation()
    const hash = history.location.hash
    const {library,account} = useWeb3Context()
    const [daoInfo,setdaoInfo] = useState(dao_info_init)
    const wallet_infos_contract = useWalletInfosContract()
    const template_one_contract = useTemplateOneContract(daoInfo.address)
    const [daoContract,setDaoContract] = useState(null)
    //todo template_two_contract;
    // const template_one_contract = useTemplateOneContract(MY_MUTISIG_WALLET)
    const showSnackbar= useSnackbarContext()
    // show dao infos
    const [hasDao,setHasDao] = useState(false)
    const [tip,setTip] = useState('')
    const [isOwner,setIsOwner] = useState(false)
    const [owners,setOwners] = useState([])
    const [open, setOpen] = useState(false);
    const [state,setState] = useState(handle_change_state_init)
    const [balance,setBalance] = useState(0)

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const copyURL = event =>{
        event.preventDefault();
        if(copy(window.location.href)){
            showSnackbar(t("url_copied"),'info')
        }
    };

    const removeOwner = owner => () => {
        //todo
        let add_func = daoContract.interface.functions.removeOwner
        let data = add_func.encode([owner])
        submit_transaction(data)
    };

    const replaceOwner = owner => () => {
        //todo
        setState({
            ...state,
            "repalce_address":owner
        })
        handleClickOpen()
    };
    const handleChange = name =>  event => {
        let value = event.target.value
        setState({
            ...state,
            [name]:value
        })
    };

    const transferEth = () => {
        let address = state.recipient
        if(!isAddress(address)){
            return showSnackbar(t("invalid_address"),'error')
        }
        let value =  + state.transferValue;
        if(Number.isNaN(value) || value <= 0) {
            return showSnackbar(t("invalid_number"),'error')
        }
        value = utils.parseEther("" + value)
        submit_transaction('0x',address,value)
    };

    const submitCustomWork = () => {
        let address = state.call_address
        if(!isAddress(address)){
            return showSnackbar(t("invalid_address"),'error')
        }
        let value =  + state.call_value;
        if(Number.isNaN(value) || value < 0) {
            return showSnackbar(t("invalid_number"),'error')
        }
        value = utils.parseEther("" + value)
        let call_data = state.call_data
        if(call_data.length <=2 || call_data.substring(0,2)!=='0x') {
            return showSnackbar(t("invalid_call_data"),"error")
        }
        submit_transaction(call_data,address,value)
    }

    const submit_transaction = async (data,address=daoContract.address,param_value = constants.Zero ) =>{
        let estimate = daoContract.estimate.submitTransaction
        let method = daoContract.submitTransaction
        let submit_args = [address,param_value,data]
        let value = constants.Zero
        const estimatedGasLimit = await estimate(...submit_args, { value })
        method(...submit_args, {
            value,
            gasPrice:utils.parseUnits('10.0','gwei'),
            gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN) })
        .then(response => {
            showSnackbar(t('transaction_send_success'),'success')
        })
    }

    const addOwner =  event => {
        const {newOwner} = state
        event.preventDefault()
        if(!newOwner){
            return showSnackbar(t("null_input"),'error');
        }else if (!isAddress(newOwner)) {
            return showSnackbar(t("invalid_address"),'error');
        }else {
            let _checksum = utils.getAddress(newOwner)
            if(_checksum === constants.AddressZero) {
                return showSnackbar(t("zero_address"),'error')
            }else if (owners.indexOf(_checksum) !== -1) {
                return showSnackbar(t("owner_existed"),'error')
            }else {
                //...
                let add_args = [_checksum]
                let add_func = daoContract.interface.functions.addOwner
                let data = add_func.encode(add_args)
                submit_transaction(data)
            }
        }
    }

    //show dao
    useEffect(()=>{
        if(hash && wallet_infos_contract && hash.length > 1){
            let _hash = hash.substring(1);
            if(!isAddress(_hash)){
                setTip(t('search_dao_first'));
            }else{
                //get infos of dapp
                // setTip(t('getting'));
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
                            setHasDao(true);
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
        if(daoInfo.address && account && hasDao && wallet_infos_contract && template_one_contract) {
            let stale = false;
            let contract = null
            if(daoInfo.templateIndex === 0) {
                contract = template_one_contract;
            }else{
                //todo
            }
            if(contract) {
                contract.isOwner(account).then( result =>{
                    if(!stale){
                        setDaoContract(contract)
                        setIsOwner(result)
                    }
                }).catch(err => {})
            }
            return ()=>{
                stale = true
            }
        }
    },[account,hasDao,wallet_infos_contract,daoInfo,template_one_contract])

    useEffect(()=>{
        if(daoContract) {
            let stale = false;
            daoContract.getAllOwners().then( owners =>{
                if(!stale){
                    setOwners(owners)
                }
            }).catch(()=>{})
            getEtherBalance(daoContract.address,library).then( balance => {
                if(!stale) {
                    setBalance(balance)
                }
            }).catch(()=>{})
            return ()=>{
                stale = true
            }
        }
    },[daoContract,library])

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
                return (<TemplateOne contract = {daoContract} />)
            default:
                return (<TemplateOne  contract = {daoContract}/>)
        }
    }

    function showOwnerAdmin() {
        return (
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>{t("owner_admin")}</h4>
                    <p className={classes.cardCategoryWhite}>
                      {t('owner_amount').replace("{amount}",owners.length)}
                    </p>
                </CardHeader>
                <CardBody>
                   {owners.map((owner,index) => (showOneOwner(owner,index)))}
                   {showAddOwner()}
                </CardBody>
            </Card>
        )
    }

    function showOneOwner(owner,index) {
        return (
            <div key = {index}>
                {isMobile ? <>
                    <ContentWrapperTwo>
                      {t('owner_address_i').replace("{amount}",index + 1) + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {owner}
                    </ContentWrapperTwo>
                </>
                :  <ContentWrapperTwo>
                   {t('owner_address_i').replace("{amount}",index + 1) + ": " + owner}
                 </ContentWrapperTwo>
              }
              <div className={classes.buttonWrapper}>
                      <Button variant="contained"
                           onClick={removeOwner(owner)} className={classes.transferButton}>
                           {t("remove")}
                     </Button>
                     <Button variant="contained"
                          onClick={replaceOwner(owner)} className={classes.transferButton}>
                          {t("replace")}
                    </Button>

              </div>
              { index !== owners.length && <Divider variant="fullWidth" style={{marginBottom:"20px"}}/> }
            </div>
        )
    }

    function showAddOwner() {
        return (
            <>
                <div className={classes.typo}>
                   <div className={classes.note}>

                           {t("add_owner") + ":"}
                   </div>
                   <CustomInput formControlProps={{
                           className: classes.addressTxt
                       }} inputProps={{
                           placeholder: t("input_new_owner"),
                           inputProps: {
                               "aria-label": "SetLabel"
                           },
                           value:state.newOwner,
                           onChange: handleChange("newOwner")
                       }}/>
               </div>
               <div className={classes.buttonWrapper}>
                   <Button variant="contained"  onClick={addOwner} className={classes.transferButton}>
                       {t('add')}
                   </Button>
               </div>
            </>
        )
    }

    function showDiaglog() {
        let showAddress = state.repalce_address
        if( isAddress(showAddress) && isMobile)
            showAddress = shortenAddress(showAddress)

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{t("replace_owner")}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t("replace_address").replace("{address}",showAddress)}
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="new_owner_address"
                    label={t("new_owner_address")}
                    type="text"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    {t('confirm')}
                  </Button>
                </DialogActions>
          </Dialog>
        )
    }

    function showTransferEth() {
        return(
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>{t("transfer_eth_admin")}</h4>
                    <p className={classes.cardCategoryWhite}>
                      {t('eth_amount') + ": " + utils.formatEther(balance) + " ETH"}
                    </p>
                </CardHeader>
                <CardBody>
                    <div className={classes.typo}>
                       <div className={classes.note}>
                               {t("recipient") + ":"}
                       </div>
                       <CustomInput formControlProps={{
                               className: classes.addressTxt
                           }} inputProps={{
                               placeholder: t("recipient"),
                               inputProps: {
                                   "aria-label": "SetLabel"
                               },
                               value:state.recipient,
                               onChange: handleChange('recipient')
                           }}/>
                   </div>
                   <div className={classes.typo}>
                      <div className={classes.note}>
                              {t("transfer_value") + ":"}
                      </div>
                      <CustomInput formControlProps={{
                              className: classes.addressTxt
                          }} inputProps={{
                              placeholder: t("input_transfer_value"),
                              inputProps: {
                                  "aria-label": "SetLabel"
                              },
                              value:state.transferValue,
                              onChange: handleChange("transferValue")
                          }}/>
                          <span>
                              ETH
                          </span>
                   </div>
                   <div className={classes.buttonWrapper}>
                       <Button variant="contained"  onClick={transferEth} className={classes.transferButton}>
                           {t('transfer_out')}
                       </Button>
                   </div>
                </CardBody>
            </Card>

        )
    }

    function showCustomWork() {
        return(
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>{t("custom_work")}</h4>
                    <p className={classes.cardCategoryWhite}>
                      {t('eth_amount') + ": " + utils.formatEther(balance) + " ETH"}
                    </p>
                </CardHeader>
                <CardBody>
                    <div className={classes.typo}>
                       <div className={classes.note}>
                               {t("call_address") + ":"}
                       </div>
                       <CustomInput formControlProps={{
                               className: classes.addressTxt
                           }} inputProps={{
                               placeholder: t("call_address"),
                               inputProps: {
                                   "aria-label": "SetLabel"
                               },
                               value:state.call_address,
                               onChange: handleChange('call_address')
                           }}/>
                   </div>
                   <div className={classes.typo}>
                      <div className={classes.note}>
                              {t("call_value") + ":"}
                      </div>
                      <CustomInput formControlProps={{
                              className: classes.addressTxt
                          }} inputProps={{
                              placeholder: t("call_value"),
                              inputProps: {
                                  "aria-label": "SetLabel"
                              },
                              value:state.call_value,
                              onChange: handleChange("call_value")
                          }}/>
                          <span>
                              ETH
                          </span>
                   </div>
                   <div className={classes.typo}>
                      <div className={classes.note}>
                              {t("call_data") + ":"}
                      </div>
                      <CustomInput formControlProps={{
                              className: classes.addressTxt
                          }} inputProps={{
                              placeholder: t("call_data"),
                              inputProps: {
                                  "aria-label": "SetLabel"
                              },
                              value:state.call_data,
                              onChange: handleChange("call_data")
                          }}/>
                   </div>
                   <div className={classes.buttonWrapper}>
                       <Button variant="contained"  onClick={submitCustomWork} className={classes.transferButton}>
                           {t('submit')}
                       </Button>
                   </div>
                </CardBody>
            </Card>

        )
    }

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
        {showDiaglog()}

        {isOwner && <>
            {showOwnerAdmin()}
            {showTransferEth()}
            {showCustomWork()}

        </>
             }


            {/* <Suspense fallback={<div>Loading...</div>}>

                    </Suspense> */}
    </>)
}

DaoDetail.propTypes = {
    classes: PropTypes.object
};

export default withRouter(DaoDetail)
