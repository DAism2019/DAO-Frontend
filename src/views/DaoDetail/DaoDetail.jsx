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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import SendIcon from '@material-ui/icons/Send';
import Paper from '@material-ui/core/Paper';
import copy from 'copy-to-clipboard'
import { isMobile } from 'react-device-detect'
import { useWalletInfosContract,useTemplateOneContract} from 'hooks';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useTranslation } from 'react-i18next'
import Pagination from "material-ui-flat-pagination"
import {useWeb3Context} from 'web3-react';
import { getIndexArray,convertTimetoTimeString,getEtherBalance,getIntBigNum,
    shortenAddress,calculateGasMargin,isAddress,getERC20Contract } from 'utils'
import styled from 'styled-components'
import { utils,constants } from 'ethers'
import CustomInput from "components/CustomInput/CustomInput.jsx"
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AcUnitIcon from '@material-ui/icons/AcUnit';
// import * as txDecoder from 'ethereum-tx-decoder';

// const TemplateOne = lazy(() => import('../Template/TemplateOne.jsx'));

const GAS_MARGIN = utils.bigNumberify(1000);
const SELECT_ITEM = ['select_transction','transfer_eth_admin','owner_admin','custom_transaction','transfer_20_token']

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
    cardCategoryWhiteOther: {
        display: 'flex',
        justifyContent:"space-between",
        // color: "rgba(33,33,33,.99)",
        color: "white",
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
    noteOwner: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: "#00c1c2",
        fontWeight: "400",
        fontSize:  "18px",
        left: "0",
        marginLeft: isMobile ? "10px":"20px",
        marginTop:theme.spacing(3),
        marginBottom:theme.spacing(3),
    },
    addressTxt: {
        fontSize: isMobile ? "13px" : "18px",
        marginLeft: isMobile ? 20 : 0,
        width: "60%"
    },
    menuBtn:{
        color: "rgba(255,255,255,.70)",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        marginTop:theme.spacing(-2)
    }
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
    replace_address:"",
    call_address:'',
    call_data:'',
    call_value:0,
    transferValue:0,
    token_20_address:'',
    token_symbol:"",
    token_balance:"",
    token_decimals:0,
    get_token_info:false,
    get_info_over:false,
    token_contract:null
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
    const [menu_open, setMenu_Open] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectIndex,setSelectIndex] = useState(0)

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
        setState({
            ...state,
            replace_address:'',
            recipient:''
        })
      setOpen(false);
    };

    const handleToggle = () => {
      setMenu_Open(prevOpen => !prevOpen);
    };

    const handleItemClick = (event,value) => {
      // if (anchorRef.current && anchorRef.current.contains(event.target)) {
      //   return;
      // }
      if(selectIndex === value) {
          return
      }
      setState(handle_change_state_init)
      setSelectIndex(value)
      setMenu_Open(false);
    }

    const handleCloseMenu = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
        setMenu_Open(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        }
    }

    const copyURL = event =>{
        event.preventDefault();
        if(copy(window.location.href)){
            showSnackbar(t("url_copied"),'info')
        }
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
        value = utils.parseEther(state.transferValue)
        submit_transaction('0x',address,value)
    };

    const transferErc20Token = () => {
        let {token_contract,token_decimals,recipient,call_value} = state
        if(!recipient || !isAddress(recipient)) {
            return showSnackbar(t("invalid_address"),"error")
        }
        let amount = + call_value;
        if(Number.isNaN(amount) || amount <= 0) {
            return showSnackbar(t("invalid_number"),"error")
        }
        let result_bigNumber = getIntBigNum(call_value,+token_decimals)

        if(token_contract) {
            let func = token_contract.interface.functions.transfer;
            let args = [recipient,result_bigNumber]
            let data = func.encode(args)
            submit_transaction(data,token_contract.address)
        }

    }

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

    const removeOwner = owner => () => {
        let add_func = daoContract.interface.functions.removeOwner
        let data = add_func.encode([owner])
        submit_transaction(data)
    };

    const replaceOwner = owner => () => {
        setState({
            ...state,
            "recipient":owner
        })
        handleClickOpen()
    };

    const handleReplaceOwner = () => {
        const {recipient,replace_address} = state
        if(!replace_address || !isAddress(replace_address)) {
            return showSnackbar(t("invalid_address"),"error")
        }
        let _checksum = utils.getAddress(replace_address)
        if(_checksum === constants.AddressZero) {
            return showSnackbar(t("zero_address"),'error')
        }else if (owners.indexOf(_checksum) !== -1) {
            return showSnackbar(t("owner_existed"),'error')
        }
        let replace_func = daoContract.interface.functions.replaceOwner
        let args = [recipient,replace_address]
        let data = replace_func.encode(args)
        handleClose()
        submit_transaction(data)
    };

    //show menu
    const prevOpen = useRef(menu_open);
    useEffect(() => {
        if (prevOpen.current === true && menu_open === false) {
          anchorRef.current.focus();
        }

        prevOpen.current = menu_open;
    }, [menu_open]);

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

    //refresh owner
    useEffect(()=>{
        if(daoContract) {
            let stale = false;
            function getAllOwners() {
                daoContract.getAllOwners().then( owners =>{
                    if(!stale){
                        setOwners(owners)
                    }
                }).catch(()=>{})
            }
            getEtherBalance(daoContract.address,library).then( balance => {
                if(!stale) {
                    setBalance(balance)
                }
            }).catch(()=>{})
            daoContract.on('OwnerAddition',(owner,event)=>{
                getAllOwners()
            })
            daoContract.on('OwnerRemoval',(owner,event)=>{
                getAllOwners()
            })
            getAllOwners()

            return ()=>{
                stale = true
                daoContract.removeAllListeners('OwnerAddition');
                daoContract.removeAllListeners('OwnerRemoval');
            }
        }
    },[daoContract,library])


    //refresh token_20_info
    useEffect(()=>{
        let token_20_address = state.token_20_address
        if(token_20_address && daoContract && isAddress(token_20_address)) {
            let stale = false

            setState({
                ...state,
                get_token_info:true
            })
            async function get_info() {
                 try {
                    let contract = getERC20Contract(token_20_address,library,account)
                    let symbol = await contract.symbol();
                    let decimals = await contract.decimals();
                    let token_balance = await contract.balanceOf(daoContract.address)
                    let ten = utils.bigNumberify(10)
                    token_balance = token_balance.div(ten.pow(decimals))
                    if(!stale) {
                        setState({
                            ...state,
                            token_symbol:symbol,
                            token_decimals:decimals,
                            token_balance:token_balance,
                            get_token_info:false,
                            get_info_over:true,
                            token_contract:contract
                        })
                    }
                }catch(err){
                     if(!stale){
                         setState({
                             ...state,
                             get_token_info:false
                         })
                         showSnackbar(t("invalid_token_20_address"),'error')
                     }
                   }
                }
            get_info()
            return () => {
                stale = true
            }
        }
    },[state.token_20_address,showSnackbar,t,daoContract,account,library])

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

    // function showDaoDetail() {
    //     switch (daoInfo.templateIndex) {
    //         case 0:
    //             return (<TemplateOne contract = {daoContract} />)
    //         default:
    //             return (<TemplateOne  contract = {daoContract}/>)
    //     }
    // }

    //show owner admin ui of dao
    function showOwnerAdmin() {
        return (
            <div>
                 <div className={classes.noteOwner}>
                          {t(SELECT_ITEM[selectIndex]) + ":" + t('owner_amount').replace("{amount}",owners.length) }
                 </div>
                 {owners.map((owner,index) => (showOneOwner(owner,index)))}
                 {showAddOwner()}
            </div>
        )
    }

    // show ui item  of owner admin
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

    //show add owner item of owner admin
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

    // show replace ui of owner admin
    function showReplaceOwnerDiaglog() {
        let showAddress = state.recipient
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
                    value={state.replace_address}
                    fullWidth
                    onChange={handleChange('replace_address')}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleReplaceOwner} color="primary">
                    {t('confirm')}
                  </Button>
                </DialogActions>
          </Dialog>
        )
    }

    //show erc20 token transfer ui
    function show20TokenTransfer() {
        const {token_symbol,token_address,token_balance,get_token_info,get_info_over,recipient,call_value} = state
        return (
            <div>
                <div className={classes.noteOwner}>
                     {t(SELECT_ITEM[selectIndex])}
                </div>
                <div className={classes.typo}>
                   <div className={classes.note}>
                           {t("token_20_address") + ":"}
                   </div>
                   <CustomInput formControlProps={{
                           className: classes.addressTxt
                       }} inputProps={{
                           placeholder: t("token_20_address"),
                           inputProps: {
                               "aria-label": "SetLabel"
                           },
                           value:token_address,
                           onChange: handleChange('token_20_address')
                       }}/>
                </div>
                <div className={classes.typo}>
                    <div className={classes.note}>
                            {t("token_symbol") + ":"}
                    </div>
                   <CustomInput formControlProps={{
                           className: classes.addressTxt
                       }} inputProps={{
                           // placeholder: t("token_symbol"),
                           inputProps: {
                               "aria-label": "SetLabel"
                           },
                           disabled:true,
                           value:get_token_info ? t('getting') : token_symbol,
                       }}/>
                </div>
                <div className={classes.typo}>
                    <div className={classes.note}>
                            {t("token_balance") + ":"}
                    </div>
                   <CustomInput formControlProps={{
                           className: classes.addressTxt
                       }} inputProps={{
                           inputProps: {
                               "aria-label": "SetLabel"
                           },
                           disabled:true,
                           value:get_token_info ? t('getting') : token_balance,
                       }}/>
                       <span>
                           {token_symbol}
                       </span>
                </div>
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
                           value:recipient,
                           onChange: handleChange('recipient')
                       }}/>
                </div>
                <div className={classes.typo}>
                   <div className={classes.note}>
                           {t("transfer_20_token_amount") + ":"}
                   </div>
                   <CustomInput formControlProps={{
                           className: classes.addressTxt
                       }} inputProps={{
                           placeholder: t("transfer_20_token_amount"),
                           inputProps: {
                               "aria-label": "SetLabel"
                           },
                           value:state.transferValue,
                           onChange: handleChange("call_value")
                       }}/>
                       <span>
                           {token_symbol}
                       </span>
                </div>
                <div className={classes.buttonWrapper}>
                    {/* disabled={!get_info_over} */}
                    <Button variant="contained"  onClick={transferErc20Token}   className={classes.transferButton}>
                        {t('transfer')}
                    </Button>
                </div>
        </div>
        )
    }

    //show eth transfer ui
    function showTransferEth() {
        return(
            <div>
                    <div className={classes.noteOwner}>
                         {t(SELECT_ITEM[selectIndex])}
                   </div>
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
               </div>
        )
    }

    // show custom transaction ui
    function showCustomWork() {
        return(
            <div>
                 <div className={classes.noteOwner}>
                          {t(SELECT_ITEM[selectIndex])}
                 </div>
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
                        ETH
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
            </div>
        )
    }

    //show menu item
    function showMenuItem(key) {
        if(key === 0){
            return null
        }
        return (
            <MenuItem key={key} onClick={ event => handleItemClick(event,key)} selected={selectIndex === key}>
                <ListItemIcon>
                    {getItemIcon(key)}
                </ListItemIcon>
                <Typography variant="inherit">{t(SELECT_ITEM[key])}</Typography>
            </MenuItem>
        )
    }

    // show menu item icon
    function getItemIcon(key) {
        switch (key) {
            case 1:
                return <SettingsEthernetIcon fontSize="small" />
            case 2:
                return <GroupIcon fontSize="small" />
            case 3:
                return <TransferWithinAStationIcon fontSize="small" />
            case 4:
                return <SendIcon fontSize="small" />
            case 0:
            default:
                return null
        }
    }

    // show correct ui according to selectIndex
    function showTransactions() {
        switch (selectIndex) {
            case 1:
                return showTransferEth()
            case 2:
                return showOwnerAdmin()
            case 3:
                return showCustomWork()
            case 4:
                return show20TokenTransfer()
            case 0:
            default:
                return null
        }
    }

    //render
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
        {showReplaceOwnerDiaglog()}
        {isOwner &&
            <Card>
                <CardHeader color="primary">
                     <h4 className={classes.cardTitleWhite}>{t("common_transactions")}</h4>
                     <div className={classes.cardCategoryWhiteOther}>
                         <div>
                             {t('eth_amount') + ": " + utils.formatEther(balance) + " ETH"}
                         </div>
                         <Button
                              className = {classes.menuBtn}
                              ref={anchorRef}
                              aria-controls={menu_open ? 'menu-list-grow' : undefined}
                              aria-haspopup="true"
                              onClick={handleToggle}
                            >
                              {t(SELECT_ITEM[selectIndex])}<DownIcon />
                           </Button>
                     </div>

                    <Popper open={menu_open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                          <Paper>
                            <ClickAwayListener onClickAway={handleCloseMenu}>
                              <MenuList autofocusitem={"" +menu_open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                  {SELECT_ITEM.map((item,key)=> showMenuItem(key))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                 </CardHeader>
                 <CardBody>
                     {showTransactions()}
                 </CardBody>
             </Card>
        }
    </>)
}

DaoDetail.propTypes = {
    classes: PropTypes.object
};

export default withRouter(DaoDetail)
