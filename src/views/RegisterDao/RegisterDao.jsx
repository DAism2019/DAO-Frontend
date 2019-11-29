// /* !
//
// =========================================================
// * Material Dashboard React - v1.7.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. */
// import React, {useState, useEffect} from "react";
// // nodejs library to set properties for components
// import PropTypes from "prop-types";
// // @material-ui/core components
// import Card from "components/Card/Card.jsx";
// import CardHeader from "components/Card/CardHeader.jsx";
// import CardBody from "components/Card/CardBody.jsx";
// import {makeStyles} from '@material-ui/core/styles';
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import Button from '@material-ui/core/Button';
// import { useTranslation } from 'react-i18next'
// import {useWeb3Context} from 'web3-react';
// import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
// import { useNameRegisterContract } from 'hooks';
// import { isMobile } from 'react-device-detect'
// import { ethers } from 'ethers'
//
// const ZERO_ADDRESS = ethers.constants.AddressZero
//
// const useStyles = makeStyles(theme => ({
//     cardCategoryWhite: {
//         // color: "rgba(33,33,33,.99)",
//         color: "white",
//         margin: "0",
//         fontSize: "14px",
//         marginTop: "0",
//         marginBottom: "0"
//     },
//     note: {
//      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//      bottom: "10px",
//      color: "#00c1c2",
//      display: "flex",
//      flexDirection:"row",
//      wrap:"wrap",
//      fontWeight: "400",
//      fontSize: isMobile ? "13px" : "18px",
//      lineHeight:  isMobile ? "13px" : "18px",
//      left: "0",
//      marginLeft: isMobile ? "10px":"20px",
//      position: "absolute",
//      width: isMobile ? "90px" : "260px",
//      marginTop:isMobile? theme.spacing(-15): theme.spacing(-20),
//      maxWidth:isMobile ? "90px" : "260px"
//    },
//    addressTxt:{
//       fontSize:isMobile ? "13px" : "18px",
//       marginLeft:isMobile ? 20 : 0,
//       width:"60%"
//   },
//     typo: {
//     paddingLeft: "25%",
//     marginBottom: "20px",
//
//     position: "relative"
//   },
//   typoTwo: {
//   paddingLeft: "25%",
//   marginBottom: "20px",
//   marginTop:"-40px",
//   position: "relative"
// },
//
//     cardTitleWhite: {
//         color: "#FFFFFF",
//         marginTop: "0px",
//         minHeight: "auto",
//         fontWeight: "300",
//         fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//         marginBottom: "3px",
//         textDecoration: "none"
//     },
//     contextWrapper:{
//       marginLeft:isMobile ? 20 : 0,
//       fontSize:isMobile ? "13px" : "18px",
//   },
//   transferButton: {
//     margin: theme.spacing(2),
//     width:isMobile ? "40%" :"10%",
//     backgroundColor:'#FF8623'
//   },
//
//     buttonWrapper:{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center'
//     }
// }));
//
// export default function TypographyPage() {
//     const classes = useStyles()
//     const { account } = useWeb3Context()
//     const {t} = useTranslation()
//     const name_register = useNameRegisterContract()
//     const showSnackbar= useSnackbarContext()
//     const [name,setName] = useState('')
//     const [newName,setNewName] = useState('')
//
//     const handleChange = event => {
//         setNewName(event.target.value)
//     };
//
//     const changeName = async ()=>{
//         if(!newName){
//             return showSnackbar(t("null_name"),"error")
//         }
//         if(name_register){
//             let _address = await name_register.getUserAddress(newName)
//             if(_address !== ZERO_ADDRESS){
//                 return showSnackbar(t("name_has_registered"),'warning')
//             }
//             name_register.regiser(newName, {
//                 gasPrice: ethers.utils.parseUnits('10.0', 'gwei')
//             }).then(response => {
//                 showSnackbar(t("transaction_send_success"),'success')
//             }).catch(err => {
//                 console.log(err);
//             });
//         }
//     }
//
//
//     //刷新列表
//     useEffect(()=>{
//         if( name_register && account){
//             let stale = false
//             name_register.getUsername(account).then(_name =>{
//                 if(!stale){
//                    setName(_name)
//                 }
//             }).catch(err =>{
//                 stale = true
//             });
//             let filter = name_register.filters.RegisterNameSuc(account)
//             name_register.on(filter, (user, name, event) => {
//                 if(!stale){
//                     showSnackbar(t("register_success").replace("{name}",name),'success')
//                     setName(name)
//                 }
//             })
//
//             return ()=>{
//                 stale = true
//             }
//         }
//     },[account,name_register,showSnackbar,t])
//     let flag = false;
//     if(!account) {
//         flag = true;
//     }
//     if(name)
//         flag = true;
//     return (<>
//         <Card>
//             <CardHeader color="primary">
//                 <h4 className={classes.cardTitleWhite}>{t("register_a_name")}</h4>
//                 <p className={classes.cardCategoryWhite}>
//                   {t("can_query_by_nickname")}
//                 </p>
//             </CardHeader>
//             <CardBody>
//                 <div className={classes.typo}>
//                     <div className={classes.note} >
//                             {t('my_nickname') + ":"}
//                     </div>
//                     <div className={classes.contextWrapper}>
//                         <h3>{name ? name : t('none')}</h3>
//                     </div>
//                 </div>
//                 <div className={classes.typoTwo}>
//                     <div className={classes.note} >
//                              {t('new_name')+":"}
//                     </div>
//
//                     <div className={classes.searchWrapperLeft} >
//                         <CustomInput
//                             formControlProps={{
//                                 className:classes.addressTxt
//                             }}
//                             inputProps={{
//                                 placeholder: t("input_nickname"),
//                                 inputProps: {
//                                     "aria-label": "username"
//                                 },
//                                 onChange:handleChange
//                             }}
//                         />
//                     </div>
//                </div>
//                <div className={classes.buttonWrapper}>
//                    <Button variant="contained"
//                         disabled = {flag}
//                         onClick={changeName} className={classes.transferButton}>
//                         {t("register")}
//                   </Button>
//                </div>
//             </CardBody>
//         </Card>
//     </>)
// }
//
// TypographyPage.propTypes = {
//     classes: PropTypes.object
// };
