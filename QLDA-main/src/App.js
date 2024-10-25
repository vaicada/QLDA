import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import Account from './views/Account/Account';
import Admin from './views/Account/Admin';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './views/PrivateRoute';
import StoryDetail from './views/StoryDetail/StoryDetail';
import Active from './views/Active/Active';
import Chapter from './views/Chapter/Chapter';
import Search from './views/Search/Search';
import AllStory from './views/AllStory/AllStory';
import 'react-loading-skeleton/dist/skeleton.css'
import './scss/App.scss';
function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='truyen/:url' element={<StoryDetail />}/>
        <Route element={<PrivateRoute roles={['USER']} />}>
          <Route path='/user/*' element={<Account />}/>
        </Route>
        <Route element={<PrivateRoute roles={['ADMIN']} />}>
          <Route path='admin/*' element={<Admin />}/>
        </Route>
        <Route path='active/:token' element={<Active />}/>
        <Route path='truyen/:url/:chapnum' element={<Chapter />}/>
        <Route path='tim-kiem' element={<Search/>}/>
        <Route path='tat-ca' element={<AllStory/>}/>
      </Routes>
      <Footer/>
      <ToastContainer autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover={false} />
    </HashRouter>
  );
}

export default App;
