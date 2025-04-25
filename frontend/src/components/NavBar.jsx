import {Link, useLocation} from 'react-router-dom';
import "./NavBar.css"
import React, { useState, useRef, useEffect } from 'react';

function Nav() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className='nav'>
            <Footer activeTab={currentPath} />
        </div>
    );
}

function Footer({ activeTab }) {
    return (
        <footer>
            <nav className='navbar'>
                <Link
                    to="/home"
                    className={activeTab === '/home' ? 'active' : ''}
                >
                    <div className='nav-item'>
                        <span>Home</span>
                    </div>
                </Link>
                <Link
                    to="/climbs"
                    className={activeTab === '/climbs' ? 'active' : ''}
                >
                    <div className='nav-item'>
                        <span>Climbs</span>
                    </div>
                </Link>
               
                
                <Link
                    to={`/profile/${localStorage.getItem('username')}`}
                    className={activeTab === `/profile/${localStorage.getItem('username')}` ? 'active' : ''}
                >
                    <div className='nav-item'>
                        <span>Profile</span>
                    </div>
                </Link>
            </nav>
        </footer>
    );
}

export default Nav