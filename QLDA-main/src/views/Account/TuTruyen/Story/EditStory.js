import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apiMain from '../../../../api/apiMain'
import { loginSuccess } from '../../../../redux/authSlice'
import { toast } from 'react-toastify'
import avt from '../../../../assets/img/avt.png'
import { storage } from '../../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setLoading } from '../../../../redux/messageSlice'
import Loading from '../../../../components/Loading/Loading';
import LoadingData from '../../../../components/LoadingData/LoadingData'

function EditStory({ url, user, dispatch, onClickBackFromEditNovel }) {
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState(avt)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tacgia, setTacgia] = useState("");
    const [theloai, setTheloai] = useState("");
    const [id, setId] = useState("");
    const loading = useSelector(state => state.message.loading)
    const [loadingStory, setLoadingStory] = useState(true)
    const types = ["Tiên hiệp", "Dã sử", "Kì ảo", "Kiếm hiệp", "Huyền huyễn", "Khoa huyễn"]


    useEffect(() => {
        const LoadStory = async () => {
            if (url) {
                apiMain.getStory({ url })
                    .then(res => {
                        setPreview(res.hinhanh)
                        setName(res.tentruyen)
                        setDescription(res.noidung)
                        setTheloai(res.theloai)
                        setTacgia(res.tacgia)
                        setId(res._id)
                        setLoadingStory(false)
                    })
                    .finally(()=>{setLoadingStory(false)})
            }
        }
        LoadStory()
    }, [url])


    const handleEditStory = async (data) => {
        try {
            apiMain.updateStory(data, user, dispatch, loginSuccess)
                .then(res => {
                    console.log(res)
                    toast.success("Sửa truyện thành công", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false })
                    dispatch(setLoading(false))
                })
                .catch(err => {
                    console.log(err)
                    dispatch(setLoading(false))
                    toast.error(err.response?.details?.message, { autoClose: 1000, hideProgressBar: true, pauseOnHover: false })
                })
        } catch (error) {
            console.log(error)
            toast.error("Lỗi cập nhật thông tin", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false })
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        dispatch(setLoading(true))
        if (image) {

            const url = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i => i !== ' ').join('-').toLowerCase()
            const storageRef = ref(storage, `/images/truyen/${url}`);
            uploadBytes(storageRef, image).then((result) => {
                getDownloadURL(result.ref).then(async (urlImage) => {//lấy liên kết tới ảnh
                    const data = {
                        tentruyen: name,
                        hinhanh: urlImage,
                        noidung:description,
                        tacgia,
                        theloai,
                        url,
                        id,
                    }
                    await handleEditStory(data)
                })
            })
        }
        else if (preview) {
            const data = {
                tentruyen: name,
                hinhanh: preview,
                tacgia,
                theloai,
                url,
                id,
            }
            await handleEditStory(data)
        }
    }

    ///OnChange event
    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeImage = (e) => {
        if (e.target.files.lenght !== 0) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    const labelStyle = { 'minWidth': '100px', 'display': 'inline-block' }
    return (
        <>
            {
                loadingStory ? <LoadingData />
                    :
                    <><span className='text-with-icon' onClick={onClickBackFromEditNovel}><i className='bx bx-left-arrow' ></i> Danh sách truyện</span>
                        <div className="profile__wrap row">
                            <div className="col-5 col-md-12 col-sm-12 profile__avt">

                                <img src={preview} alt="" />
                                <input type={"file"} name={"avatar"} onChange={onChangeImage} />
                            </div>
                            <div className="col-7 col-md-12 col-sm-12 profile__main">
                                    <form>
                                        <div className="group-info">
                                            <label htmlFor="" style={labelStyle}>Tên truyện</label>
                                            <input onChange={onChangeName} value={name || ""} />
                                        </div>
                                        <div className="group-info">
                                            <label htmlFor="" style={labelStyle}>Mô tả</label>
                                            <input onChange={e => { setDescription(e.target.value) }} value={description}></input>
                                        </div>
                                        <div className="group-info">
                                            <label style={labelStyle}>Tác giả</label>
                                            <input required onChange={e => { setTacgia(e.target.value) }} value={tacgia}></input>
                                        </div>
                                        <div className="group-info">
                                            <label for="types">Thể loại</label>
                                            <select style={labelStyle} onChange={e => { console.log(e.target.value); setTheloai(e.target.value) }} value={theloai} id="types" name="types">
                                                {
                                                    types.map(item => { return (<option value={item}>{item}</option>) })
                                                }
                                            </select>
                                        </div>
                                        <div className="d-flex">
                                            <button onClick={handleEdit}>{loading ? <Loading /> : ''} Sửa truyện</button>
                                        </div>
                                    </form>
                                </div>
                        </div></>
            }</>

    )
}

export default EditStory;