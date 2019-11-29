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
import { useStoreInfoContract,useStoreAdminContract } from 'hooks';
// import {useWeb3Context} from 'web3-react';
import Pagination from "material-ui-flat-pagination"
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/TableOnClick.jsx";
import { useTranslation } from 'react-i18next'
import { getIndexArrayReverse,convertTimetoTimeString } from 'utils'

const PAGE_SIZE = 10;
const SPLITTER = '_'

const useStyles = makeStyles(theme => ({
    cardCategoryWhite: {
        // color: "rgba(33,33,33,.99)",
        color: "white",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
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
    buttonWrapper:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));


export default function AllDapp() {
    const classes = useStyles()
    const {t} = useTranslation()
    const store_info = useStoreInfoContract()
    const store_admin = useStoreAdminContract()
    const [offset,setOffset] = useState(0)
    const [amount,setAmount] = useState(-1)
    const [idStr,setIdStr] = useState('')
    const [tableData,setTableData] = useState([])

    //refresh amount
    useEffect(()=>{
        if(store_info && store_admin){
            let stale = false
            async function getAmount(){
                let _amount = await store_info.nonce()
                if(!stale){
                    _amount = + _amount
                    setAmount(_amount)
                }
            }
            getAmount()
            store_admin.on("RegisterDappSuc", (creator,store,id,name, event) => {
                setAmount(+id)
            })
            return() => {
                stale = true;
                store_admin.removeAllListeners('RegisterDappSuc')
            }
        }
    },[store_info,store_admin])

    useEffect(()=>{
        if(amount > 0){
            let indexArray = getIndexArrayReverse(amount,PAGE_SIZE,offset);
            let _indexStr = indexArray.join(SPLITTER);
            setIdStr(_indexStr)
        }
    },[amount,offset])

    //refresh idArray
    useEffect(()=>{
        if( store_info && idStr ){
            let stale = false
            let _idArray = idStr.split(SPLITTER);
            function getInfoByOffset(){
                let allPromise = []
                for(let i=0;i<_idArray.length;i++){
                    let _id = + _idArray[i];
                    allPromise.push(store_info.allStoreInfos(_id + 1).catch(() => {}))
                }

                Promise.all(allPromise).then(results =>{
                    let _tableData = []
                    for(let j=0;j<_idArray.length;j++){
                        let info = results[j];
                        let _id = info[2].toString()
                        let _name = info[4]
                        let _label = info[6]
                        let _createTime =  (+ info[3]) * 1000
                        _tableData.push([_id,_name,_label,convertTimetoTimeString(_createTime)])
                    }
                    if(!stale){
                        setTableData(_tableData)
                    }
                });
            }
            getInfoByOffset()
            return ()=>{
                stale = true
            }
        }else{
            setTableData([])
        }
    },[store_info,idStr])

    return (<>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card plain>
              <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>
                    {amount === -1 ? t("getting") :t("dapp_amount").replace("{amount}",(amount < 0 ? 0 :amount))}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {t("show_dapp")}
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={[t("dapp_name"),t("dapp_label"),t("create_time")]}
                  tableData={tableData}
                />
              </CardBody>
            </Card>
            <div className = {classes.buttonWrapper}>
                <Pagination
                 limit={PAGE_SIZE}
                 offset={offset}
                 total={amount}
                 size ='large'
                 onClick={(e,_offset) => {
                      if(_offset === offset)
                          return;
                      setOffset(_offset)
                 }}
               />
            </div>
          </GridItem>
        </GridContainer>
    </>)
}

AllDapp.propTypes = {
    classes: PropTypes.object
};
