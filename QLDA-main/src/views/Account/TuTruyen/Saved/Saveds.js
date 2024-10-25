import  { useEffect, useState } from 'react'
import apiMain from '../../../../api/apiMain'
import { loginSuccess } from '../../../../redux/authSlice'
import Saved from '../../../../components/Saved/Saved'
const Saveds = ({ dispatch,user }) => {
    const [readings, setReadings] = useState([])
    useEffect(()=>{
      const LoadReading = async () => {
        if (user) {
          apiMain.getSaveds(user, dispatch, loginSuccess)
            .then(res => {
              console.log(res)
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
          readings.map((item, i) => <div key={item.url} >
            <Saved data={{
              tentruyen: item.tentruyen,
              hinhanh: item.hinhanh,
              tacgia: item.tacgia,
              url: item.url
            }} />
              <hr /></div>)
          
        }</div>)
  }
  export default Saveds