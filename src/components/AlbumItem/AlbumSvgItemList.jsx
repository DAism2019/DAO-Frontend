import React,{useRef,useEffect,useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import copy from 'copy-to-clipboard';
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';
import {parse, stringify} from 'svgson'

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: center;
  `


const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    width:100
  },
  card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  svgMedia:{
      marginTop:20,
      marginBottom: -10
  },
  cardContent: {
    flexGrow: 1,
    backgroundColor:'rgba(230,230,230,.30)'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

//dangerouslySetInnerHTML={{__html: url}}
// const boxInfoInit = {
//     width:380,
//     minWidth:380,
//     height:500,
//     minHeight:500
// }

export default function Album({url,index,hash}){
    const classes = useStyles();
    const ref = useRef()
    const ref2 = useRef()
    const [svgWidth,setSvgWidth] = useState(0)
    const showSnackbar = useSnackbarContext()
    const {t} = useTranslation()
    const onClick = (event) =>{
        event.preventDefault();
        if(url && copy(url)){
            showSnackbar(t("code_copied"),'info',null)
        }
    }
    // const [boxInfo,setBoxInfo] = useState(boxInfoInit)
    useEffect(()=>{
        if(ref.current && url && svgWidth){
           parse(url).then(result =>{
               let new_json = result;
               new_json.attributes.height = svgWidth
               new_json.attributes.width = svgWidth
               let final = stringify(new_json);
               ref.current.innerHTML = final;
           }).catch(err => null)
       }
   },[url,svgWidth])

   // get card width
    useEffect(()=>{
        if(ref2.current){
            if(ref2.current.clientWidth){
                setSvgWidth(ref2.current.clientWidth)
            }
        }
        return ()=>{
            setSvgWidth(0)
        }
    },[])
    //xs={6} sm={6} md={3}
    return (
        // <Grid item   style={{height:boxInfo.height,minHeight:boxInfo.minHeight,width:boxInfo.width,minWidth:boxInfo.minWidth}}>
        <Grid item  xs={12} sm={12} md={3}>

          <Card className={classes.card} ref = {ref2}>
              <HeaderWrapper>
                  <div className = {classes.svgMedia}
                      ref = {ref}
                  />
              </HeaderWrapper>

              <CardContent className={classes.cardContent}>
                  {/* <Typography gutterBottom variant="h5" component="h2">

                  </Typography> */}
                  <HeaderWrapper>
                      {/* {"# " + (index + 1)} */}
                      <Button size="large" color="primary" onClick = {onClick}>
                         { t("click_to_copy")}
                       </Button>

                  </HeaderWrapper>
              </CardContent>
          </Card>
        </Grid>

    )
}
