import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"
import LoginForm from "./log&reg/LoginForm";
import RegisterForm from "./log&reg/RegisterForm";
import Main from "./pages/Main";
import {UserProvider} from './context/UserContext';


function App() {
  return (
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<Index/>} />
                  <Route path="/login" element={<LoginForm/>} />
                  <Route path="/registration" element={<RegisterForm/>} />
                  <Route path="/main" element={<Main/>} />
              </Routes>
          </Router>
      </UserProvider>
  );
}

export default App;
