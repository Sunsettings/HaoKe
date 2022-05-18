import React from 'react'
import { NavBar } from 'antd-mobile'
import axios from "axios"
import { List, AutoSizer} from 'react-virtualized';

import "./index.scss"


//导入untils获取当前定位的方法
import { getCurrentCity } from '../../utils'

//数据格式化的方法
const formatCityData = list => {
    const cityList = {}
    //1. 遍历list数组
    list.forEach(item => {
        const first = item.short.substr(0,1)
        //判断cityList中是否有该分类
        if(cityList[first]) {
            //若有，直接向分类中push即可
            cityList[first].push(item)
        } else {
            //没有，就要创建新数组，将当前城市信息添加进入
            cityList[first] = [item]
        }
    })
    //获取索引数据
    const cityIndex = Object.keys(cityList).sort()
    
    return {
        cityList,
        cityIndex
    }
}

const TITLE_HEIGHT = 36

const NAME_HEIGHT = 50

//封装处理字母索引的方法
const formatCityIndex = (letter) => {
    switch(letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }   
}

export default class CityList extends React.Component {
    state = {
        cityList : {},
        cityIndex : []
    }

    componentDidMount() {
        this.getCityList()
    }

    //获取城市列表数据
    async getCityList(){
       const res = await axios.get('http://localhost:8080/area/city?level=1')
       const {cityList,cityIndex} = formatCityData(res.data.body)

       //获取热门城市数据
       //将数据添加到citylist中
       const hotRes = await axios.get('http://localhost:8080/area/hot')
       cityList['hot'] = hotRes.data.body
       //将索引添加到cityIndex中
       cityIndex.unshift('hot')

       //获取当前定位城市
        const curCity = await getCurrentCity()

        // 将当前定位城市数据添加到cityList中
        // 将当前定位城市的索引添加到cityIndex中
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        this.setState({
            cityList,
            cityIndex
        })
        
    }
    
    //渲染每一行数据的渲染函数
    rowRenderer = ({
      key, // Unique key within array of rows
      index, // Index of row within collection
      isScrolling, // 当前项目是否滚动中
      isVisible, // 这一行是否在list中可见的
      style, // 指定每一行的位置
    }) => {
      //获取每一行的字母索引
      const {cityIndex,cityList} = this.state
      const letter = cityIndex[index]
      
      return (
        <div key={key} style={style} className="city">
            <div className='title'>{formatCityIndex(letter)}</div>
            {
                cityList[letter].map(item => <div className='name' key={item.value}>{item.label}</div>)
            }
        </div>
      );
    }

    //动态渲染每一行高度的算法
    getRowHeight = ({index}) => {
        //标题高度加上城市数量乘以城市名称
        const{cityList,cityIndex} = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    render() {
        return( 
        <div className='citylist'> 
            <NavBar
                className='navbar'
                mode="light"
                icon={<i className='iconfont icon-back' />}
                onLeftClick={() => this.props.history.go(-1)}
      >
          城市选择
            </NavBar>

            {/* 城市列表 */}
            {/* Auto-Sizer组件的render-props模式获取到AutoSizer组件暴露的width和height属性
                并设置List组件的width和height属性
            */}
            <AutoSizer>
                {
                    ({width, height}) => <List
                    width={width}
                    height={height}
                    rowCount={this.state.cityIndex.length}
                    rowHeight={this.getRowHeight}
                    rowRenderer={this.rowRenderer}
                />
                }
            </AutoSizer>
        </div>        
        )
    }
}