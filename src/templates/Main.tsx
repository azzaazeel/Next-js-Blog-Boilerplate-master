import React, { ReactNode, useState, useRef, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { BackToTop } from '../components/BackToTop';
import { Search } from '../components/Search';
import { ThemeToggle } from '../components/ThemeToggle';
import { useSession, signOut } from '../lib/auth-client';
import { Navbar } from '../navigation/Navbar';
import { AppConfig } from '../utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="antialiased w-full text-gray-700 dark:text-gray-300 px-3 md:px-0 transition-colors duration-300">
      {props.meta}

      <div className="max-w-4xl mx-auto min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <header className="border-b border-gray-100 dark:border-gray-800">
          <div className="pt-8 md:pt-16 pb-6 md:pb-8 flex justify-between items-center">
            <Link href="/" legacyBehavior>
              <a className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-white flex items-center hover:opacity-80 transition-opacity cursor-pointer">
                <img
                  src="/kanocs-logo-h52.png"
                  alt="Logo"
                  className="h-8 md:h-10 w-auto mr-3 object-contain"
                />
                <span>
                  <span className="text-primary">KANO</span>
                  <span className="text-secondary">CS</span>
                </span>
              </a>
            </Link>

            <div className="flex items-center gap-3">
              {/* Desktop Menu */}
              <nav className="hidden md:block">
                <Navbar>
                  {!session && [
                    { label: 'Home', href: '/' },
                    { label: 'Tweets', href: '/tweets' },
                    { label: 'Articles', href: '/articles' },
                    { label: 'Insights', href: '/insights' },
                    { label: 'Patches', href: '/patches' },
                  ].map((item) => {
                    const active = item.href === '/' 
                      ? router.pathname === '/' 
                      : router.pathname.startsWith(item.href);
                    
                    return (
                      <li key={item.href} className="ml-6">
                        <Link href={item.href} legacyBehavior>
                          <a className={`transition-all duration-200 text-xl ${
                            active 
                              ? 'text-primary active' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                          }`}>
                            {item.label}
                          </a>
                        </Link>
                      </li>
                    );
                  })}

                  {session ? (
                    <li className="ml-6 relative" ref={accountDropdownRef}>
                      <div
                        onClick={() =>
                          setAccountDropdownOpen(!accountDropdownOpen)
                        }
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all select-none"
                      >
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-bold uppercase overflow-hidden">
                          {session.user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {session.user.name?.split(' ')[0]}
                        </span>
                        <svg
                          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                            accountDropdownOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {accountDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                          {/* User Info Section */}
                          <div className="px-4 py-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">
                              Signed in as
                            </p>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                              {session.user.name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {session.user.email}
                            </p>
                          </div>

                          {/* Management Section */}
                          <div className="py-2">
                            <Link href="/editor" legacyBehavior>
                              <a className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </div>
                                <span className="font-semibold text-xs tracking-tight uppercase">
                                  Editor
                                </span>
                              </a>
                            </Link>

                            <Link href="/dashboard" legacyBehavior>
                              <a className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors group">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                  </svg>
                                </div>
                                <span className="font-semibold text-xs tracking-tight uppercase">
                                  Dashboard
                                </span>
                              </a>
                            </Link>
                          </div>

                          {/* Logout Section */}
                          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 pb-2">
                            <button
                              onClick={() =>
                                signOut().then(() => router.push('/auth/login'))
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                              </div>
                              <span className="font-bold text-xs tracking-tight uppercase">
                                Logout
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ) : null}
                </Navbar>
              </nav>

              <div className="flex items-center gap-1 md:gap-2">
                <ThemeToggle />
                <Search />
                {/* Hamburger Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`${session ? 'block' : 'md:hidden'} p-2 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                  aria-label="Toggle Menu"
                >
                  {isMenuOpen ? (
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className={`py-4 border-t border-gray-50 dark:border-gray-800/50 bg-white dark:bg-slate-950 animate-in fade-in slide-in-from-top-4 duration-200 ${session ? '' : 'md:hidden'}`}>
              <ul className="flex flex-col space-y-4 px-2">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Tweets', href: '/tweets' },
                  { label: 'Articles', href: '/articles' },
                  { label: 'Insights', href: '/insights' },
                  { label: 'Patches', href: '/patches' },
                ].map((item) => {
                  const active = item.href === '/' 
                    ? router.pathname === '/' 
                    : router.pathname.startsWith(item.href);
                    
                  return (
                    <li key={item.href}>
                      <Link href={item.href} legacyBehavior>
                        <a className={`block py-2 text-base font-bold transition-colors ${
                          active ? 'text-primary' : 'text-gray-900 dark:text-gray-100 hover:text-primary'
                        }`} onClick={() => setIsMenuOpen(false)}>
                          {item.label}
                        </a>
                      </Link>
                    </li>
                  );
                })}
                {session && (
                  <>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                    <li>
                      <Link href="/editor" legacyBehavior>
                        <a className="flex items-center gap-3 py-2 text-base font-bold text-emerald-600" onClick={() => setIsMenuOpen(false)}>
                          Editor
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" legacyBehavior>
                        <a className="flex items-center gap-3 py-2 text-base font-bold text-blue-600" onClick={() => setIsMenuOpen(false)}>
                          Dashboard
                        </a>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut().then(() => router.push('/auth/login'));
                        }}
                        className="flex items-center gap-3 py-2 text-base font-bold text-red-600 w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </header>

        <main className="text-xl py-5 flex-grow">{props.children}</main>

        <div className="border-t border-gray-100 dark:border-gray-800 text-left py-8 text-sm text-gray-400 flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="font-bold text-gray-700 dark:text-gray-300">© Copyright {new Date().getFullYear()} {AppConfig.title}</div>
            <div className="hidden md:block h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
            <div className="text-[11px] md:text-xs leading-relaxed max-w-md font-bold text-gray-700 dark:text-gray-300">
              Disclaimer: The information provided is for informational purposes only and does not constitute financial advice.
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/articles/privacy" legacyBehavior>
              <a className="hover:text-primary transition-colors">Privacy</a>
            </Link>
            <Link href="/articles/terms" legacyBehavior>
              <a className="hover:text-primary transition-colors">Terms</a>
            </Link>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export { Main };
