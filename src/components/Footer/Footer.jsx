/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { useTranslation } from 'react-i18next'
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes } = props;
  const {t} = useTranslation()
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                  // onClick = {(event)=>{
                  //     event.preventDefault();
                  //     return false;
                  // }}
                  href="https://naturaldao.io"
                  target='_blank' className={classes.block}>
                {t("NaturalDao")}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                  href="https://naturaldao.io/exchange/"
                  // onClick = {(event)=>{
                  //     event.preventDefault();
                  //     return false;
                  // }}
                 target='_blank' className={classes.block}>
                {t("Exchange")}
            </a>
            </ListItem>
            {/* <ListItem className={classes.inlineBlock}>
              <a href="https://naturaldao.io/tokenview/"  target='_blank' className={classes.block}>
                commemorative_coin
              </a>
            </ListItem> */}
            {/* <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={classes.block}>
                Blog
              </a>
            </ListItem> */}
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            {/* <a href="https://dhonor.io" target="_blank" className={classes.a}> */}
              DappStore,
            {/* </a> */}
            {t("dapp_storee_description")}
          </span>
          {/* <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="https://naturaldao.io" target="_blank" className={classes.a}>
              NaturalDao
            </a>
            ,  a network for DEX and D-Payment
          </span> */}
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
