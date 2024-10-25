import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import './StoryDetail.scss'
import { useParams, Link } from 'react-router-dom'
import apiMain from '../../api/apiMain'
import LoadingData from '../../components/LoadingData/LoadingData'
import Grid from '../../components/Grid/Grid'
import Comment from '../../components/Comment/Comment'
import Pagination from '../../components/Pagination/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading/Loading'
import Modal, { ModalContent } from '../../components/Modal/Modal'

const nav = [//navigate
  {
    path: 'about',
    display: 'Giới thiệu',
    mobile:'show'
  },
  {
    path: 'rate',
    display: 'Đánh giá',
    mobile:'show'
  },
  {
    path: 'chapter',
    display: 'Ds Chương',
    mobile:'hide'
  },
  {
    path: 'comment',
    display: 'Bình luận',
    mobile:'show'
  },
  {
    path: 'donate',
    display: 'Hâm mộ',
    mobile:'hide'
  }
]

function StoryDetail() {
  const { url } = useParams()
  const [truyen, setTruyen] = useState(null);
  const catGiu = 100
  const [main, setMain] = useState(null)
  const [tab, setTab] = useState('')
  const active = nav.findIndex(e => e.path === tab)
  const [loadingData, setLoadingData] = useState(true)
  const [handling, setHandling] = useState(false)
  const [saved, setSaved] = useState(false)
  const [listchapter, setListchapter] = useState(false)
  const user = useSelector(state => state.auth.login?.user)
  const dispatch = useDispatch();
  useEffect(() => {//load truyện
    const getStory = async () => {
      let params = { url }
      apiMain.getStory(params).then(res => {
        setTruyen(res)
        setTab('about')//set tab mặc định là About
        setLoadingData(false)
      })
    }
    getStory()
  }, [url])

  useEffect(() => {//xử lý đổi tab
    switch (tab) {
      case 'about':
        setMain(<About key={'about'} truyen={truyen} />)
        break
      case 'rate':
        setMain(<Rate key={'rate'} />)
        break
      case 'chapter':
        setMain(<ListChapter key={'chapter'} url={truyen.url} totalPage={truyen.sochap} />)
        break
      case 'comment':
        setMain(<Comment key={'comment'} url={truyen.url} />)
        break
      default:
        setMain(<Donate key={'donate'} />)
    }
    return () => { }
  }, [tab, truyen])


  useEffect(() => {
    const checkSaved = async () => {
      if (user) {
        setHandling(true)
        apiMain.checkSaved(user, dispatch, loginSuccess, { url })
          .then(res => {
            setSaved(res.saved || false)
          })
          .finally(() => { setHandling(false) })
      }
    }
    checkSaved();
  }, [user, url, dispatch])

  const onClickTab = async (e) => {
    setTab(e.target.getAttribute("data"))
  }

  const onClickSaved = async (e) => {
    if (user) {
      setHandling(true)
      apiMain.savedStory(user, dispatch, loginSuccess, { url })
        .then(res => {
          setSaved(true)
        })
        .finally(() => { setHandling(false) })
    } else {
      toast.warning("Vui lòng đăng nhập để lưu truyện")
    }
  }

  const onClickUnsaved = async (e) => {
    if (user) {
      setHandling(true)
      try {
        const response = await apiMain.unsavedStory(user, dispatch, loginSuccess, { url })
        if (response) {
          setSaved(false)
        }
      }
      finally { setHandling(false) }

    } else {
      toast.warning("Vui lòng đăng nhập để lưu truyện")
    }
  }

  const onClickShowListChapter = () => {
    setListchapter(true)
  }
  const onCloseModalListChapter = () => {
    setListchapter(false)
  }
  //style
  const liClass = "border-primary rounded-2 color-primary"
  return (
    <Layout >
      <div className="main-content">
        {loadingData ? <LoadingData />
          :
          <>
            <div className="heroSide row">
              <div className='heroSide__img'>
                <div className="img-wrap">
                  <img src={truyen?.hinhanh} alt="" />
                </div>
              </div>

              <div className="heroSide__main">
                <div className="heroSide__main__title">
                  <h2 >{truyen?.tentruyen}</h2>
                </div>
                <ul className='heroSide__main__info row'>
                  <li className={liClass}>{truyen?.tacgia}</li>
                  <li className={liClass}>{truyen?.trangthai}</li>
                  <li className={liClass}>{truyen?.theloai}</li>
                </ul>
                <ul className="heroSide__main__statistic row">
                  <li>
                    <span className='fs-16 bold'>{truyen?.sochap || '0'}</span>
                    <span>Chương</span>
                  </li>
                  <li>
                    <span className='fs-16 bold'>{truyen?.luotdoc || '0'}</span>
                    <span>Lượt đọc</span>
                  </li>

                  <li>
                    <span className='fs-16 bold'>{catGiu || '0'}</span>
                    <span>Cất giữ</span>
                  </li>

                </ul>

                <div className="heroSide__main__rate">
                  <div className="heroSide__main__rate-wrap fs-16 d-flex">
                    <span className={`bx ${truyen?.danhgia >= 1 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.danhgia >= 2 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.danhgia >= 3 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.danhgia >= 4 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span className={`bx ${truyen?.danhgia >= 5 ? 'bxs-star' : 'bx-star'}`}></span>
                    <span>&nbsp;{truyen?.danhgia}/5   ({truyen?.soluongdanhgia} đánh giá)</span>
                  </div>

                </div>
                <div className='heroSide__main__handle row' style={{ gap: '15px' }}>
                  <Link to={`/truyen/${url}/${1}`}><button className='btn-primary'><i className='bx bx-glasses'></i>Đọc truyện</button></Link>
                  {
                    saved ?
                      <button onClick={onClickUnsaved} className='btn-outline'>
                        {
                          handling ? <Loading /> : <><i className='bx bx-check' ></i> Đã lưu</>
                        }
                      </button>
                      :
                      <button onClick={onClickSaved} className='btn-outline'>
                        {
                          handling ? <Loading /> : <><i className='bx bx-bookmark' ></i> Đánh dấu</>
                        }</button>
                  }
                  <button className='btn-outline'><i className='bx bx-donate-heart'></i>Đề cử</button>
                </div>

              </div>
            </div>
            <div className='listchapter fs-16' style={{ margin: '15px 0px' }}>
              <div onClick={onClickShowListChapter} className='row' style={{ alignItems: 'center' }}>Danh sách chương<i className='bx bxs-chevron-right'></i></div>
            </div>

            <div className="story-detail">
              <ul className="navigate">
                {
                  nav.map((item, index) => {
                    return (
                      <li 
                       className={`navigate__tab fs-20 bold ${active === index ? 'tab_active' : ''} ${item.mobile==='hide'?'mobileHide':''}`}
                        key={index}
                        data={item.path}
                        onClick={onClickTab}
                      >{item.display}</li>)
                  })
                }
              </ul>
            </div>

            <div className="story-detail__tab__main">
              {main}
            </div>
          </>
        }
      </div>
      {listchapter && <Modal active={listchapter}>
        <ModalContent onClose={onCloseModalListChapter} style={{width:'100%'}}>
          <ListChapter key={'chapter'} url={truyen.url} />
        </ModalContent>
      </Modal>}
    </Layout>

  )
}


const About = props => {
  return (<>
    <p>
      {props.truyen?.noidung}
    </p>
  </>)
}

const Rate = props => {
  return (
    <h1>Đánh giá</h1>
  )
}

export const ListChapter = props => {
  const [chapters, setChapters] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const size = 20;
  const url = props.url
  useEffect(() => {
    const loadList = async () => {//xử lý gọi API danh sách truyện
      const params = {//payload
        page: currentPage - 1,
        size: 20
      }

      apiMain.getNameChapters(props.url, params).then(res => {
        setChapters(res)
        setLoadingData(false)
      })
    }
    loadList()//gọi hàm
  }, [props.url, currentPage])


  return (
    <>
      <h3>Danh sách chương</h3>
      {
        loadingData ? <LoadingData /> :
          <Grid gap={15} col={props.col || 3} smCol={1}>
            
              {
              chapters.map((item, index) => {
                return <Link to={`/truyen/${url}/${item.chapnumber}`}
                  key={index} className='text-overflow-1-lines'
                  style={{ "fontSize": `${props.fontsize || 16}px` }}>{item.tenchap}</Link>
              })
            }
            
            
          </Grid>
      }
      <Pagination totalPage={props.totalPage/size} currentPage={currentPage} handleSetPage={setCurrentPage} />

    </>
  )
}


const Donate = props => {
  return (
    <h1>Hâm mộ</h1>
  )
}
export default StoryDetail