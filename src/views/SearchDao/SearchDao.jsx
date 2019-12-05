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
import Search from "@material-ui/icons/Search";
import Pagination from "material-ui-flat-pagination"
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from '@material-ui/core/Button';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/TableOnClick.jsx";
import { withRouter } from 'react-router'
// import {useWeb3Context} from 'web3-react';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useWalletInfosContract,} from 'hooks';
import { isMobile } from 'react-device-detect'
import { constants } from 'ethers'
import { useTranslation } from 'react-i18next'
import { isAddress,getIndexArray,convertTimetoTimeString } from 'utils'
// import { reactLocalStorage } from 'reactjs-localstorage'

const PAGE_SIZE = 10;

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
    buttonWrapper:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

let queryValuesInit = {
    dao_name_query:'',
    dao_address_query:'',
    dao_creator_query:''
}

function SerachDao({history}) {
    const classes = useStyles()
    const {t} = useTranslation()
    const dao_info = useWalletInfosContract()
    const [creator,setCreator] = useState()
    const [offset,setOffset] = useState(0)
    const [amount,setAmount] = useState(0)
    const [tableData,setTableData] = useState([])
    const [queryValues,setqueryValues] = useState(queryValuesInit)
    const showSnackbar= useSnackbarContext()
    const [inPanel,setInPanel] = useState(true)

    const handleChange = name => event => {
        setqueryValues({
            ...queryValues,
            [name]: event.target.value,
        });
    };

    //query by name
    const queryByName = () => {
        let name = queryValues["dao_name_query"];
        if(!name){
            return showSnackbar(t('empty_input'),'error')
        }
        if(dao_info) {
            dao_info.getWalletInfoByName(name).catch(err => {}).then(infos =>{
                if(inPanel){
                    if(infos[1] === constants.AddressZero) {
                        return showSnackbar(t('no_dao'),'info')
                    }else {
                        let [address,,name,,createTime] = infos
                        createTime =  + (createTime.mul(1000))
                        let data = [[name,address,convertTimetoTimeString(createTime)]]
                        setAmount(1)
                        setTableData(data)
                    }
                }
            })
        }
    }

    const queryByAddress = () => {
        let address = queryValues["dao_address_query"]
        if(!address || !isAddress(address)){
            return showSnackbar(t('invalid_address'),'error')
        }
        if(dao_info) {
            dao_info.getWalletInfo(address).catch(err => {}).then(infos =>{
                if(inPanel){
                    if(infos[0] === constants.AddressZero) {
                        return showSnackbar(t('no_dao'),'info')
                    }else {
                        let [,name,,createTime] = infos
                        createTime =  + (createTime.mul(1000))
                        let data = [[name,address,convertTimetoTimeString(createTime)]]
                        setAmount(1)
                        setTableData(data)
                    }
                }
            })
        }
    }

    const queryByCreator = async () => {
        let address = queryValues["dao_creator_query"]
        if(!address || !isAddress(address)){
            return showSnackbar(t('invalid_address'),'error')
        }
        if(dao_info) {
            let len = await dao_info.getUserWalletCount(address);
            len = + len;
            if(inPanel) {
                if(len === 0) {
                    return showSnackbar(t('no_dao'),'info')
                }else if (len === 1 ){
                    let dao_address = await dao_info.userWallets(address,0);
                    let infos = await dao_info.getWalletInfo(dao_address)
                    let [,name,,createTime] = infos
                    createTime =  + (createTime.mul(1000))
                    let data = [[name,dao_address,convertTimetoTimeString(createTime)]]
                    if(inPanel) {
                        setAmount(1)
                        setTableData(data)
                    }
                }else {
                    setOffset(0)
                    setCreator(address)
                    setAmount(len)
                }
            }
        }
    }

    useEffect(()=>{
       return () => setInPanel(false)
    },[])

    //refresh list
    useEffect(()=>{
        if( dao_info && amount > 1 && creator ){
            let stale = false
            async function getInfoByOffset(_offset){
                let indexArray = getIndexArray(amount,PAGE_SIZE,_offset)
                if(indexArray.length === 0)
                  return;
                let addressArray = []
                for(let i=0;i<indexArray.length;i++){
                    let address = await dao_info.userWallets(creator,indexArray[i]);
                    addressArray.push(address);
                }
                let allPromise = []
                 for(let i=0;i<addressArray.length;i++){
                     allPromise.push(dao_info.getWalletInfo(addressArray[i]).catch(() => {}))
                 }
                 let _tableData = []
                 Promise.all(allPromise).then(results =>{
                     for(let j=0;j<addressArray.length;j++){
                         let [,name,,createTime] = results[j]
                         createTime =  + (createTime.mul(1000))
                         _tableData.push([name,addressArray[j],convertTimetoTimeString(createTime)])
                     }
                     if(!stale){
                         setTableData(_tableData)
                     }
                 });
            }
            getInfoByOffset(offset)
            return ()=>{
                stale = true
            }
        }
    },[dao_info,amount,creator,offset])

    const getQueryFuncByKey = (key) => {
        switch (key) {
            case "dao_name_query":
                return queryByName
            case "dao_address_query":
                return queryByAddress
            case "dao_creator_query":
            default:
                return queryByCreator
        }
    }

    function showSearchUI() {
        let keys = []
        // eslint-disable-next-line
        for(let key in queryValuesInit) {
            keys.push(key)
        }
        return keys.map((key,index) =>
            <div className={classes.typoTwo}>
                <div className={classes.note} >
                        {t(key)}
                </div>
                <div className={classes.searchWrapperLeft} >
                    <CustomInput
                        formControlProps={{
                            className:classes.addressTxt
                        }}
                        inputProps={{
                            placeholder: t("input" + key),
                            inputProps: {
                                "aria-label":key
                            },
                            onChange:handleChange(key)
                        }}
                     />
                     <Button color="primary" aria-label="edit" onClick={getQueryFuncByKey(key)} justicon="true" round="true">
                         <Search />
                     </Button>
                </div>
            </div>
        )
    }

    function showTableData() {
        return (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card plain>
                  <CardHeader plain color="primary">
                    <h4 className={classes.cardTitleWhite}>
                        { t("dao_amount").replace("{amount}",amount)}
                    </h4>
                    <p className={classes.cardCategoryWhite}>
                      {t("show_dao")}
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Table
                      tableHeaderColor="primary"
                      tableHead={[t("name"),t("address"),t("create_time")]}
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
        )
    }

    return (<>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{t("search_dao")}</h4>
            </CardHeader>
            <CardBody>
                {showSearchUI()}
            </CardBody>
        </Card>
       {amount > 1 && showTableData()}
    </>)
}

SerachDao.propTypes = {
    classes: PropTypes.object
};

export default withRouter(SerachDao)
