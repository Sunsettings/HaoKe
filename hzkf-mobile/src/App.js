import React from 'react'
import {BrowserRouter as Router,  Route, Redirect} from 'react-router-dom'
import Map from './pages/Map'

//导入城市选择页面和首页
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
    <div className="App">
      {/* 默认路由匹配时，跳转到/home实现路由重定向到首页 */}
      <Route path="/" exact render={() => <Redirect to="/home"/>} />
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <Route path="/map" component={Map}></Route>
    </div>
    </Router>
  );
}

export default App;
