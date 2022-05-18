import React from 'react'

import { Route } from "react-router-dom";

import Profile from '../Profile';
import HouseList from '../HouseList';
import News  from '../News'
import Index from '../Index';

import { TabBar } from 'antd-mobile';


//导入组件自己的样式文件
import './index.scss'

const tabItems = [
    {
        title:'首页',
        icon:'icon-ind',
        path:'/home'
    },
    {
        title:'找房',
        icon:'icon-findHouse',
        path:'/home/list'
    },
    {
        title:'咨询',
        icon:'icon-infom',
        path:'/home/news'
    }
    ,
    {
        title:'我的',
        icon:'icon-my',
        path:'/home/profile'
    }
]


/* 
  问题:点击导航栏菜单，导航栏点击返回首页时，底部菜单没有高亮

  原因：我们实现该功能时，只考虑了点击和第一次加载Home组件的情况，没有考虑不重新加载Home组件时路由切换

  解决：在路由切换时，执行菜单高亮
  1. 添加componentDidUpdate钩子函数
  2. 在钩子函数中判断路由地址是否切换,通过比较props来判断
  3. 在路由地址切换时，让菜单高亮
*/

export default class Home extends React.Component {
    state = {
        //控制默认选中的TabBar菜单
        selectedTab: this.props.location.pathname
    };

    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== this.props.location.pathname)
        {
          this.setState({
            selectedTab: this.props.location.pathname
          })
        }
    }

    renderTabBarItem() {
        return tabItems.map(items => <TabBar.Item
            title={items.title}
            key={items.title}
            icon={
                <i className={`iconfont ${items.icon}`}></i>
            }
            selectedIcon={<i className={`iconfont ${items.icon}`}></i>
            }
            selected={this.state.selectedTab === items.path}
            onPress={() => {
              this.setState({
                selectedTab: items.path,
              });

              //路由切换
              this.props.history.push(items.path)
            }}
          ></TabBar.Item>)
    }

    render() {
        return (
        <div className="home">
        <Route path="/home/news" component={News}></Route>
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* TabBar */}
        <TabBar
          unselectedTintColor="#888"
          tintColor="#21b94a"
          barTintColor="white"
          noRenderContent={true}
        >
            {/* TabBar代码重构 */}
          {this.renderTabBarItem()}
        </TabBar>
      </div>
        )
    }
}