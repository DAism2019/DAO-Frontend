import React, { createContext, useContext, useState } from 'react'
import CustomSnackbar from 'components/CustomSnackbar'

const SNACKBAR_INIT = {
        show: false,
        type: 'success',
        pos:"left",
        message:'',
        closeNotification:null
}

const SnackbarContext = createContext()

export function useSnackbarContext() {
    return useContext(SnackbarContext)
}

export default function Provider({children}) {
    const [snackbar,setSnackbar] = useState(SNACKBAR_INIT)
    function hideSnackbar() {
        setSnackbar({
            show:false,
            pos:'left',
            message:'',
            type:'',
            closeNotification:null
        })
    }
    const showSnackbar = (message,type,closeNotification) => {
        setSnackbar({
               show:true,
               pos:'left',
               message,
               type,
               closeNotification
         })
    };
    const {show,type,message,pos,closeNotification} = snackbar
    return (<SnackbarContext.Provider value={showSnackbar}>
         {children}
         {show && <CustomSnackbar type={type} message = {message} pos= {pos} onClose={hideSnackbar} closeNotification={closeNotification}/>}
    </SnackbarContext.Provider>)
}
