import Head from 'next/head';
import Link from './link'; // custom link component for active styles
import NProgress from 'nprogress';

import { useState } from 'react';

import useTranslation from '../../hooks/useTranslation';
import nprogress from 'nprogress';
import { signIn, useSession, signOut } from 'next-auth/react';

const Layout = ({ children }) => {
  const { t, setLocale, locales, locale } = useTranslation();
  const { data: session, status } = useSession();
  let menuLinks = [];

  if (status == 'unauthenticated') {
    menuLinks =
      [
        { href: '/', label: t('Home') },
        { href: '/donate', label: t('Donate') },
        { href: '/requests', label: t('Requests') },
        { href: '/signin', label: t('SignIn'), drawerOnly: true },
      ]
  }
  else if (status == "authenticated") {
    menuLinks =
      [
        { href: '/', label: t('Home') },
        { href: '/donate', label: t('Donate'), drawerOnly: true },
        { href: '/requests', label: t('Requests'), drawerOnly: true },
        { href: '/hospitals', label: session.user.name },
        { href: '#signout', label: t('SignOut'), onClick: signOut },
      ];
  }

  // Handle language change:
  function handleLocaleChange(language) {
    if (!window) {
      return;
    }
    nprogress.start(); // Loading effect for better UX.
    nprogress.done();
    localStorage.setItem('lang', language);
    setLocale(language);
  }

  // Drawer (sliding menu):
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = function () {
    setDrawer(!drawer)
  }

  return (
    <>
      <Head>

        {/* Metatags only */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          Bloodline
        </title>
        <meta name="description" content="Blood donation made easy." />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Preview */}
        <meta property="og:url" content="https://bloodlinemacedonia.co/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Bloodline Macedonia"
        />
        <meta
          property="og:description"
          content="Bloodline Macedonia - blood donation made easy."
        />
        <meta name="twitter:card" content="summary" />
        {/* <meta property="og:image" content="https://i.postimg.cc/G2dtq6bP/logo.png" /> */}
      </Head>
      <div className={drawer ? 'drawer open' : 'drawer'}>
        <ul>
          {menuLinks.map((link, index) => (
            <li key={index}>
              <Link href={link.href} activeClassName="active"><a onClick={() => { toggleDrawer(); if (link.onClick) { link.onClick() } }}>{link.label}</a></Link>
            </li>
          ))}
          {/* <li>
            <Link activeClassName="active" href="/" ><a onClick={toggleDrawer}>{t("Home")}</a></Link>
          </li>
          <li>
            <Link activeClassName="active" href="/donate" ><a onClick={toggleDrawer}>{t("Donate")}</a></Link>
          </li>
          <li>
            <Link activeClassName="active" href="/requests" ><a onClick={toggleDrawer}>{t("Requests")}</a></Link>
          </li>
          {status === "authenticated" && (
            <li>
              <Link activeClassName="active" href="/hospitals" ><a onClick={toggleDrawer}>{session.user.name}</a></Link>
            </li>
          ) || (
              <li>
                <Link activeClassName="active" href="/login" ><a onClick={toggleDrawer}>Login</a></Link>
              </li>
            )}
          {status === 'authenticated' && (
            <li>
              <a href='#signout' onClick={signOut}>Sign out</a>
            </li>
          )} */}
        </ul>
      </div>

      <div className='navContainer'>
        <div onClick={toggleDrawer} className={drawer ? 'menu open' : 'menu'}>
          <div className="bars">
            <div className="bar"></div>
            <div className="bar2"></div>
          </div>
        </div>
        <nav className='nav'>
          <ul>
            {menuLinks.filter(link => !link.drawerOnly).map((link, index) => (
              <li key={index}>
                <Link href={link.href} activeClassName="active"><a onClick={() => { if (link.onClick) { link.onClick() } }}>{link.label}</a></Link>
              </li>
            ))}
            {/* <li>
              <Link href={`/`} activeClassName='active'>
                <a>
                  {t("Home")}
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/donate`} activeClassName='active'>
                <a>
                  {t("Donate")}
                </a>
              </Link>
            </li>
            {status === "authenticated" && (
              <li>
                <Link activeClassName="active" href="/hospitals" ><a>{session.user.name}</a></Link>
              </li>
            ) || (
                <li>
                  <Link href={`/requests`} activeClassName='active'>
                    <a>
                      {t("Requests")}
                    </a>
                  </Link>
                </li>
              )}
            {status === 'authenticated' && (
              <li>
                <a href='#signout' onClick={signOut}>Sign out</a>
              </li>
            )} */}
            <li className="lang" style={{ position: 'absolute', right: '0' }}>
              <div>
                {locales.map((l) => (
                  <span key={l} style={(l == locale ? { color: "#DA3237" } : {})}>
                    <a href={`#${l}`} onClick={() => handleLocaleChange(l)}>
                      {l}
                    </a> &nbsp; &nbsp;
                  </span>

                ))}
              </div>
            </li>
          </ul>

        </nav>
      </div>
      {children}
      <div className='footer'>
        <div className='links'>
          <a href='mailto:bloodlinemacedonia@gmail.com'>{t("EmailUs")} &rarr;</a>
        </div>
        <p> &copy; 2022 Bloodline Macedonia</p>
        {/* <p> With <span style={{ color: '#DA3237' }}>&hearts;</span> from Bloodline Team </p> */}
      </div>
    </>
  )

};

export default Layout;