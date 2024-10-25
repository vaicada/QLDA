
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import './ListReading.scss'
function Reading(props) {
  const data = props.data
  return (
    <div className="reading-card">
      <div className="reading-card__img-wrap">
        {data.hinhanh ? <img src={data.hinhanh} alt="" /> : <Skeleton width={32} height={43}/>}
      </div>
      <div className="reading-card__content">
        {
          data.tentruyen?<Link to={`/truyen/${data?.url}`} className="reading-card__title fs-15">
          {data.tentruyen}
        </Link> :<Skeleton />
        }
        
        {
          data.dadoc ?
            <div className="reading-card__chap">
              Đã đọc: {data.dadoc}/{data?.total}
            </div> : <Skeleton />
        }
      </div>
    </div>
  )
}

export default Reading