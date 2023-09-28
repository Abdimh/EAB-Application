import React from 'react'
import { toast, TypeOptions } from 'react-toastify'

export const CustomToast = (title, Isloading, types ) => toast(title, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: types || "default",
    isLoading: Isloading,
    theme: "light",
    });
