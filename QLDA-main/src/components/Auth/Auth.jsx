import Loading from '../Loading/Loading'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import apiMain from '../../api/apiMain';
import { handleLogin } from '../../handle/handleAuth';
import { clearMessageLogin, setLoading } from '../../redux/messageSlice';
import { toast } from 'react-toastify';
import Register from './Register';
import './Auth.scss'
import './Login.scss'

function Auth(props) { //component đăng nhập và đăng ký
  const [login, setLogin] = useState(props.choose)

  const [isforgetPasswordForm, setIsforgetPasswordForm] = useState(false)
  const [isActiveForm, setIsActiveForm] = useState(false)


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLogin(props.choose);
    dispatch(setLoading(false))
  }, []);

  const handleChooseLogin = () => {
    setLogin(true)
  }
  const handleChooseRegister = useCallback(() => {
    setLogin(false)
  })

  const onClickForgetpw = useCallback(() => {
    setIsforgetPasswordForm(true)
  })

  const onClickActive = useCallback(() => {
    setIsActiveForm(true)
  })

  return (

    <div className='auth-wrap'>
      {
        isforgetPasswordForm ? <ForgetPassword />
          : isActiveForm ? <ReActive /> :
            <div>
              <div className="auth-header">
                <ul>
                  <li><a onClick={handleChooseLogin}>Đăng nhập</a></li>
                  <li><a onClick={handleChooseRegister}>Đăng ký</a></li>
                </ul>
              </div>
              <div className="auth-body">
                {
                  login ? <Login dispatch={dispatch} navigate={navigate} onClickActive={onClickActive} handleChooseRegister={handleChooseRegister} onClickForgetpw={onClickForgetpw} />
                    :
                    <Register dispatch={dispatch} navigate={navigate} />
                }
              </div>
            </div>
      }

    </div>
  )
}

const Login = props => {
  const loading = useSelector(state => state.message.loading)

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const msgLogin = useSelector(state => state.message.login?.msg)

  useEffect(() => {
    if (msgLogin)
      props.dispatch(clearMessageLogin())
  }, [])

  const onLogin = async (e) => {//xử lý đăng nhập
    e.preventDefault();
    const user = { username, password };//payload
    await handleLogin(user, props.dispatch, props.navigate);//gọi hàm handle 
  }
  return (
    <div className="form-wrap">
      <form>
        <div className="form-group d-flex">
          <div className='d-flex label-group'>
            <label >Tên đăng nhập</label>
            <a onClick={props.onClickActive}>Kích hoạt tài khoản</a>
          </div>
          <div className="field-wrap">
            <input
              placeholder="Username" required name="username" type="text"
              onChange={(e) => {
                setUsername(e.target.value)
              }} value={username} />
          </div>

        </div>
        <div className="form-group d-flex">
          <div className="label-group d-flex">
            <label>Mật khẩu</label>
            <a onClick={props.onClickForgetpw}>Quên mật khẩu</a>
          </div>
          <div className="field-wrap">
            <input placeholder="Password" required name="password" type='password' value={password}
              onChange={e => {
                setPassword(e.target.value)
              }} />
          </div>
        </div>
        <div className="d-flex">
          <label className='remember-label' htmlFor="remember">
            <span>Ghi nhớ mật khẩu</span>
            <input type="checkbox" id="remember"></input>
            <span className="checkmark"></span>
          </label>
        </div>
        <button className='rounded-2' onClick={onLogin}>{loading ? <Loading /> : ""}Đăng nhập</button>
        <span >{msgLogin || ""}</span>
      </form>
      <span className="register-choose"><label>Bạn chưa có tài khoản. </label><a onClick={props.handleChooseRegister}>Đăng ký ngay?</a></span>
    </div>
  )
}

const ReActive = props => { 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onReActive = async (e) => {//xử lý gọi api gửi mail kích hoạt
    e.preventDefault()
    setLoading(true)
    const data = { email }
    apiMain.reActive(data)
      .then(response => {
        toast.success("Đã gửi đường dẫn kích hoạt vào email. Vui lòng kiểm tra", { autoClose: 1200, pauseOnHover: false, hideProgressBar: true });
      })
      .catch(err => {
        toast.error(err.response.data.details.message, { autoClose: 1200, pauseOnHover: false, hideProgressBar: true });
      })
      .finally(() => { setLoading(false) })

  }
  return (
    <div className="form-wrap">
      <form>
        <div className="form-group d-flex">
          <div className='d-flex label-group'>
            <label >Email</label>
          </div>
          <div className="field-wrap">
            <input
              placeholder="Email" required name="emailActive" type="text"
              onChange={onChangeEmail
              } value={email} />
          </div>
        </div>
        <button className='rounded-2' onClick={onReActive}>{loading ? <Loading /> : ''}Gửi đường dẫn kích hoạt</button>
      </form>
    </div>
  )
}

const ForgetPassword = props => { ///Quên mật khẩu
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const onForgetPassword = async (e) => { //xử lý gọi API gửi mail quên mật khẩu
    e.preventDefault()
    setLoading(true)
    apiMain.forgetPassword({ email: email })
      .then(res => {
        toast.success("Đã gửi mật khẩu mới vào email");
      })
      .catch(err => {
        toast.error(err?.response?.data?.details?.message);
      })
      .finally(() => { setLoading(false) })

  }
  return (
    <div className="form-wrap">
      <form>
        <div className="form-group d-flex">
          <div className='d-flex label-group'>
            <label>Email</label>
          </div>
          <div className="field-wrap">
            <input
              placeholder="Email" required name="emailActive" type="text"
              onChange={onChangeEmail
              } value={email} />
          </div>
        </div>
        <button className='rounded-2' onClick={onForgetPassword}>{loading ? <Loading /> : ''} Gửi mật khẩu</button>
      </form>
    </div>
  )
}


export default Auth