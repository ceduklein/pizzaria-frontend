import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '../../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css'; 

import { AuthProvider } from '../contexts/Autcontext'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={4000} />
    </AuthProvider>
  )
  
  
}
