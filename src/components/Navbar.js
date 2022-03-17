import * as React from 'react'
import Identicon from 'identicon.js'
// Local
import Logo from './Logo'

const Navbar = ({ account }) => {
  const icon = account ? new Identicon(account, 30).toString() : null
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Logo /> Handbook
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-secondary">
            <small id="account">{account}</small>
          </small>
          {account && (
            <img
              className="ml-2"
              width="30"
              height="30"
              src={`data:image/png;base64,${icon}`}
              alt="User icon"
            />
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
