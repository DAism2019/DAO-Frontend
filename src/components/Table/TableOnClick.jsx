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
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
// import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect'
import { getPathBase,shortenAddress } from 'utils'
import { Link } from 'react-router-dom';
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

const FONT_SIZE  = isMobile ? 13 : 20;

function CustomTable({ ...props }) {
  const { classes, tableHead, tableData, tableHeaderColor } = props;
  const {origin} = window.location
  // const pre_url = origin + getPathBase() + '/full#';

  // const handleClick = id => event =>{
  //       event.preventDefault()
  //       window.open(pre_url + id)
  //       return false
  // }
  // const handleClickAddress = author => event => {
  //     event.preventDefault()
  //     console.log(author)
  //     return false
  // }

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    // style={{fontSize:FONT_SIZE}}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
                  <TableRow key={key} className={classes.tableBodyRow}>
                    {prop.map((_prop, key) => {
                      return (
                        <TableCell className={classes.tableCell} key={key} style={{fontSize:FONT_SIZE}}>
                            {key ===1 ? <Link to={"/full#" + prop[1]} > { isMobile ? shortenAddress(_prop) : _prop} </Link> :_prop}
                        </TableCell>
                      );
                    })}
                  </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(tableStyle)(CustomTable);
