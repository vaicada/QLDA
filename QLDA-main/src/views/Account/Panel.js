import React from 'react'

import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './Account.scss'
import './Profile.scss'
function Account(props) {
  const { pathname } = useLocation();
  const active = props.menu.findIndex(e => e.path.split('/')[1] === pathname.split('/')[2]);

  return (
    <Layout >
      <div className="main-content">
        <div className="row" style={{padding:'0.5rem'}}>
          <div className="col-3 col-md-4 panel-sidebar">
            <ul className="list-group">
              {
                props.menu.map((item, index) => {
                  return (
                  <li key={index} className={`list-group__item ${index === active ? 'active' : ''}`} >
                    <Link to={`/${item.path}`}><i className={item.icon}></i>{item.display}
                    </Link>
                  </li>)
                })
              }
            </ul>

          </div>
          <div className="col-9 col-md-8 col-sm-12 " style={{ 'minHeight': '500px' }}>
            {props.children}
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default Account