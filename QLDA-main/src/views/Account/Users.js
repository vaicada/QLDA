import Modal,{ModalContent} from '../../components/Modal/Modal'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import apiMain from '../../api/apiMain'
import { loginSuccess } from '../../redux/authSlice'
import { toast } from 'react-toastify'

function Users(props) {
  const user = useSelector(state => state.auth.login?.user)
  const [listUser, setListUser] = useState([])
  const [choose, setChoose]=useState(null)
  const [roles,setRoles]=useState([])
  const [username,setUsername] = useState("")
  const [modalRole,setModalRole]=useState(false)
  const dispatch = useDispatch()

  const onClickRole =(e)=>{
    const role = document.getElementById(`roles-${e.target.name}`).innerText
    setModalRole(true)
    setRoles(role.length===0?[]:role.split(', '))
  }
  const onClickShow = (e)=>{
    if(choose===e.target.id){
      setChoose(null)
      setUsername(null)
    }
    else{
      setChoose(e.target.id)
      setUsername(e.target.id)
    }
  }

  const onClickDelete =async(e)=>{
    if(username){
      console.log(username)
      apiMain.deleteAccount(user,dispatch,loginSuccess,{username})
      .then(res=>{
        toast.success("Xoá thành công")
      })
      .catch(err=>{
        console.log(err)
        toast.error("Xoá thất bại")
      })
    }
  }

  const onClickActive=async(e)=>{
    if(username){
      apiMain.activeByAdmin(user,dispatch,loginSuccess,{username})
      .then(res=>{
        const newList = listUser.map(item =>{return item.username===res?.username?res:item})
        setListUser(newList)
        toast.success("Kích hoạt thành công")
      })
      .catch(err=>{
        toast.error("Kích hoạt thất bại")
      })
    }
  }

  const onClickInActive=async(e)=>{
    if(username){
      apiMain.inactiveByAdmin(user,dispatch,loginSuccess,{username})
      .then(res=>{
        const newList = listUser.map(item =>{return item.username===res?.username?res:item})
        setListUser(newList)
        toast.success("Khoá thành công")
      })
      .catch(err=>{
        toast.error("Khoá thất bại")
      })
    }
  }

  const closeModalRole = useCallback(()=>{
    setModalRole(false)
  })
  const hideMenu =(e)=>{
    setChoose(null)
  }

  useEffect(() => {
    const loadUsers = async()=>{
      apiMain.getAllUser(user, props.dispatch, loginSuccess)
      .then(res=>{
        setListUser(res)
      })
      .catch(err=>{
        console.log(err)
      })
    }
    loadUsers();   
  }, [])

  return (
    <>
      <h1>All Users</h1>

      <table className='user-table' style={{ "width": "90%" }}>
        <thead>
        <tr>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Trạng thái</th>
          <th>Quyền hạn</th>
          <th>Thao tác</th>
        </tr></thead>
        <tbody>
          {
            listUser.map((item, index) => {
              return <>
                {
                  item.username!==user.username
                  ?
                <tr key={item.username}>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td key={item.active}>{item.active ? "Đã kích hoạt" : "Chưa kích hoạt"}</td>
                  <td id={`roles-${item.username}`}>{item.roles?.map(e=>e.name).join(', ') || ""}</td>
                  <td tabIndex={index} onBlur={hideMenu}>
                    <div  className='d-flex user__item' >
                      <a className='ma' id={item.username}  onClick={onClickShow} >
                        <i id={item.username} name={item.username}  className="ma fs-20 bx bx-dots-horizontal-rounded"></i>
                        </a>
                    </div>
                    <div className={`user__menu ${choose===item.username?'active':''}`}>
                      <ul>
                        <li><a key={item.active} name={item.username} onClick={item.active?onClickInActive:onClickActive}>
                          {item.active?'Khoá tài khoản':'Kích hoạt'}</a></li>
                        <li><a name={item.username} onClick={onClickRole}>Cấp quyền</a></li>
                        <li><a name={item.username} onClick={onClickDelete}>Xoá</a></li>
                      </ul>
                    </div>
                  
                  </td>
                </tr>
                :<></>
                }
              </>
            })
          }
        </tbody>
      </table>
      {modalRole&&<Modal active={modalRole}>
          <ModalContent onClose={closeModalRole}>
                <ChooseRoles roles={roles} username={username}/>
          </ModalContent>
      </Modal>}

    </>

  )
}

const roleBase = [
  'ADMIN','USER'
]
const ChooseRoles = (props)=>{
  const user = useSelector(state=>state.auth.login?.user)
  const [roles,setRoles]=useState(props.roles)
  const dispatch = useDispatch();
  
  const  onClickUpdateRole =async(e)=>{
    e.preventDefault();
    const params = {roles,username:props.username}
    if(user)
    apiMain.updateRole(user,dispatch,loginSuccess,params)
      .then(res => {
        toast.success("Cập nhật quyền thành công")
      })
      .catch(err=>{
        let _=err.response?.message
        toast.error(_)
      })


  }

  const onClickChooseRole=(e)=>{
    
    if(e.target.name){
      let role=e.target.name
      
      if(roles.includes(role)){
        let newRoles = roles.filter((item)=>{
          return item !==role
        })
        if(newRoles.length===0){
          toast.warning("Phải chọn ít nhất một quyền")
          return
        }
        setRoles(newRoles)
      }
      else{
         setRoles([...roles,role])
      }
    }
  }
  return(
    <div>
      <form className='choose-roles' action="">
        <h3 style={{"textAlign":"center"}}>Chọn quyền</h3>
        {roleBase.map(item=>{
          return (
              <label key={item} htmlFor={item} onClick={onClickChooseRole} name={item} className='remember-label'>
                {item}
                <input name={item} readOnly type={'checkbox'} checked={roles.includes(item)} id={item}></input>
                <span className='checkmark'></span>
              </label>
   
          )
        })}
        <button onClick={onClickUpdateRole}>Cấp quyền</button>
      </form>
    </div>
  )
}
export default Users