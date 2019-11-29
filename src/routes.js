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
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard"
import Unarchive from "@material-ui/icons/Unarchive";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import Search from "@material-ui/icons/Search";
import HowToReg from "@material-ui/icons/HowToReg";
import AppsIcon from '@material-ui/icons/Apps';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import EditorIcon from '@material-ui/icons/Edit';
// custom views
import AllDaos from "views/AllDaos/AllDaos.jsx"
// import ArticleUpload from "views/ArticleUpload/ArticleUpload.jsx"
// import MyDapp from "views/MyDapp/MyDapp.jsx"
// import AllSvg from "views/AllSvg/AllSvg.jsx"
// import Guide from 'views/Guide/Guide.jsx'
// import SearchDapp from 'views/SearchDapp/SearchDapp.jsx'
// import RegisterDapp from 'views/RegisterDapp/RegisterDapp.jsx'
// import DaoDetail from 'views/DappDetail/DappDetail.jsx'

const dashboardRoutes = [
    {
        path: "latest",
        name: "latest_dao",
        icon: AppsIcon,
        component: AllDapps,
        layout: "/"
    },
    // {
    //     path: "full",
    //     name: "full_dao",
    //     icon: FormatAlignJustifyIcon,
    //     component: DappDetail,
    //     layout: "/"
    // },
    // {
    //     path: "register",
    //     name: "register_dapp",
    //     icon: Unarchive,
    //     component: RegisterDapp,
    //     layout: "/"
    // },
    // {
    //     path: "mine",
    //     name: "my_dapp",
    //     icon: LibraryBooks,
    //     component: MyArticle,
    //     layout: "/"
    // },
    // {
    //     path: "search",
    //     name: "query_dapp",
    //     icon: Search,
    //     component: SearchDapp,
    //     layout: "/"
    // },
    // {
    //     path: "guide",
    //     name: "guide",
    //     icon: Dashboard,
    //     component: Guide,
    //     layout: "/"
    // }
];

export default dashboardRoutes;
