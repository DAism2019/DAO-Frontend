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
import Article from 'assets/txt/guide.txt'

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
    }
}));

export default function TypographyPage() {
    const classes = useStyles()
    const [viewData,setViewData] = useState('')

    //获取文章内容
    useEffect(()=>{
        fetch(Article).then( r => r.text()).then( txt => setViewData(txt)).catch(err => null)
    },[])

    // 显示文章内容
    const ref = useRef()
    useEffect(() => {
        if (ref.current && viewData) {
            ref.current.innerHTML = viewData
        }
    }, [viewData])

    return (<>
        <Card>
            <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>使用指南</h4>
            </CardHeader>
            <CardBody>
                <div ref = {ref} />
            </CardBody>
        </Card>
    </>)
}

TypographyPage.propTypes = {
    classes: PropTypes.object
};
