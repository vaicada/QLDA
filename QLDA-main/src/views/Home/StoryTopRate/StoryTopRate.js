import { useEffect, useState } from 'react'
import apiMain from '../../../api/apiMain';
import Reading from '../../../components/Reading/Reading';
import Section, { SectionHeading, SectionBody } from '../../../components/Section/Section';
import StoryRate from '../../../components/Story/StoryRate';
import getData from '../../../api/getData';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'



function StoryTopRate() {

  const [datas, setData] = useState(Array.from(Array(6).keys(), i=>{return {}}));

  useEffect(() => {
    const getStory = async () => {//xử lý gọi hàm load truyện
      let res = getData(await apiMain.getStorys({ size: 6 }));
      res = res.map(item=>{
        item = {...item,danhgia:'5.00',soluongdanhgia:10}
        return item
    })
      setData(res);
    }
    getStory();
  }, [])
  return (
    <>
      <div className='row'>
          <div className="col-12">

          <Section>
            <SectionHeading>
              <h4 className='section__title'>Đánh giá cao</h4>
              <Link to='tat-ca'>Xem tất cả</Link>
            </SectionHeading>
            <SectionBody>
              <div className='row' style={{marginTop:-24}}>
                {datas.map((data, index) => <div key={index} className='col-4 col-md-6 col-sm-12'><StoryRate  data={data} /></div>)}
              </div>
            </SectionBody>
          </Section>
          </div>

        </div>
    </>

  )
}

export default StoryTopRate