import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import apiMain from '../../api/apiMain'
import getData from '../../api/getData'
import { Link } from 'react-router-dom'
import { loginSuccess } from '../../redux/authSlice'
import "./Chapter.scss"
import { ListChapter } from '../StoryDetail/StoryDetail'
import Skeleton from 'react-loading-skeleton';

function Chapter(props) {
    const { chapnum, url } = useParams()
    const [chapter, setChapter] = useState({})
    const [fontsize, setFontsize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [manual, setManual] = useState("")
    const user = useSelector(state => state.auth.login?.user)
    const dispatch = useDispatch()
    const contentRef = useRef(null)
    const mainContentRef = useRef(null)
    const [styleManual, setStyleManual] = useState(null)
    //let styleManual = {} \
    const [truyen, setTruyen] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {//xử lý dropdown của account
        const hideManual = () => {
            setManual('');
        }

        document.addEventListener("click", hideManual)
        return () => {
            document.removeEventListener("click", hideManual)
        }
    }, [])

    useEffect(() => {
        if (styleManual === null) {
            let tmp = (window.innerWidth - mainContentRef.current?.clientWidth) / 2
            tmp = { right: `${window.innerWidth - Math.round(tmp) - mainContentRef.current?.clientWidth - 95}px` }
            setStyleManual(tmp)
        }
        const changeStyleManual = () => {
            let tmp = (window.innerWidth - mainContentRef.current?.clientWidth) / 2
            tmp = { right: `${window.innerWidth - Math.round(tmp) - mainContentRef.current?.clientWidth - 95}px` }
            setStyleManual(tmp)
        }
        window.addEventListener('resize', changeStyleManual)
        return () => {
            window.removeEventListener('resize', changeStyleManual)
        }
    }, [])


    useEffect(() => {//Xử lý load dữ liệu chương truyện
        const getChapter = async () => {//tạo hàm
            if (user) {
                apiMain.getChapterByNumberAndSetReading(url, chapnum, user, dispatch, loginSuccess)
                    .then(res => {
                        setChapter(getData(res))
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            else{
                apiMain.getChapterByNumber(url, chapnum)
                    .then(res => {
                        setChapter(getData(res))
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
        getChapter()//gọi hàm
        setManual("")
    }, [chapnum])

    useEffect(()=>{
        if(truyen){
            let readings = localStorage.getItem("readings");
            readings = JSON.parse(readings)
            if(Array.isArray(readings)){
                if(Number(chapnum)){
                
                    let index = readings.findIndex(item=>item.url===url)
                    const newReading = {
                        tentruyen:truyen.tentruyen,
                        url,
                        hinhanh:truyen.hinhanh,
                        chapnumber:Number(chapnum),
                        sochap:truyen.sochap
                    }
                    if(index!==-1){
                        readings[index] = newReading
                    }
                    else{
                        readings = [newReading,...readings]
                        readings.pop()
                    }
                
                }
                localStorage.setItem("readings",JSON.stringify(readings))
            }
        }
    },[truyen])

    useEffect(()=>{
        const getStory =async()=>{
            apiMain.getStory({url})
            .then(res=>{
                setTruyen(res)
            })
        } 
        getStory()
        console.log(url)
    },[url])



    useEffect(() => {//xử lý hiển thị nội dung truyện
        contentRef.current.innerHTML = chapter?.content || ""
    }, [chapter])

    const onClickSetting = (e) => {
        e.stopPropagation()
    }

    const onClickToggleManual = () => {
        let list = document.getElementById('chapter-manual__list');
        let icon = document.getElementById('icon-manual');
        if (list) {
            list.classList.toggle('active');
            if (icon.classList.contains('bx-arrow-from-top'))
                icon.classList.replace('bx-arrow-from-top', 'bx-arrow-from-bottom')
            else
                icon.classList.replace('bx-arrow-from-bottom', 'bx-arrow-from-top')
        }
    }

    const onClickNextChap = ()=>{
        navigate(`/truyen/${url}/${Number(chapnum)+1}`)
        setChapter({})
    }
    const onClickPreviousChap = ()=>{
        if(Number(chapnum)>1){
            navigate(`/truyen/${url}/${Number(chapnum)-1}`)
            setChapter({})
        }
    }

    return (<>
        <div className="main" style={{ backgroundColor: "#ced9d9", paddingTop: "30px" }}>
            <div className="container" style={{paddingBottom:"3rem"}}>
                <div ref={mainContentRef} className="main-content--chapter">
                    <div className="d-lex" >
                        <div className="chapter__heading">
                            <button onClick={onClickPreviousChap} className='btn btn-primary'>
                                <i className='bx bx-arrow-back' ></i>Chương trước
                            </button>
                            <button onClick={onClickNextChap} className='btn btn-primary'>
                                Chương sau<i className='bx bx-arrow-back bx-flip-horizontal' ></i>
                            </button>
                        </div>
                        <h1 className='chapter__name'>{chapter?.tenchap}</h1>
                        <ul className='chapter__info'>
                            <li className='text-with-icon'><i className='bx bx-book' ></i>{chapter?.tentruyen || "Tên truyện"}</li>
                            <li className='text-with-icon'><i className='bx bx-edit'></i>{chapter?.nguoidangtruyen || "Người đăng"}</li>
                            <li className='text-with-icon'><i className='bx bx-text'></i>{chapter?.content?.split(" ").length || 0} chữ</li>
                            <li className='text-with-icon'><i className='bx bx-time'></i>{chapter?.createAt || Date()}</li>
                        </ul>
                        <div className={`fs-${fontsize}`} style={{ "lineHeight": `${lineHeight}` }}>
                           
                                <div ref={contentRef} id="chapter__content"> </div>{chapter?.content?"":<Skeleton count={20}/>
                            }
                                
                            
                        </div>

                    </div>
                </div>
                <div className="chapter__nav">
                    <div>
                        <span  className='text-with-icon'>
                            <i className='bx bx-arrow-back' ></i>Chương trước
                        </span>
                    </div>
                    <div>
                        <span className='text-with-icon'>
                            Chương sau<i className='bx bx-arrow-back bx-flip-horizontal' ></i>
                        </span>
                    </div>
                </div>

                <div className='chapter-manual fs-24' style={styleManual}>
                    <span onClick={onClickToggleManual} className='chapter-manual__item chapter-manual__item--dropdown'><i id='icon-manual' className='bx bx-arrow-from-top'></i></span>
                    <ul className='chapter-manual__list' id='chapter-manual__list'>
                        <li className={`chapter-manual__item ${manual === 'list-chap' ? 'active' : ''}`} onClick={(e) => {
                            e.stopPropagation()
                            if (manual === 'list-chap')
                                setManual("")
                            else
                                setManual("list-chap")
                        }}>
                            <span><i className='bx bx-list-ul'></i></span>
                            <div onClick={onClickSetting} className="chapter-manual__popup" >
                                <div className="list-chapter" style={{ width: "700px", "maxHeight": "500px", "overflow": "scroll" }}>
                                    <ListChapter url={url} col={2} fontsize={15} />
                                </div>
                            </div>
                        </li>
                        <li className={`chapter-manual__item ${manual === 'setting' ? 'active' : ''}`} onClick={(e) => {
                            e.stopPropagation()
                            if (manual === "setting")
                                setManual("")
                            else
                                setManual("setting")
                        }}>
                            <span><i className='bx bx-cog'></i></span>
                            <div onClick={onClickSetting} className="chapter-manual__popup">
                                <h4>Cài đặt</h4>
                                <div className="chapter-setting">
                                    <table className='chapter-setting__body fs-18'>
                                        <tbody>
                                            <tr>
                                                <td className='col-4'>
                                                    <div className='chapter-setting__label'>
                                                        <i className='bx bx-font-size'></i>
                                                        Cỡ chữ
                                                    </div>
                                                </td>
                                                <td className='col-8'>
                                                    <div className='d-flex chapter-setting__input'>
                                                        <button onClick={(e) => { e.stopPropagation(); setFontsize(pre => pre - 1) }}><i className='bx bx-minus'></i></button>
                                                        <div>{`${fontsize}px`}</div>
                                                        <button onClick={(e) => { e.stopPropagation(); setFontsize(pre => pre + 1) }}><i className="bx bx-plus"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='col-4'>
                                                    <div className='chapter-setting__label'>
                                                        <i className="fa-solid fa-font"></i>
                                                        Giãn dòng
                                                    </div>
                                                </td>
                                                <td className='col-8'>
                                                    <div className='d-flex chapter-setting__input'>
                                                        <button onClick={() => { setLineHeight(pre => { return Number((pre - 0.1).toFixed(1)) }) }}><i className="bx bx-minus"></i></button>
                                                        <div>{`${lineHeight}`}</div>
                                                        <button onClick={() => { setLineHeight(pre => { return Number((pre + 0.1).toFixed(1)) }) }}><i className="bx bx-plus"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </li>
                        <li className='chapter-manual__item'><span><Link to={`/truyen/${url}`}><i className='bx bx-left-arrow-alt'></i></Link></span></li>
                        <li className='chapter-manual__item'><span><i className='bx bx-info-circle'></i></span> </li>

                    </ul>
                </div>
            </div>
        </div>

    </>)
}

export default Chapter