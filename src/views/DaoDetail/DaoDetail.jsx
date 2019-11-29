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
import React, {useState, useEffect, useRef} from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import {makeStyles} from '@material-ui/core/styles';
import { withRouter } from 'react-router'
import Button from '@material-ui/core/Button';
import copy from 'copy-to-clipboard'
import { isMobile } from 'react-device-detect'
import { useStoreInfoContract,useMethodInfoContract,useMethodAdminContract,useTemplateOneContract} from 'hooks';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import { useTranslation } from 'react-i18next'
import Pagination from "material-ui-flat-pagination"
import {useWeb3Context} from 'web3-react';
import { getIndexArray,convertTimetoTimeString,getContract,calculateGasMargin } from 'utils'
import styled from 'styled-components'
import { utils } from 'ethers'
// import * as txDecoder from 'ethereum-tx-decoder';

const GAS_MARGIN = utils.bigNumberify(1000);
const PAGE_SIZE = 10;
const SPLITTER = '_'

const ContentWrapperTwo = styled.p`
     margin: auto;
     font-size:1rem;
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
        width:isMobile ? "40%" :"10%",
        backgroundColor:'#FF8623'
      },
    buttonWrapper:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

const store_info_init = {
    creator:'',
    store:'',
    id:'',
    createTime:'',
    name:'',
    description:'',
    label:'',
    website:''
}

const MY_MUTISIG_WALLET = '0xb22b64776b296182005AA50d5a76ec01CdcB8068'

function DappDetail({history}) {
    const classes = useStyles()
    const {t} = useTranslation()
    const hash = history.location.hash;
    const {library,account} = useWeb3Context();
    const store_info_contract = useStoreInfoContract()
    const method_info_contract = useMethodInfoContract()
    const method_admin_contract = useMethodAdminContract()
    const template_one_contract = useTemplateOneContract(MY_MUTISIG_WALLET)
    const showSnackbar= useSnackbarContext()
    // show dapp infos
    const [hasApp,setHasApp] = useState(false)
    const [storeInfo,setStoreInfo] = useState(store_info_init)
    const [tip,setTip] = useState('')
    // show method infos
    const [methodCount,setMethodCount] = useState(0)
    const [offset,setOffset] = useState(0)
    const [indexArray,setIndexArray] = useState([])
    const [methodInfo,setMethodInfo] = useState([])

    const copyURL = (event)=>{
        event.preventDefault();
        if(copy(window.location.href)){
            showSnackbar(t("url_copied"),'info',null)
        }
    };

    //refresh method amount and index array
    useEffect(()=>{
        if(storeInfo.id && method_info_contract && method_admin_contract) {
            let stale = false;
            async function getMethodCount() {
                let amount = await method_info_contract.getStoreMethodCount(storeInfo.id)
                if(!stale){
                    setMethodCount( +amount);
                }
            }
            let _id = utils.bigNumberify(storeInfo.id)
            //todo test
            // let filter = method_admin_contract.filters.AddOneMethodSuc(null,_id);
            // let filter2 = method_admin_contract.filters.RemoveMethodSuc(null,_id);
            // let filter3 = method_admin_contract.filters.UpdateMethodSuc(null,_id);
            // method_admin_contract.on(filter,(creator,storeId,amount,event) =>{
            //     console.log("receive a addmethod event")
            //     setMethodCount(+amount)
            // })
            // method_admin_contract.on(filter2,(creator,storeId,index,amount,event) =>{
            //     console.log("receive a remove method event")
            //     setMethodCount(+amount)
            // })
            // method_admin_contract.on(filter3,(creator,storeId,index,event) =>{
            //     console.log("receive a update method event")
            //     method_info_contract.getStoreMethodCount(storeInfo.id).then(amount =>{
            //         let _count = + amount;
            //         let _indexArray = getIndexArray(amount,PAGE_SIZE,offset);
            //         if(_indexArray.indexOf(index) !== -1){
            //             //todo update one method
            //             if(!stale){
            //                 setIndexArray(_indexArray)
            //             }
            //
            //         }
            //     });
            // })
            getMethodCount()
            return ()=>{
                stale = true;
                // method_admin_contract.removeAllListeners('AddOneMethodSuc');
                // method_admin_contract.removeAllListeners('RemoveMethodSuc');
                // method_admin_contract.removeAllListeners('UpdateMethodSuc');
            }
        }
    },[storeInfo.id,method_info_contract,method_admin_contract])

    //refresh method info
    useEffect(()=> {
        if(storeInfo.id && method_info_contract && indexArray.length > 0) {
            let stale = false;
            function getMethodInfo() {
                let allPromise = [];
                for (let i=0;i<indexArray.length;i++){
                    let _index =indexArray[i];
                    allPromise.push(method_info_contract.allStoreMethodInfos(storeInfo.id,_index));
                }
                Promise.all(allPromise).then(results =>{
                    let _methodInfo = []
                    for(let j=0;j<indexArray.length;j++){
                        let info = results[j];
                        let to = info[0];
                        let isPayable = info[1];
                        let value = info[2];
                        let infos = info[3];
                        let data = info[4];
                        let isHidden = info[5];
                        let _id = indexArray[j];
                        _methodInfo.push([_id,to,isPayable,value,infos,data,isHidden])
                    }
                    if(!stale){
                        setMethodInfo(_methodInfo)
                    }
                });
            }
            getMethodInfo()
            return () =>{
                stale = true;
            }
        }

    },[indexArray,storeInfo.id,method_info_contract])

    //refresh index str
    useEffect(()=>{
        if(methodCount > 0){
            let _indexArray = getIndexArray(methodCount,PAGE_SIZE,offset);
            setIndexArray(_indexArray)
        }
    },[methodCount,offset])

    //refresh idArray

    //show dapp
    useEffect(()=>{
        if(hash && store_info_contract && method_info_contract && hash.length > 1){
            let _hash = +(hash.substring(1));
            if(Number.isNaN(_hash) || _hash <= 0){
                setTip(t('search_dapp_first'));
            }else{
                //get infos of dapp
                setTip(t('getting'));
                let stale = false;
                async function getDappInfo() {
                    let infos = await store_info_contract.allStoreInfos(_hash);
                    let id = + infos[2];
                    if( _hash !== id){
                        if(!stale){
                           setTip(t('no_dapp'))
                        }
                    }else{

                        let creator = infos[0]
                        let store = infos[1]
                        let createTime = (+ infos[3]) * 1000
                        createTime = convertTimetoTimeString(createTime)
                        let name = infos[4]
                        let description = infos[5]
                        let label = infos[6]
                        let website = infos[7]
                        if(!stale){
                            setHasApp(true);
                            setTip(t("dapp_label") + ": " + label)
                            setStoreInfo({
                                creator,
                                store,
                                createTime,
                                name,
                                id,
                                description,
                                label,
                                website
                            });
                        }
                    }
                }
                getDappInfo()
                return ()=>{
                    stale = true
                }
            }
        }else{
            setTip(t('search_dapp_first'))
        }
    },[hash,store_info_contract,method_info_contract,t])

    const bindIndex = index => async () => {
        // call method index

        let [,to,isPayable,value,infos,,] =  methodInfo[index]
        let [name,description,paramType,paramDemo] = infos.split('|');
        let abi = getAbi(name,paramType)
        let contract = getContract(to,abi,library,account);
        let method = contract[name]
        let args = ['haha'];
        //encode
        let func = contract.interface.functions[name]
        let data = func.encode(args);
        // var fnDecoder = new txDecoder.FunctionDecoder(abi);
        // let _code2 = fnDecoder.decodeFn(data);
        let multi_args = [to,value,data]
        let method_multi = template_one_contract['submitTransaction']
        method_multi(...multi_args,{
            gasPrice:utils.parseUnits('10.0','gwei')
        }).catch( err => {
            console.log(err);
        }).then(()=> showSnackbar(t("transaction_send_success"),'success'))
        //
        // let estimate = (contract.estimate)[name]
        // const estimatedGasLimit = await estimate(...args, { value });
        // method(...args,{
        //     value,
        //     gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        //     gasPrice:utils.parseUnits('10.0','gwei')
        // }).catch( err => {
        //     console.log(err);
        // }).then(()=> showSnackbar(t("transaction_send_success"),'success'))
    };

    function getAbi(name,paramType) {
        let allParam = paramType.split(',');
        let param_str = '';
        for(let i=0;i<allParam.length;i++){
            param_str += allParam[i] + " " + "parma" + i;
            if(i != allParam.length -1) {
                param_str += ","
            }
        }
        let str = "function " + name + "(" + param_str  + ")"
        let abi = [str];
        return abi;
    }

    function showMethodTable() {
        return (
            methodInfo.map((row,index) => (
                showOneMethod(row,index)
            ))
        )
    }

    function showOneMethod(row,index) {
        if(row[4] ==='infos_skip'){
            row[4] = "skip_name|skip_des|uint256|300"
        }
        let [,to,isPayable,value,infos,data,isHidden] = row
        infos = infos.split('|');
        let [name,description,paramType,paramDemo] = infos;
        paramType = paramType || ''
        let allParam = paramType.split(',');
        return (
            <Card key={index}>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>{t("dapp_method_name") + ": " + name}</h4>
                </CardHeader>
                <CardBody>
                    {isMobile ? <>
                        <ContentWrapperTwo>
                          {t("method_description") + ":"}
                        </ContentWrapperTwo>
                        <ContentWrapperTwo>
                          {description}
                        </ContentWrapperTwo>
                        <ContentWrapperTwo>
                          {t("method_to") + ":"}
                        </ContentWrapperTwo>
                        <ContentWrapperTwo>
                          {to}
                        </ContentWrapperTwo>
                    </>
                    : <>
                        <ContentWrapperTwo>
                            {t("method_description") + ": " + description}
                        </ContentWrapperTwo>
                        <ContentWrapperTwo>
                          {t("method_to") + ": "  + to}
                        </ContentWrapperTwo>
                    </>}
                    <ContentWrapperTwo>
                      {t("method_isPayable") + ": "  + isPayable}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("method_value") + ": "  + utils.formatEther(value) + " ETH"}
                    </ContentWrapperTwo>
                    { allParam.map((param,paramIndex) => (
                        <ContentWrapperTwo key={paramIndex}>
                          {t("param_type").replace("{index}",paramIndex +1 ) + ": " + param}
                        </ContentWrapperTwo>
                    ))}
                    {isMobile ? <>
                        <ContentWrapperTwo>
                          {t("param_demo") + ":"}
                        </ContentWrapperTwo>
                        <ContentWrapperTwo>
                          {paramDemo}
                        </ContentWrapperTwo>
                    </>
                    : <>
                        <ContentWrapperTwo>
                            {t("param_demo") + ": " + paramDemo}
                        </ContentWrapperTwo>
                    </>}
                    <div className={classes.buttonWrapper}>
                       <Button variant="contained" disabled ={!account} onClick={bindIndex(index)} className={classes.transferButton}>
                             {t("call")}
                       </Button>
                    </div>
                </CardBody>
            </Card>
        )
    }

    function showMethodAmount() {
        return (
            <>
                {showMethodTable()}
                <div className = {classes.buttonWrapper}>
                    <Pagination
                     limit={PAGE_SIZE}
                     offset={offset}
                     total={methodCount}
                     size ='large'
                     onClick={(e,_offset) => {
                          if(_offset === offset)
                              return;
                          setOffset(_offset)
                     }}
                   />
                </div>
            </>
        )
    }

    function showStoreInfos() {
        const { creator,store,id,createTime,description,website } = storeInfo;
        return (
            <div>
                {isMobile ? <>
                    <ContentWrapperTwo>
                      {t("dapp_address") + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {store}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("creator_address") + ":"}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {creator}
                    </ContentWrapperTwo>
                </>
                : <>
                    <ContentWrapperTwo>
                        {t("dapp_address") + ": " + store}
                    </ContentWrapperTwo>
                    <ContentWrapperTwo>
                      {t("creator") + ": " + creator}
                    </ContentWrapperTwo>

                </>
              }
              <ContentWrapperTwo>
                {t("dapp_id") + ": " + id}
              </ContentWrapperTwo>
              {isMobile ? <>
                  <ContentWrapperTwo>
                    {t("create_time") + ":"}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {createTime}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {t("dapp_description") + ":"}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {description}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {t("dapp_website") + ":"}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                      <a href={website} target="_blank">
                          {website}
                      </a>

                  </ContentWrapperTwo>
              </>
              : <>
                  <ContentWrapperTwo>
                    {t("create_time") + ": " + createTime}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {t("dapp_description") + ": " + description}
                  </ContentWrapperTwo>
                  <ContentWrapperTwo>
                    {t("dapp_website") + ": "}
                    <a href={website} target="_blank">
                         {website}
                    </a>
                  </ContentWrapperTwo>
              </>
            }
            </div>
        )
    }
    return (<>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{t("dapp_name") + ": " + storeInfo.name}</h4>
                <p className={classes.cardCategoryWhite}>
                  {tip}
                </p>
            </CardHeader>
            <CardBody>
                {hasApp &&  <div className={classes.copyText}>
                    <Button onClick={copyURL} color='secondary'>
                      {t('click_share')}
                    </Button>
                 </div> }
                {hasApp && showStoreInfos()}
            </CardBody>
        </Card>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{t("dapp_method_list")}</h4>
                <p className={classes.cardCategoryWhite}>
                  {t("method_amount").replace("{amount}",(methodCount < 0 ? 0 :methodCount))}
                </p>
            </CardHeader>
        </Card>
        {hasApp && showMethodAmount()}
    </>)
}

DappDetail.propTypes = {
    classes: PropTypes.object
};

export default withRouter(DappDetail)
