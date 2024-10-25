import React, { useCallback } from 'react'

import {   useLocation, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess, logoutSuccess } from '../../redux/authSlice';
import { useSelector, useDispatch } from 'react-redux'
import getData from '../../api/getData';
import ChangePassword from './ChangePassword'
import Profile from './Profile';
import TuTruyen from './TuTruyen/TuTruyen';
import { toast } from 'react-toastify';
import CreateNovel from './CreateNovel';
import './Account.scss'
import './Profile.scss'
import Panel from './Panel'
const menu = [//menu dựa trên từng loại tài khoản
    {
      path: "user/profile",
      display: "Hồ sơ",
      icon: "bx bx-user"
    },
    {
      path: "user/change-password",
      display: "Đổi mật khẩu",
      icon: "bx bxs-key"
    },
    {
      path: "user/tu-truyen/reading",
      display: "Tủ truyện",
      icon: "bx bx-library"
    },
    {
      path: "user/dang-truyen",
      display: "Đăng truyện",
      icon: "bx bx-up-arrow-circle"
    },
  ]
function Account() {
  
  
  const [userInfo, setUserInfo] = useState(null)
  const user = useSelector(state => state.auth.login?.user);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const active = menu.findIndex(e => e.path === pathname.split('/')[2]);

  useEffect(() => {
    const getUser = async () => {//xử lý load thông tin user
      try {
        const res = getData(await apiMain.getUserInfo(user, dispatch, loginSuccess));
        setUserInfo(res.userInfo)
      } catch (err) {
        if (err.response.status === 403 || err.response.status === 401) {
          dispatch(logoutSuccess())
        }
        else {
          toast.error("Lỗi thông tin")
        }
      }
    }
    getUser()
  }, [user, dispatch])

  const changeUserInfo = useCallback((data) => {
    setUserInfo(data)
  },[])
  return (
    <Panel menu={menu}>
      <Routes>
        <Route path='profile' element={<Profile userInfo={userInfo} changeUserInfo={changeUserInfo} />}></Route>
        <Route path='change-password' element={<ChangePassword />}></Route>
        <Route path='tu-truyen/*' element={<TuTruyen userInfo={userInfo} />}></Route>
        <Route path='dang-truyen' element={<CreateNovel userInfo={userInfo} />}></Route>
      </Routes>
    </Panel>

  )
}


export default Account