import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categories = [
    { label: 'Home', path: '/', end: true },
    { label: 'Sports', path: '/sports' },
    { label: 'Technology', path: '/technology' },
    { label: 'Health', path: '/health' },
    { label: 'Science', path: '/science' },
    { label: 'Business', path: '/business' },
    { label: 'Entertainment', path: '/entertainment' },
  ];

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary site-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={() => setIsExpanded(false)}>VoxNow</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${isExpanded ? ' show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {categories.map(({ label, path, end }) => (
              <li className="nav-item" key={path}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to={path}
                  end={end}
                  onClick={() => setIsExpanded(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar