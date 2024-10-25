import Layout from '../../components/Layout/Layout'
import ListStory from './ListStory/ListStory'
import NewestChapter from './NewestChapter/NewestChapter'
import StoryTopRate from './StoryTopRate/StoryTopRate'
import './Home.scss'

function Home() {
  return (
    <>
    <Layout>
      <div className="main-content">
             <ListStory key={"list"}/>
             <NewestChapter key={"list2"}/>
            <StoryTopRate key={"list3"}/>
      </div>
      
    </Layout>
    
           
    </>
    
  )
}

export default Home