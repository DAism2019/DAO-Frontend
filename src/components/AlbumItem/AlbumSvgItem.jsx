import React,{useRef,useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
// import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
// import svgson from 'svgson'


// import GridListTileBar from '@material-ui/core/GridListTileBar';

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
  radioControl:{
      marginTop: theme.spacing(-2),
      // marginBottom:theme.spacing(1),
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
//     width:'',
//     minWidth:'',
//     height:'',
//     minHeight:''
// }

export default function Album({url,active,hasCode,onUpload}){
    const classes = useStyles()
    const ref = useRef()
    const {t} = useTranslation()
    const [value, setValue] = React.useState('public');
    // const [boxInfo,setBoxInfo] = useState(boxInfoInit)
    const handleChange = event => {
        setValue(event.target.value);
    };

    const clickBtn = event => {
        event.preventDefault();
        if(onUpload){
            onUpload(value)
        }
    };

    useEffect(()=>{
        if(ref.current && url){
            ref.current.innerHTML = url
        }
        // if(url){
        //     svgson.parse(url).then(result =>{
        //         let height = parseInt(result.attributes.height);
        //         let width = parseInt(result.attributes.width);
        //         setBoxInfo({
        //             height:height + 150,
        //             minHeight:height + 150,
        //             width:width + 15,
        //             minWidth:width + 15
        //         })
        //     })
        // }
    },[url])
    //xs={6} sm={6} md={3}
    return (
        // <Grid item   style={{height:boxInfo.height,minHeight:boxInfo.minHeight,width:boxInfo.width,minWidth:boxInfo.minWidth}}>
        <Grid item xs={12} sm={12} md={3}  >
          <Card className={classes.card}>
              <HeaderWrapper>
                  <div className = {classes.svgMedia}
                      ref = {ref}
                  />
              </HeaderWrapper>
            <CardActions>
               <HeaderWrapper>
                   { active && hasCode===false &&
                       <div>

                               <FormControl component="fieldset">
                                   <FormLabel component="legend" >{t("select_svg_type")}</FormLabel>
                                   <RadioGroup aria-label="svg_type" name="svg_type" row value={value} onChange={handleChange} className={classes.radioControl}>
                                     <FormControlLabel value="public" selected control={<Radio />} label={t('public')}/>
                                     <FormControlLabel value="private" control={<Radio />} label={t("private")} />
                                   </RadioGroup>
                               </FormControl>

                            <div style={{width:"100%",textAlign:"center"}}>
                                <Button size="small" color="primary"  onClick = {clickBtn}>
                                    {t('upload')}
                                </Button>
                            </div>

                       </div>
                   }
                   {hasCode === true && <p>
                       {t("hasUpload")}
                   </p>}
               </HeaderWrapper>
            </CardActions>
          </Card>
        </Grid>

    )
}
