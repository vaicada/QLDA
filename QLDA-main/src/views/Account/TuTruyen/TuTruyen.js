
import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import apiMain from '../../../api/apiMain'
import { loginSuccess } from '../../../redux/authSlice'
import Reading from '../../../components/Reading/Reading'
import StoryCreated from './Story/StoryCreated'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import Saveds from './Saved/Saveds'
const nav = [
  {
    path: 'reading',
    display: 'Đang đọc'
  },
  {
    path: 'saved',
    display: 'Đánh dấu'
  },
  {
    path: 'created',
    display: 'Đã đăng'
  },
]
function TuTruyen({ userInfo }) {
 
  const user = useSelector(state => state.auth.login.user)
  const dispatch = useDispatch()
  const location = useLocation()
  const active = nav.findIndex(e => e.path === location.pathname.split('/').pop())
  
  return (
    <>
      <div className='navigate'>
        {
          nav.map((item, index) => {
            return <Link key={item.path} to={item.path} className={`navigate__tab fs-18 fw-6 ${active === index ? 'tab_active' : ''}`}
              name={item.path}
            >{item.display}</Link>
          })
        }
      </div>
      <Routes>
        <Route key={'reading'} path='reading' element={<Readings key={'reading'} dispatch={dispatch} user={user} />} />
        <Route key={'saved'} path='saved' element={<Saveds key={'saved'}  dispatch={dispatch} user={user} />} />
        <Route key={'created'} path='created' element={<StoryCreated key={'created'} userInfo={userInfo} />} />
      </Routes>


    </>
  )
}
const Readings = ({ dispatch,user }) => {
  const [readings, setReadings] = useState([])
  useEffect(()=>{
    const LoadReading = async () => {
      if (user) {
        apiMain.getReadings(user, dispatch, loginSuccess)
          .then(res => {
            setReadings(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
    LoadReading()
  }, [user,dispatch])

  return (
    <div>
      {
        readings.map((item, i) => <div key={i} >
          <Reading  data={{
            tentruyen: item.tentruyen,
            hinhanh: item.hinhanh,
            dadoc: item.chapnumber,
            total: item.sochap,
            url: item.url
          }} />
            <hr /></div>)
        
      }</div>)
}



export default TuTruyen