"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LangSwitcher from './lang/langSwitcher';
import { ThemeSwitcher } from './themeSwitcher';
import { useMainContext } from '@/providers/mainContext';
import { useTheme } from 'next-themes';
import { openModal } from '@/lib/utils/modalUtils';
import { navItems } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import LogOutButton from './LogOutButton';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const t = useTranslations();
    const { theme } = useTheme();
    const context = useMainContext();

    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (context.changedLanguage) {
            setShouldAnimate(false);
        } else {
            setShouldAnimate(true);
        }

        return () => {
            setShouldAnimate(true);
            context.setChangedLanguage(false);
        };
    }, [context.changedLanguage]);

    const logoVariants = {
        initial: { y: 200, scale: 2 },
        intro: { y: 200, scale: 2 },
        lobby: { y: 0, scale: 1 }
    };

    const navbarVariants = {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="wrapper flex flex-col items-center checkDarkTheme-BG">
            {shouldAnimate ? (
                <>
                    <motion.div
                        className='my-2 z-50'
                        initial="initial"
                        animate={context.sceneState === 'introScene' ? "intro" : "lobby"}
                        variants={logoVariants}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={'/images/logo.png'}
                            alt='logo'
                            width={150}
                            height={50}
                            className="object-contain"
                        />
                    </motion.div>
                    <motion.div
                        className='flex-center w-full px-10 py-2 shadow-lg checkDarkTheme-BG'
                        initial="hidden"
                        animate={context.sceneState === 'introScene' ? "hidden" : "visible"}
                        variants={navbarVariants}
                        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.3, bounce: 0.5 }}
                    >
                        <div className="flex justify-between items-center w-full">
                            <nav className="hidden md:flex">
                                <ul className='flex gap-4 checkDarkTheme-Text'>
                                    {navItems.slice(0, 2).map((item, index) => (
                                        <li key={index} onClick={() => openModal(context, item.modalId)} className='flex gap-2 items-center cursor-pointer'>
                                            {theme === 'dark' ? item.iconDark : item.iconLight}
                                            {t(item.label)}
                                            {index < navItems.length - 1 && (<span className='opacity-25 mx-auto ml-2'> | </span>)}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="flex items-center gap-2">
                                <div className="flex md:hidden">
                                    <button onClick={toggleMenu}>
                                        {menuOpen ? <X /> : <Menu />}
                                    </button>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <LangSwitcher />
                                    <ThemeSwitcher />
                                    <LogOutButton />
                                </div>
                            </div>
                        </div>
                        {menuOpen && (
                            <div className="md:hidden fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex flex-col items-center pt-20 z-50">
                                <button onClick={toggleMenu} className="absolute top-5 right-5">
                                    <X className="text-white" />
                                </button>
                                <ul className='flex flex-col gap-4 checkDarkTheme-Text'>
                                    {navItems.slice(0, 2).map((item, index) => (
                                        <li key={index} onClick={() => { openModal(context, item.modalId); toggleMenu(); }} className='flex gap-2 items-center cursor-pointer text-white'>
                                            {theme === 'dark' ? item.iconDark : item.iconLight}
                                            {t(item.label)}
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex flex-col items-center gap-2 mt-4'>
                                    <LangSwitcher />
                                    <ThemeSwitcher />
                                    <LogOutButton />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            ) : (
                <>
                    <div className='my-2 z-50'>
                        <Image
                            src={'/images/logo.png'}
                            alt='logo'
                            width={150}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                    <div className='flex-center w-full px-10 py-2 shadow-lg checkDarkTheme-BG'>
                        <div className="flex justify-between items-center w-full">
                            <nav className="hidden md:flex">
                                <ul className='flex gap-4 checkDarkTheme-Text'>
                                    {navItems.slice(0, 2).map((item, index) => (
                                        <li key={index} onClick={() => openModal(context, item.modalId)} className='flex gap-2 items-center cursor-pointer'>
                                            {theme === 'dark' ? item.iconDark : item.iconLight}
                                            {t(item.label)}
                                            {index < navItems.length - 1 && (<span className='opacity-25 mx-auto ml-2'> | </span>)}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="flex items-center gap-2">
                                <div className="flex md:hidden">
                                    <button onClick={toggleMenu}>
                                        {menuOpen ? <X /> : <Menu />}
                                    </button>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <LangSwitcher />
                                    <ThemeSwitcher />
                                    <LogOutButton />
                                </div>
                            </div>
                        </div>
                        {menuOpen && (
                            <div className="md:hidden fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex flex-col items-center pt-20 z-50">
                                <button onClick={toggleMenu} className="absolute top-5 right-5">
                                    <X className="text-white" />
                                </button>
                                <ul className='flex flex-col gap-4 checkDarkTheme-Text'>
                                    {navItems.slice(0, 2).map((item, index) => (
                                        <li key={index} onClick={() => { openModal(context, item.modalId); toggleMenu(); }} className='flex gap-2 items-center cursor-pointer text-white'>
                                            {theme === 'dark' ? item.iconDark : item.iconLight}
                                            {t(item.label)}
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex flex-col items-center gap-2 mt-4'>
                                    <LangSwitcher />
                                    <ThemeSwitcher />
                                    <LogOutButton />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </header>
    );
}

export default Header;
