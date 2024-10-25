import  { useEffect, useState } from 'react'
import './Pagination.scss'

function Pagination({ totalPage, currentPage, handleSetPage }) {//Component phân trang
    const [item, setItem] = useState([])
    

    useEffect(() => {//Xử lý hiển thị số trang 
        if (totalPage > 0) {
            let temp;
            if (totalPage < 8) { //Nếu <8 trang thì hiển thị dạng 1 2 3 4 5 6 7 8
                let i = 1 //bắt đầu từ trang 1
                temp = (new Array(totalPage)).fill().map(() => { return i++; }) //tạo array [1,2,3,4,5,6,7,8]
            }
            else {//trường hợp hơn 8 trang
                if (currentPage < 5) { //Nếu trang hiện tại <5 hiển thị dạng 1 2 3 4 5 ... totalPage
                    temp = [1, 2, 3, 4, 5].concat(['...', totalPage]);//
                }
                else if (currentPage > (totalPage - 4)) { //Nếu lớn hơn totalPage - 4 trang, hiển thị dạng 1 ... tp-3,tp-2,tp-1 ,tp
                    let i = totalPage - 5 + 1
                    temp = [1, '...'].concat((new Array(5)).fill().map(() => { return i++; }))
                }
                else { //trường hợp còn lại, ví dụ currentPage = 6 hiển thị dạng 1 ... 5 6 7 ... totalPage
                    temp = [1, '...'].concat([currentPage - 1, currentPage, currentPage + 1]).concat(['...', totalPage])
                }
            }
            setItem(temp)
        }
    }, [currentPage])


    const onClickPage = (e) => {//xử lý đổi trang
        if (Number(e.target.name))
            handleSetPage(Number(e.target.name))
    }

    const onClickPre = (e) => {//xử lý next
        if (currentPage)
            handleSetPage(currentPage - 1 < 1 ? 1 : currentPage - 1)
    }
    const onClickNext = (e) => {//xử lý previous
        if (currentPage)
            handleSetPage(currentPage + 1 > totalPage ? totalPage : currentPage + 1)
    }

    return (
        <div className='d-flex' style={{"margin":"20px auto","justifyContent":"center"}}>
            <button data={item} name={item} onClick={onClickPre} className={`btn-pagination btn-pagination__page `} ><i className='bx bx-chevron-left fs-28'></i></button>
            {
                item.map((item, index) => {
                    return <button data={item} name={item} onClick={onClickPage} className={`btn-pagination ${item !== '...' ? 'btn-pagination__page' : ''} ${currentPage === item ? 'page-active' : ''}`} key={index}>{item}</button>
                })
            }
            <button data={item} name={item} onClick={onClickNext} className={`btn-pagination btn-pagination__page`} ><i className='bx bx-chevron-right fs-28'></i></button>
        </div>
    )
}

Pagination.propTypes = {

}

export default Pagination
