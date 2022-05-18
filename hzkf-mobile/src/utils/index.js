import axios from 'axios'

//创建并导出获取定位城市的函数getCurrentCity
export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    //判断localStorage 中是否有定位城市
    if(!localCity) {
        //若没有，就要调用首页中获取定位城市的代码获取，并且存储到本地存储中，然后返回该城市的数据
            return new Promise((resolve,reject) => {
                const curCity =  new window.BMapGL.LocalCity()
                curCity.get(async res => {
                  try{
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                
                  //存储到本地存储库中
                  localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
                  //返回城市数据
                
                  } catch (e) {
                    //获取定位城市失败
                    reject(e)
                  }
              })
        
            })
    }
    //如果有，直接返回本地存储中的城市数据
    //上面有了处理异步操作，使用了Promise，为了函数的统一，此处，也应该使用Promise
    //因为此处的Promise不会失败，所以，此处，只需要返回一个成功的Promise即可

    return Promise.resolve(localCity)
}