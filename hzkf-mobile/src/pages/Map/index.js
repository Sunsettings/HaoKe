import React from "react";
import "./index.scss"

export default class Map extends React.Component {
    componentDidMount() {
        const map = new window.BMapGL.Map('container')
        const point = new window.BMapGL.Point(116.404,39.915)
        map.centerAndZoom(point,15)
    }
    render() {
        return (
            <div className="map">
                <div id="container"></div>
            </div>
        )
    }
}

