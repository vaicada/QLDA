import React, { useEffect, useState } from 'react'
import apiMain from '../../../../api/apiMain'
import { loginSuccess } from '../../../../redux/authSlice'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify'
import getData from '../../../../api/getData'

const AddChapter = ({ url, chapnumber, user, dispatch, onClickBackFromAddChap, getChapters }) => {
  const [content, setContent] = useState("")
  const [tenchuong, setTenchuong] = useState("")
  const [edit, setEdit] = useState(false)
  const onChangeTenchuong = (e) => {
    setTenchuong(e.target.value)
  }

  useEffect(() => {
    const GetChapter = async () => {
      if (chapnumber) {
        apiMain.getChapterByNumber(url, chapnumber)
          .then(res => {
            setContent(res.content)
            setTenchuong(res.tenchap)
            setEdit(true)
          })
      }
    }
    GetChapter()
  }, [url, chapnumber])

  const onClickAddChapter = async (e) => {
    const params = { content, tenchap: tenchuong, url }
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    apiMain.createChapter(params, user, dispatch, loginSuccess)
      .then(res => {
        getChapters()
        toast.success("Thêm chương thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }

  const onClickEditChapter = async (e) => {
    const params = { content, tenchap: tenchuong, url, chapnumber }
    if (content.length <= 10) {
      toast.warning("Nội dung chương phải dài hơn 10 kí tự");
      return
    }
    apiMain.updateChapter(params, user, dispatch, loginSuccess)
      .then(res => {
        getChapters()
        toast.success("Sửa truyện thành công")
      })
      .catch(err => { toast.error(getData(err.response)?.details.message) })
  }
  const labelStyle = { 'minWidth': '100px', 'margin': '5px 0px', 'display': 'inline-block' }
  return (<>
    <div>
      <span className='text-with-icon' onClick={onClickBackFromAddChap}><i className="fa-solid fa-angle-left"></i> Danh sách chương</span>
    </div>
    <div className="group-info" style={{ 'marginBottom': '10px' }}>
      <label htmlFor="" className='fs-16' style={labelStyle}>Tên chương</label>
      <input onChange={onChangeTenchuong} value={tenchuong || ""} />
    </div>
    <label htmlFor="" className='fs-16' style={labelStyle}>Nội dung chương</label>
    <CKEditor
      editor={ClassicEditor}
      data={content || ''}
      onReady={editor => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        setContent(editor.getData())
      }}
      onBlur={(event, editor) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        console.log('Focus.', editor);
      }}
    />
    <div className='d-flex'>
      {
        edit ? <button className='btn-primary' onClick={onClickEditChapter} style={{ 'margin': '20px auto' }}>Cập nhật chương</button>
          : <button className='btn-primary' onClick={onClickAddChapter} style={{ 'margin': '20px auto' }}>Thêm chương</button>}

    </div>
  </>)
}
export default AddChapter