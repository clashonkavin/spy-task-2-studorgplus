import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "./loginpage";
import UserRegister from "./registerpage";
import Home from "./homepage";
import Events from "./academicalender";
import NotFound from "./notfoundpage";
import GoogleAuth from "./googleauth";

function App() {
  return (
    <Router>
      <div>
        <div className="content">
          <Routes>
            <Route exact path="/login" element={<UserLogin />}></Route>
            <Route exact path="/register" element={<UserRegister />}></Route>
            <Route exact path="/home" element={<Home />}></Route>
            <Route exact path="/events" element={<Events />}></Route>
            <Route exact path="/googleAuth" element={<GoogleAuth />}></Route>
            <Route exact path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
