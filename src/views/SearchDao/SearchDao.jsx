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
// import Search from "@material-ui/icons/Search";
// import Pagination from "material-ui-flat-pagination"
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import Button from '@material-ui/core/Button';
// import GridItem from "components/Grid/GridItem.jsx";
// import GridContainer from "components/Grid/GridContainer.jsx";
// import Table from "components/Table/TableOnClick.jsx";
//
// // import {useWeb3Context} from 'web3-react';
// import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
// import { useArticleInfoContract,useArticleEnumableContract,useNameRegisterContract} from 'hooks';
// import { isMobile } from 'react-device-detect'
// import { ethers } from 'ethers'
// import { useTranslation } from 'react-i18next'
// import { isAddress,getIndexArray,convertTimetoTimeString,NETWORK_NAME } from 'utils'
// import { reactLocalStorage } from 'reactjs-localstorage'
//
//
// // const HASH_START = '<hashsvg>'
// // const HASH_END = '</hashsvg>'
// const PAGE_SIZE = 10;
// const ZERO_ADDRESS = ethers.constants.AddressZero
// const tokenId = process.env.REACT_APP_TOKEN || "demeinfo";
// const network_id = process.env.REACT_APP_NETWORK_ID || "1";
// const network_name = NETWORK_NAME[network_id] || 'localhost';
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
//     position: "relative"
//   },
//   typoTwo: {
//     paddingLeft: "25%",
//     marginBottom: "20px",
//     marginTop:"-40px",
//     position: "relative"
//   },
//     cardTitleWhite: {
//         color: "#FFFFFF",
//         marginTop: "0px",
//         minHeight: "auto",
//         fontWeight: "300",
//         fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//         marginBottom: "3px",
//         textDecoration: "none"
//     },
//     buttonWrapper:{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center'
//     }
// }));
//
// // let allArticle = {}
// let infoInit = {
//     amount:-1,
//     address:'',
//     label:''
// }
// let queryValuesInit = {
//     username_query:'',
//     useraddress_query:'',
//     label_query:''
// }
//
// export default function TypographyPage() {
//     const classes = useStyles()
//     const {t} = useTranslation()
//     // const svg_hash_contract = useSvgHashContract()
//     const article_enum = useArticleEnumableContract()
//     const article_info = useArticleInfoContract()
//     const name_register = useNameRegisterContract()
//     const [offset,setOffset] = useState(0)
//     const [info,setInfo] = useState(infoInit)
//     const [tableData,setTableData] = useState([])
//     // const [viewData, setViewData] = useState('')
//     const [queryValues,setqueryValues] = useState(queryValuesInit)
//     const showSnackbar= useSnackbarContext()
//     const [inPanel,setInPanel] = useState(true)
//     // const [showLabel,setShowLabel] = useState("")
//
//     //点击显示详情
//     // const handleClick = (id,label) => async (event) =>{
//     //     event.preventDefault()
//     //     if(allArticle["" + id]){
//     //         setViewData(allArticle["" + id])
//     //         setShowLabel(label)
//     //         return
//     //     }
//     //     setViewData('')
//     //     if(article_info){
//     //         let context = await article_info.getArticleContextByIndex(id);
//     //         setShowLabel(label)
//     //         parseContext(context,id)
//     //     }
//     // };
//
//     // const parseContext = async (str,id) => {
//     //     let start = str.indexOf(HASH_START);
//     //     let end = str.indexOf(HASH_END);
//     //     let final = end + HASH_END.length
//     //     if (start !== -1 && end !== -1) {
//     //         let subStr = str.substring(start + HASH_START.length , end);
//     //         let svg_code = await svg_hash_contract.getCode(subStr)
//     //         let newStr = str.substring(0, start)  + svg_code + str.substring(final)
//     //         parseContext(newStr,id)
//     //     } else {
//     //         allArticle["" + id] = str
//     //         setViewData(str)
//     //     }
//     // };
//     const handleChange = name => event => {
//         setqueryValues({
//             ...queryValues,
//             [name]: event.target.value,
//         });
//     };
//     const queryBy = name => async ()=>{
//         if(!queryValues[name]){
//             if(inPanel)
//                 return showSnackbar(t('null_query'),'error')
//             else
//                 return
//         }
//         let _address = ''
//         let _label = ''
//         if (name === 'username_query'){
//             let _name = queryValues[name];
//             _address = await name_register.getUserAddress(_name);
//             if(_address === ZERO_ADDRESS){
//                 if(inPanel)
//                     return showSnackbar(t("not_register"),'error')
//                 else
//                     return
//             }
//         }else if (name === "useraddress_query"){
//             if(!isAddress(queryValues[name])){
//                 if(inPanel)
//                     return showSnackbar(t("invalid_address"),'error')
//                 else
//                     return
//             }
//             _address = queryValues[name]
//         }else {
//             _label = queryValues[name]
//             //todo
//         }
//         if(_address && article_enum ){
//             let _amount = await article_enum.getUserArticleAmount(_address)
//             _amount = + _amount
//             if(inPanel){
//                 setTableData([])
//                 // setViewData('')
//                 setInfo({
//                     amount:_amount,
//                     address:_address,
//                     label:''
//                 })
//                 if(_amount === 0){
//                     showSnackbar(t("no_article"),'info')
//                 }
//             }
//         }else{
//             if(_label && article_enum) {
//                 let _amount = await article_enum.getLabelArticleAmount(_label)
//                 _amount = + _amount
//                 if(inPanel){
//                     setTableData([])
//                     // setViewData('')
//                     setInfo({
//                         amount:_amount,
//                         address:"",
//                         label:_label
//                     })
//                     if(_amount === 0){
//                         showSnackbar(t("no_article"),'info')
//                     }
//                 }
//             }
//         }
//     }
//
//     useEffect(()=>{
//        return () => setInPanel(false)
//     },[])
//
//     //刷新列表
//     useEffect(()=>{
//         const {address,amount,label} = info
//         if( article_info && article_enum && amount > 0){
//             let stale = false
//             async function getInfoByOffset(_offset){
//                 //获得要显示的用户ID数组索引
//                 let indexArray = getIndexArray(amount,PAGE_SIZE,_offset)
//                 if(indexArray.length === 0)
//                   return;
//                 //根据索引得到相应的文章ID
//                 let idArray = []
//                 if(label){
//                     for(let i=0;i<indexArray.length;i++){
//                         let _id = await article_enum.getLabelArticleByIndex(label,indexArray[i]);
//                         idArray.push(+_id);
//                     }
//                 }else{
//                     for(let i=0;i<indexArray.length;i++){
//                         let _id = await article_enum.getUserArticleIdByIndex(address,indexArray[i]);
//                         idArray.push(+_id);
//                     }
//                 }
//
//                 let userProfile = reactLocalStorage.getObject(tokenId)
//                 if(!userProfile[network_name]){
//                     userProfile[network_name] = {}
//                 }
//                 let queryId = []
//                 let _tableData = []
//
//                 // eslint-disable-next-line
//                 for(let id of idArray){
//                     if(!userProfile[network_name]["" + id]){
//                         queryId.push(id)
//                     }else{
//                         //从本地读取
//                         // let _creator = userProfile[id]['creator']
//                         let _title = userProfile[network_name]["" + id]['title']
//                         let _label = userProfile[network_name]["" + id]['label']
//                         let _timestamp = userProfile[network_name]["" + id]['timestamp']
//                         _timestamp = (+ _timestamp) * 1000
//                         _tableData.push(["" + id,_title,_label,convertTimetoTimeString(_timestamp)])
//                     }
//                 }
//                 //有需要更新的内容
//                if(queryId.length > 0){
//                    let allPromise = []
//                     //根据文章ID获得文章简要信息
//                     for(let i=0;i<queryId.length;i++){
//                         allPromise.push(article_info.getArticleInfoByIndex(queryId[i]).catch(() => {}))
//                     }
//                     Promise.all(allPromise).then(results =>{
//                         for(let j=0;j<queryId.length;j++){
//                             let creator = results[j][0]
//                             let title = results[j][1]
//                             let label = results[j][2]
//                             let timestamp = + results[j][3]
//                             userProfile[network_name]["" + queryId[j]] = {
//                                 creator,
//                                 title,
//                                 label,
//                                 timestamp
//                             }
//                             reactLocalStorage.setObject(tokenId,userProfile)
//                              timestamp *= 1000
//                             _tableData.push(["" + queryId[j],title,label,convertTimetoTimeString(timestamp)])
//                         }
//                         _tableData.sort((a,b) =>  + (a[0]) >  + (b[0]))
//                         if(!stale){
//                             setTableData(_tableData)
//                         }
//                     });
//                }else{
//                    if(!stale){
//                        setTableData(_tableData)
//                    }
//                }
//             }
//             getInfoByOffset(offset)
//             return ()=>{
//                 stale = true
//             }
//         }
//     },[article_info,article_enum,info,offset])
//
//     // //显示文章详情
//     // const ref = useRef()
//     // useEffect(() => {
//     //     if (ref.current && viewData) {
//     //         ref.current.innerHTML = viewData
//     //     }
//     //
//     // }, [viewData])
//
//     const {address,amount,label} = info
//     return (<>
//         <Card>
//             <CardHeader color="primary">
//                 <h4 className={classes.cardTitleWhite}>{t("query_article")}</h4>
//                 <p className={classes.cardCategoryWhite}>
//                   {t("query_descript")}
//                 </p>
//             </CardHeader>
//             <CardBody>
//                 <div className={classes.typoTwo}>
//                     <div className={classes.note} >
//                             {t('query_by_name')}
//                     </div>
//                     <div className={classes.searchWrapperLeft} >
//                         <CustomInput
//                             formControlProps={{
//                                 className:classes.addressTxt
//                             }}
//                             inputProps={{
//                                 placeholder: t("input_nick_name"),
//                                 inputProps: {
//                                     "aria-label": "username"
//                                 },
//                                 onChange:handleChange('username_query')
//                             }}
//                      />
//                      {/* <span> */}
//                          <Button color="primary" aria-label="edit" onClick={queryBy('username_query')} justicon="true" round="true">
//                              <Search />
//                          </Button>
//                      {/* </span> */}
//                  </div>
//              </div>
//              <div className={classes.typoTwo}>
//                <div className={classes.note} >
//                         {t('query_by_address')}
//                </div>
//                <div className={classes.searchWrapperLeft} >
//                    <CustomInput
//                        formControlProps={{
//                            className:classes.addressTxt
//                        }}
//                        inputProps={{
//                            placeholder: t("input_author_address"),
//                            inputProps: {
//                                "aria-label": "useraddress"
//                            },
//                            onChange:handleChange('useraddress_query')
//                        }}
//                    />
//                    <Button color="primary" aria-label="edit" onClick={queryBy('useraddress_query')} justicon="true" round="true">
//                        <Search />
//                    </Button>
//                </div>
//              </div>
//              <div className={classes.typoTwo}>
//                <div className={classes.note} >
//                         {t('query_by_label')}
//                </div>
//                <div className={classes.searchWrapperLeft} >
//                    <CustomInput
//                        formControlProps={{
//                            className:classes.addressTxt
//                        }}
//                        inputProps={{
//                            placeholder: t("input_article_label"),
//                            inputProps: {
//                                "aria-label": "article label"
//                            },
//                            onChange:handleChange('label_query')
//                        }}
//                    />
//                    <Button color="primary" aria-label="edit" onClick={queryBy('label_query')} justicon="true" round="true">
//                        <Search />
//                    </Button>
//                </div>
//              </div>
//           </CardBody>
//         </Card>
//         <GridContainer>
//           <GridItem xs={12} sm={12} md={12}>
//             <Card plain>
//               <CardHeader plain color="primary">
//                 <h4 className={classes.cardTitleWhite}>
//                     {amount === -1 && (address || label) ? t("getting") :t("article_amount").replace("{amount}",(amount < 0 ? 0 :amount))}
//                 </h4>
//                 <p className={classes.cardCategoryWhite}>
//                   {t('show_detail')}
//                 </p>
//               </CardHeader>
//               <CardBody>
//                 <Table
//                   tableHeaderColor="primary"
//                   tableHead={[t("title"),t("label"),t("upload_time")]}
//                   tableData={tableData}
//                 />
//               </CardBody>
//             </Card>
//             <div className = {classes.buttonWrapper}>
//                 <Pagination
//                  limit={PAGE_SIZE}
//                  offset={offset}
//                  total={amount}
//                  size ='large'
//                  onClick={(e,_offset) => {
//                       if(_offset === offset)
//                           return;
//                       setOffset(_offset)
//                  }}
//                />
//             </div>
//           </GridItem>
//         </GridContainer>
//         {/* <Card>
//             <CardHeader color="primary">
//                 <h4 className={classes.cardTitleWhite}>{t("article_detail")}</h4>
//                 <p className={classes.cardCategoryWhite}>
//                   {t('article_label') + ":" + showLabel}
//                 </p>
//             </CardHeader>
//             <CardBody>
//                 <div ref = {ref} />
//             </CardBody>
//         </Card> */}
//     </>)
// }
//
// TypographyPage.propTypes = {
//     classes: PropTypes.object
// };
