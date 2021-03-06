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
// import Dashboard from "@material-ui/icons/Dashboard"
import Unarchive from "@material-ui/icons/Unarchive";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
import Search from "@material-ui/icons/Search";
// import HowToReg from "@material-ui/icons/HowToReg";
import AppsIcon from '@material-ui/icons/Apps';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
// import EditorIcon from '@material-ui/icons/Edit';
// custom views
import AllDaos from "views/AllDaos/AllDaos.jsx"

// import Guide from 'views/Guide/Guide.jsx'
import SearchDao from 'views/SearchDao/SearchDao.jsx'
import RegisterDao from 'views/RegisterDao/RegisterDao.jsx'
import DaoAdmin from 'views/DaoAdmin/DaoAdmin.jsx'

const dashboardRoutes = [
    {
        path: "latest",
        name: "latest_dao",
        icon: AppsIcon,
        component: AllDaos,
        layout: "/"
    },

    {
        path: "register",
        name: "register_dao",
        icon: Unarchive,
        component: RegisterDao,
        layout: "/"
    },
    {
        path: "admin",
        name: "dao_admin",
        icon: FormatAlignJustifyIcon,
        component: DaoAdmin,
        layout: "/"
    },
    // {
    //     path: "mine",
    //     name: "my_dapp",
    //     icon: LibraryBooks,
    //     component: MyArticle,
    //     layout: "/"
    // },
    {
        path: "search",
        name: "search_dao",
        icon: Search,
        component: SearchDao,
        layout: "/"
    },
    // {
    //     path: "guide",
    //     name: "guide",
    //     icon: Dashboard,
    //     component: Guide,
    //     layout: "/"
    // }
];

export default dashboardRoutes;
