import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import svgToDataURL from 'svg-to-dataurl'


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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    backgroundColor:'rgba(230,230,230,.30)'
  },
  svgMedia:{
      marginTop:20,
      marginBottom: -10
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  svgWrapper:{
      width:"100%",
      display: 'flex',
      flexDirection: 'column',
      alignItems:'center'
  }
}));


export default function Album({url,tokenId,owner,mine,onSend,onSell}){
    const classes = useStyles();

    return (
        <Grid item  xs={6} sm={6} md={3} >
          <Card className={classes.card}>
              {/* <div className={classes.svgWrapper}>
                  <div className = {classes.svgMedia}
                     dangerouslySetInnerHTML={{__html: url}} />
              </div> */}
            <CardMedia
              className={classes.cardMedia}
              image={svgToDataURL(url)}
              title="纪念币"
            />

            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {"# " + tokenId}
              </Typography>
              <Typography>
                {"owner:" + owner}
              </Typography>
            </CardContent>
            {mine &&
                <CardActions>
                   <HeaderWrapper>
                       <Button size="small" color="primary" onClick = {onSend}>
                         赠送
                       </Button>
                       <Button size="small" color="primary" onClick = {onSell}>
                         出售
                       </Button>
                   </HeaderWrapper>

                </CardActions>
            }
          </Card>
        </Grid>

    )
}
