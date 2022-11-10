import React from 'react'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import Nav from './components/nav.jsx'
import Container from './components/container.jsx'
import Popular from './pages/popular.jsx'
import Recent from './pages/recent.jsx'
import Search from './pages/search.jsx'
import View from './pages/view.jsx'
import Footer from './components/footer.jsx'
import Error from './pages/error.jsx'
import './styles/style.css'


function App() {
  return (
    <>
      <Router>
       <Nav/>
	<Container footer={<Footer/>}>
       <Routes>
	 <Route exact path="/" element={<Popular/>}/>
	 <Route exact path="/recent" element={<Recent/>}/>
	 <Route exact path="/search/:query" element={<Search/>}/>
	 <Route exact path="/view/:animeId" element={<View/>}/>
	 <Route exact path="/*" element={<Error/>}/>
       </Routes>
	</Container>
      </Router>
      </>
  );
}

export default App;
