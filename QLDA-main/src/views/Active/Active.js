import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiMain from '../../api/apiMain'
import Layout from '../../components/Layout/Layout'
import LoadingData from '../../components/LoadingData/LoadingData'

function Active(props) {
    const { token } = useParams()
    const [loadingData, setLoadingData] = useState(true)
    const [msg, setMsg] = useState("")
    const [count, setCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const active = async () => {
            const params = {
                key: token
            }
            apiMain.activeAccount(params).then(res => {
                setLoadingData(false)
                setMsg("Kích hoạt thành công")
                setCount(5);
            })
                .catch(err => {
                    setMsg("Kích hoạt không thành công")
                })
        }
        active();
    }, [token])

    useEffect(() => {
        const countDown = async () => {//hàm xử lý đếm ngược 5s sau khi kích hoạt xong
            if (loadingData)
                return
            setTimeout(() => {
                if (count > 0) {
                    setCount(pre => pre - 1)
                    console.log(count)
                }
                else {
                    navigate("/")
                }
            }, 1000)
        }
        countDown();
    }, [count])

    return (
        <Layout >
            <div className="main-content">
                {loadingData ?
                    <>
                        <LoadingData />
                        <div className='d-flex mt-2'><h4>Đang kích hoạt tài khoản</h4></div>
                    </>
                    :
                    <>
                        <div className='d-flex mt-2'><h4>{msg}</h4></div>
                        <span>Sẽ chuyển đến trang chủ trong {count} giây</span>
                    </>
                }
            </div>
        </Layout>
    )
}

export default Active