import { Route, Routes } from 'react-router-dom';
import './App.scss';
import LandingPage from './pages/landingpage/LandingPage';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import ForgotPassword from './pages/login/ForgotPassword';
import EnterOpt from './pages/login/EnterOpt';
import NewPassword from './pages/login/NewPassword';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='/enter-opt' element={<EnterOpt></EnterOpt>}></Route>
        <Route path='/new-password' element={<NewPassword></NewPassword>}></Route>
      </Routes>
    </div>
  );
}

export default App;
