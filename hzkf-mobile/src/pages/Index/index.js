import React from "react"

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

import axios from 'axios'

//导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './index.scss'

//导入utils中的获取当前城市定位的函数
import { getCurrentCity } from "../../utils"

//重构导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/list'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/list'
  }
]

//获取地理位置

/* 轮播图存在的问题
  1. 不会自动更新
  2. 从其它路由返回时高度有问题

  原因：轮播图加载是动态的，加载完成前后数量不一致

  解决：
  1. 在state中添加表示轮播图加载完成的数据
  2. 在轮播图数据加载完成时，修改该状态数据为true
  3. 只有在轮播图加载完成的情况下，才渲染轮播图组件
*/



export default class  Index extends React.Component {
    state = {
        swipers:[],
        isSwiperLoadead:false,

        //租房小组数据
        groups:[],

        //最新咨询
        news:[],

        //当前城市名称
        curCityName:'上海',

        //经纬度
        lng:116.404,
        lat:39.915
      }

      //获取租房小组数据
      async getGroups () {
        const res = await axios.get('http://localhost:8080/home/groups', {
          params:{
            area: 'AREA|88cff55c-aaa4-e2e0'
          }
        })

        this.setState({
          groups:res.data.body
        })
      }

      //获取轮播图数据的方法
      async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        this.setState({
            swipers:res.data.body,
            isSwiperLoadead:true
        })
      }

      async getNews() {
        const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
          news:res.data.body
        })
      }
      
      async componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        //通过IP定位获取到当前城市的名称
        // const curCity =  new window.BMapGL.LocalCity()
        // curCity.get(async res => {
        //   const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
        //   this.setState({
        //     curCityName:result.data.body.label,
        //     //经纬度
        //     lng:res.center.lng,
        //     lat:res.center.lat
        //   })
        //   console.log(res.center.lat);
        // })

        const curCity = await getCurrentCity()
        this.setState({
          curCityName:curCity.label
        })
      }

      //渲染轮播图结构
      renderSwipers() {
        return this.state.swipers.map(item => (
            <a
              key={item.id}
              href="http://itcast.cn"
              style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top'}}
              />
            </a>
          ))
      } 

      //渲染导航
      renderNavs() {
        return navs.map(item => 
        (<Flex.Item 
        key={item.id} 
        onClick={() => this.props.history.push(item.path)
        }>
          <img src={item.img} alt=""/>
            <h2>{item.title}</h2>
        </Flex.Item>
        ))
      }

      //渲染最新咨询
      renderNews() {
        return this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img 
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
              <Flex className="content" direction="column" justify="between">
                <h3 className="title">{item.title}</h3>
                <Flex className="info" justify="between">
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </div>
          </div>
        ))
      }

      render() {
        return (
          <div className="index">
            {/* 轮播图 */}
            <div className="swiper">
            {
              this.state.isSwiperLoadead?
            <Carousel autoplay infinite autoplayInterval={3000}>
              {this.renderSwipers()}
            </Carousel>:(' ')
            }

            {/* 搜索框 */}
            <Flex className="search-box">
              {/* 左侧白色 */}
                <Flex className="search">
                  {/* 位置 */}
                  <div className="location" onClick={() => this.props.history.push('/citylist')}>
                    <span className="name">{this.state.curCityName}</span>
                    <i className="iconfont icon-arrow"/>
                  </div>

                  {/*搜索表单 */}
                  <div className="form"  onClick={() => this.props.history.push('/search')}>
                    <i className="iconfont icon-seach"/>
                    <span className="text">请输入小区或地址</span>
                  </div>
                </Flex>
                {/*右侧地图图标 */}
                <i className="iconfont icon-map"  onClick={() => this.props.history.push('/map')}/>
            </Flex>
            </div>

            {/* 导航菜单 */}
            <Flex className="nav">{this.renderNavs()}</Flex>

            {/* 租房小组 */}
            <div className="group">
              <h3 className="group-title">
                租房小组 <span className="more">更多</span>
              </h3>

              {/* 宫格组件 */}
              <Grid data={this.state.groups} columnNum={2} square={false} hasLine={false} renderItem={(item) => (<Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img 
                  src={`http://localhost:8080${item.imgSrc}`}
                  alt=""
                />
              </Flex>)}/>
            </div>

            {/* 最新咨询 */}
            <div className="news">
              <h3 className="group-title">最新咨询</h3>
              <WingBlank size="md">{this.renderNews()}</WingBlank>
            </div>
          </div>
        );
      }
}