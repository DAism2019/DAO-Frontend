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
// import {useArticleAdminContract,useArticleInfoContract,useArticleEnumableContract} from 'hooks';
// import {useWeb3Context} from 'web3-react';
// import Pagination from "material-ui-flat-pagination"
// import GridItem from "components/Grid/GridItem.jsx";
// import GridContainer from "components/Grid/GridContainer.jsx";
// import Table from "components/Table/TableOnClick.jsx";
// import { useTranslation } from 'react-i18next'
// import { getIndexArray,convertTimetoTimeString,NETWORK_NAME } from 'utils'
// import {reactLocalStorage} from 'reactjs-localstorage'
//
// // const HASH_START = '<hashsvg>'
// // const HASH_END = '</hashsvg>'
// const PAGE_SIZE = 10;
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
//
// export default function TypographyPage() {
//     const classes = useStyles()
//     const {account} = useWeb3Context()
//     const {t} = useTranslation()
//     // const svg_hash_contract = useSvgHashContract()
//     const article_enum = useArticleEnumableContract()
//     const article_admin = useArticleAdminContract()
//     const article_info = useArticleInfoContract()
//     const [offset,setOffset] = useState(0)
//     const [amount,setAmount] = useState(-1)
//     const [tableData,setTableData] = useState([])
//
//     //刷新数量
//     useEffect(()=>{
//         if(account && article_enum && article_admin){
//             let stale = false
//             async function getAmount(){
//                 let _amount = await article_enum.getUserArticleAmount(account)
//                 if(!stale){
//                     _amount = + _amount
//                     setAmount(_amount)
//                 }
//             }
//             getAmount()
//             let filter = article_admin.filters.AddArticleSuc(account)
//             article_admin.on(filter, (author, title, event) => {
//                 getAmount()
//             })
//             return() => {
//                 stale = true;
//                 article_admin.removeAllListeners('AddArticleSuc')
//             }
//         }
//     },[account,article_enum,article_admin])
//
//     //刷新列表
//     useEffect(()=>{
//         if( article_enum && article_info && account && amount > 0){
//             let stale = false
//             async function getInfoByOffset(_offset){
//                 //获得要显示的用户ID数组索引
//                 let indexArray = getIndexArray(amount,PAGE_SIZE,_offset)
//                 if(indexArray.length === 0)
//                   return;
//                 //根据索引得到相应的文章ID
//                 let idArray = []
//                 for(let i=0;i<indexArray.length;i++){
//                     let _id = await article_enum.getUserArticleIdByIndex(account,indexArray[i]);
//                     idArray.push(+_id);
//                 }
//
//                 let userProfile = reactLocalStorage.getObject(tokenId)
//                 if(!userProfile[network_name]){
//                     userProfile[network_name] = {}
//                 }
//                 let queryId = []
//                 let _tableData = []
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
//                 if(queryId.length > 0){
//                     let allPromise = []
//                      //根据文章ID获得文章简要信息
//                      for(let i=0;i<queryId.length;i++){
//                          allPromise.push(article_info.getArticleInfoByIndex(queryId[i]).catch(() => {}))
//                      }
//                      Promise.all(allPromise).then(results =>{
//                          for(let j=0;j<queryId.length;j++){
//                              let creator = results[j][0]
//                              let title = results[j][1]
//                              let label = results[j][2]
//                              let timestamp = + results[j][3]
//                              userProfile[network_name]["" + queryId[j]] = {
//                                  creator,
//                                  title,
//                                  label,
//                                  timestamp
//                              }
//                              reactLocalStorage.setObject(tokenId,userProfile)
//                               timestamp *= 1000
//                              _tableData.push(["" + queryId[j],title,label,convertTimetoTimeString(timestamp)])
//                          }
//                          _tableData.sort((a,b) =>  + (a[0]) >  + (b[0]))
//                          if(!stale){
//                              setTableData(_tableData)
//                          }
//
//                      });
//                 }else{
//                     if(!stale){
//                         setTableData(_tableData)
//                     }
//                 }
//                 //根据文章ID获得文章简要信息
//                 // let allPromise = []
//                 // for(let i=0;i<idArray.length;i++){
//                 //     allPromise.push(article_info.getArticleInfoByIndex(idArray[i]).catch(() => {}))
//                 // }
//                 // Promise.all(allPromise).then(results =>{
//                 //     let _tableData = []
//                 //     for(let j=0;j<idArray.length;j++){
//                 //         let title = results[j][1]
//                 //         //todo 这里传入了标签，怎么显示
//                 //         let label = results[j][2]
//                 //         let timestamp = (+ results[j][3]) * 1000
//                 //         _tableData.push(["" + (idArray[j]),title,label,convertTimetoTimeString(timestamp)])
//                 //     }
//                 //     if(!stale){
//                 //         setTableData(_tableData)
//                 //     }
//                 //
//                 // });
//             }
//             getInfoByOffset(offset)
//             return ()=>{
//                 stale = true
//             }
//         }
//     },[article_info,article_enum,account,amount,offset])
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
//     return (<>
//         <GridContainer>
//           <GridItem xs={12} sm={12} md={12}>
//             <Card plain>
//               <CardHeader plain color="primary">
//                 <h4 className={classes.cardTitleWhite}>
//                     {amount === -1 && account ? t("getting") :t("article_amount").replace("{amount}",(amount < 0 ? 0 :amount))}
//                 </h4>
//                 <p className={classes.cardCategoryWhite}>
//                   {t("show_detail")}
//                 </p>
//               </CardHeader>
//               <CardBody>
//                 <Table
//                   // onClick = {handleClick}
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
