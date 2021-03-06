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
import React, {useState, useEffect} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import {makeStyles} from '@material-ui/core/styles';
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next'
import {useWeb3Context} from 'web3-react';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useWalletAdminContract,useWalletInfosContract } from 'hooks';
import { isMobile } from 'react-device-detect'
import { withRouter } from 'react-router'
import {isAddress,calculateGasMargin} from 'utils'
import { utils } from 'ethers'

const GAS_MARGIN = utils.bigNumberify(1000);

const useStyles = makeStyles(theme => ({
    cardCategoryWhite: {
        // color: "rgba(33,33,33,.99)",
        color: "white",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
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
   addressTxt:{
      fontSize:isMobile ? "13px" : "18px",
      marginLeft:isMobile ? 20 : 0,
      width:"60%"
  },
    typo: {
    paddingLeft: "25%",
    marginBottom: "20px",

    position: "relative"
  },
  typoTwo: {
  paddingLeft: "25%",
  marginBottom: "20px",
  marginTop:"-40px",
  position: "relative"
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
    contextWrapper:{
      marginLeft:isMobile ? 20 : 0,
      fontSize:isMobile ? "13px" : "18px",
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

const registerInfoInit = {
    name:'',
    owners:'',
    required:'',
    templateIndex:0
}

function RegisterDao({history}) {
    const classes = useStyles()
    const { account } = useWeb3Context()
    const {t} = useTranslation()
    const dao_register = useWalletAdminContract()
    const dao_info = useWalletInfosContract()
    const [fee,setFee] = useState(-1)
    const showSnackbar= useSnackbarContext()
    const [registerInfo,setRegisterInfo] = useState(registerInfoInit)
    const [inPanel,setInPanel] = useState(true)

    const handleChange = name => event => {
        let value = event.target.value
        setRegisterInfo({
            ...registerInfo,
            [name]:value
        })
    }

    const checkRegister = async () =>{
        const {name,owners,required} = registerInfo
        if(!name || !owners || !required) {
            return showSnackbar(t('empty_input'),"error")
        }
        let all_owners = owners.split(',')
        let all_owner_count = {}
        // eslint-disable-next-line
        for( let owner of all_owners) {
            if(!isAddress(owner)){
                return showSnackbar(t('invalid_address'),'error')
            }
            if(!all_owner_count[owner]){
                all_owner_count[owner] = 1
            }else{
                return showSnackbar(t('duplicated_address'),'error')
            }
        }
        let amount = + required
        if(Number.isNaN(amount)){
            return showSnackbar(t('invalid_number'),'error')
        }
        amount = parseInt(amount)
        if(amount <= 0 || amount > all_owners.length){
            return showSnackbar(t('invalid_required'),'error')
        }
        if(dao_info){
            let hasRegister = await dao_info.hasRegister(name)
            if(inPanel) {
                if(hasRegister) {
                    showSnackbar(t("name_has_register"),"info")
                }else {
                    doRegister(name,all_owners,required)
                }
            }
        }
    };

    const doRegister = async (name,owners,required) => {
        let estimate = dao_register.estimate.createWallet
        let method = dao_register.createWallet
        let args = [name,owners,required,registerInfo.templateIndex]
        let value = fee
        const estimatedGasLimit = await estimate(...args, { value })
        method(...args, {
            value,
            gasPrice:utils.parseUnits('10.0','gwei'),
            gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN) })
        .then(response => {
            showSnackbar(t('transaction_send_success'),'success')
        })
    }

    useEffect(()=>{
       return () => setInPanel(false)
    },[])

    //refresh register fee
    useEffect(() => {
        if(dao_register) {
            let stale = false;
            dao_register.getCreateFee().catch(()=>{}).then( _fee => {
                if(!stale){
                    setFee(_fee)
                }
            });
            return () => {
                stale = true
            }
        }
    },[dao_register])

    //link while register dao successfully
    useEffect(()=>{
        if(dao_register && account) {
            let filter = dao_register.filters.createWalletSuc(account)
            dao_register.on(filter,(creator,wallet,name,templateIndex,amount,event) => {
                showSnackbar(t('register_dao_suc').replace("{name}",name),"success",()=>{
                    history.push("/admin#" + wallet);
                })
            })

            return () =>{
                dao_register.removeAllListeners('createWalletSuc')
            }
        }
    },[dao_register,account,showSnackbar,t,history])

    let canRegister = dao_register && account
    let tip = fee === -1 ? t("getting") : (utils.formatEther(fee) + " ETH")
    return (<>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{t("register_dao")}</h4>
                <p className={classes.cardCategoryWhite}>
                  {t('register_fee') + ": "  + tip}
                </p>
            </CardHeader>
            <CardBody>
                <div className={classes.typo}>
                    <div className={classes.note} >
                             {t('dao_name')+":"}
                    </div>
                    <div className={classes.searchWrapperLeft} >
                        <CustomInput
                            formControlProps={{
                                className:classes.addressTxt
                            }}
                            inputProps={{
                                placeholder: t("input_dao_name"),
                                inputProps: {
                                    "aria-label": "dao_name"
                                },
                                onChange:handleChange('name')
                            }}
                        />
                    </div>
               </div>
               <div className={classes.typo}>
                   <div className={classes.note} >
                            {t('init_owners')+":"}
                   </div>
                   <div className={classes.searchWrapperLeft} >
                       <CustomInput
                           formControlProps={{
                               className:classes.addressTxt
                           }}
                           inputProps={{
                               placeholder: t("input_init_owners"),
                               inputProps: {
                                   "aria-label": "init_owners"
                               },
                               onChange:handleChange('owners')
                           }}
                       />
                   </div>
              </div>
              <div className={classes.typo}>
                  <div className={classes.note} >
                           {t('init_required')+":"}
                  </div>
                  <div className={classes.searchWrapperLeft} >
                      <CustomInput
                          formControlProps={{
                              className:classes.addressTxt
                          }}
                          inputProps={{
                              placeholder: t("input_init_required"),
                              inputProps: {
                                  "aria-label": "init_required"
                              },
                              onChange:handleChange('required')
                          }}
                      />
                  </div>
             </div>

               <div className={classes.buttonWrapper}>
                   <Button variant="contained"
                        disabled = {!canRegister}
                        onClick={checkRegister} className={classes.transferButton}>
                        {t("register")}
                  </Button>
               </div>
            </CardBody>
        </Card>
    </>)
}

RegisterDao.propTypes = {
    classes: PropTypes.object
};

export default  withRouter(RegisterDao)
