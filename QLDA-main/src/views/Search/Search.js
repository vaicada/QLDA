import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apiMain from '../../api/apiMain'
import Story from '../../components/Story/Story'
import Section, { SectionHeading, SectionBody } from '../../components/Section/Section'


function Search(props) {
  const [datas, setDatas] = useState([])
  const query = useSelector(state => state?.message?.query || "")
  useEffect(() => {
    const handleSearch = async () => {//hàm xử lý gọi API search
      if (!query) {//Kiểm tra xem có nhập dữ liệu vào input search không
        setDatas([])
        return
      }
      try {
        const response = await apiMain.getStorysByName({ search: query })
        if (response) {
          setDatas(response)
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleSearch();
  }, [query])
  
  return (
    <>
      <span
        className='imgHero'>
      </span>

      <div className="main">
        <div className="container">
          <div className="main-content">
            <div className='d-flex'>
              <Section>
                <SectionHeading>
                  <h4 className='section-title'>Kết quả</h4>
                </SectionHeading>
                <SectionBody>
                  <div className='list-story'>
                    {datas.map((data, index) => <Story key={index} data={data} />)}
                  </div>
                </SectionBody>
              </Section>

            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default Search