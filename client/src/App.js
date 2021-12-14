import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from "./Components/Home"
import Import from './Components/Import';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Update from './Components/Update';


function App() {
  return (
   <BrowserRouter>
   <Routes>
     <Route path="/" element={<Login/>} />
     <Route path="/signup" element={<Signup/>} />
     <Route path="/import" element={<Import/>} />
     <Route path="/Home" element={<Home/>} />
     <Route path="/update/:id" element={<Update/>} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
