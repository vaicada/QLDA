import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import apiMain from '../../api/apiMain';
import { loginSuccess } from '../../redux/authSlice';
import { useSelector, useDispatch } from 'react-redux'
import avt from '../../assets/img/avt.png'
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { setLoading } from '../../redux/messageSlice'
import Loading from '../../components/Loading/Loading';
import LoadingData from '../../components/LoadingData/LoadingData';

function Profile({userInfo,changeUserInfo}) {
  const user = useSelector(state => state.auth.login?.user);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(userInfo?.image || avt)
  const [name, setName] = useState(userInfo?.tenhienthi || "");
  const [birthDate, setBirthDate] = useState(new Date());
  const loading = useSelector(state => state.message.loading)
  const [loadingUser, setLoadingUser] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadUserInfo = async() => {//load thông tin của user
      if (userInfo) {
        setName(userInfo?.tenhienthi)
        setBirthDate(userInfo?.birthdate?new Date(userInfo?.birthdate):new Date())
        setPreview(userInfo?.image)
        setLoadingUser(false)
      }
    }
    loadUserInfo();
  }, [userInfo])

  const upload = async () => { //upload ảnh lên firebase
    if (image == null)
      return;
    const storageRef = ref(storage, `/images/${userInfo?.username}`);
    uploadBytes(storageRef, image).then((result) => {
      getDownloadURL(result.ref).then(async (url) => {//lấy liên kết tới ảnh
        const data = {
          tenhienthi: name,
          image: url,
          birthdate: birthDate
        }
        await handleSubmitSaveProfile(data)  // xử lý update lại ảnh
      })
    })
  }

  const handleSubmitSaveProfile = async (data) => {//xử lý submit lưu thông tin
    try {
      dispatch(setLoading(true))
      const update = await apiMain.updateUserInfo(user, dispatch, loginSuccess, data)
      dispatch(setLoading(false))
      toast.success("Cập nhật thông tin thành công", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false })
      
      const newUser ={...user, image:update?.userInfo?.image,tenhienthi:update?.userInfo?.tenhienthi}
      console.log(newUser)
      dispatch(loginSuccess(newUser))
      changeUserInfo(update.userInfo)
    } catch (error) {
      console.log(error)
      toast.error("Lỗi cập nhật thông tin", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false })
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    const data = {
      tenhienthi: name,
      image: preview,
      birthdate: birthDate
    }
    await handleSubmitSaveProfile(data)
  }

  ///OnChange event
  const onChangeName = (e) => {
    setName(e.target.value)
  }
  const onChangeBirthDate = (e) => {//xử lý khi thay đổi ngày sinh
    try{
      const date=new Date(e.target.value)
      const regex = new RegExp("([0-9]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))")
      if(regex.test(date.toISOString().substring(0,10))){//nếu ngày hợp lệ
        setBirthDate(date)
      }
      else//nếu ngày không hợp lệ thì mặc định là ngày hôm nay
        setBirthDate(new Date())
    }
    catch(err){
      setBirthDate(new Date())
    }
    
  }

  const onChangeImage = (e) => {//xử lý chọn ảnh
    if (e.target.files.lenght !== 0) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  //style
  const labelStyle = { 'minWidth': '100px', 'display': 'inline-block' }
  return (
    <>
      {
        loadingUser ? <LoadingData />
          :
          <div className="profile__wrap row">
            <div className="col-5 col-md-12 col-sm-12 profile__avt">
              <img src={preview} alt="" />
              <input type={"file"} accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" name={"avatar"} onChange={onChangeImage} />
              <button className='btn-primary' onClick={upload}>Upload</button>
            </div>
            <div className="col-7 col-md-12 col-sm-12 profile__main">
                <form>
                  <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Tên hiển thị</label>
                    <input onChange={onChangeName} value={name || ""} />
                  </div>
                  <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Email</label>
                    {<input readOnly value={userInfo?.email || ""}></input>}
                  </div>
                  <div className="group-info">
                    <label htmlFor="" style={labelStyle}>Ngày sinh</label>
                    <input onChange={onChangeBirthDate} type="date" id="birthday" name="birthday" value={birthDate?.toISOString().substring(0, 10)}></input>
                  </div>
                  <div className="d-flex">
                    <button onClick={handleEdit}>{loading ? <Loading /> : ''} Cập nhật</button>
                  </div>
                </form>

              </div>
          </div>
      }</>

  )
}

export default Profile