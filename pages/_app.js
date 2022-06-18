import Layout from '../components/layout';
import '../styles/globals.css';
import '../styles/nprogress.css';
import Router from 'next/router';
import NProgress from 'nprogress';

import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '../lib/contexts/LanguageContext';

import { SessionProvider } from "next-auth/react"


NProgress.configure({ ease: 'ease-out', speed: 500 })
Router.events.on('routeChangeStart', () => {
  NProgress.start();
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
})

Router.events.on('routeChangeError', () => {
  NProgress.done();
  NProgress.configure({ ease: 'ease', speed: 1000 });
})

function Bloodline({ Component, pageProps, router, session }) {
  return (
    <LanguageProvider>
      <SessionProvider session={session}>
        <Layout>
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </SessionProvider>
    </LanguageProvider>
  )
}

export default Bloodline;
