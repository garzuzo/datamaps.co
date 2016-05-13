import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import d3 from 'd3'

import style from './MapElements.css'
import Title from '../Title/Title'
import Datamap from '../Datamap/Datamap'
import MapLegend from '../MapLegend/MapLegend'

export default class MapElements extends Component {
  linearScale(min, max) {
    const { mapUi } = this.props

    return function _linearScale() {
      const startColor = mapUi.getIn(['linear', 'startColor'])
      const endColor = mapUi.getIn(['linear', 'endColor'])

      return d3.scale.linear()
        .domain([min, max])
        .range([startColor, endColor])
        .interpolate(d3.interpolateLab)
    }
  }

  equidistantScale(min, max) {
    const { mapUi } = this.props

    return function _equidistantScale() {
      const colorPallete = mapUi.getIn(['equidistant', 'pallete'])

      return d3.scale.quantize().domain([min, max]).range(colorPallete)
    }
  }

  colorScale() {
    const { extremeValues } = this.props
    const min = extremeValues.get('customMin') || extremeValues.get('min')
    const max = extremeValues.get('customMax') || extremeValues.get('max')

    const scales = {
      linear: this.linearScale(min, max),
      equidistant: this.equidistantScale(min, max),
    }

    const dataClassification = this.props.mapUi.get('dataClassification')
    return scales[dataClassification]()
  }

  render() {
    const svgWidth = 750
    const svgHeight = svgWidth * 0.8
    const { mapUi, extremeValues, regionData } = this.props
    const noDataColor = mapUi.get('noDataColor')
    const colorScale = this.colorScale()

    const svgStyle = {
      width: svgWidth,
      height: svgHeight,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }

    const mapLegend = (
      <MapLegend
        svgWidth={svgWidth}
        svgHeight={svgHeight}
        extremeValues={extremeValues}
        mapUi={mapUi}
      />
    )

    return (
      <svg className={style.svg} style={svgStyle}>
        <Title
          text={this.props.mapUi.get('title')}
          className="map-title"
          coords={{ x: 30, y: 40 }}
        />

        <Datamap
          regionData={regionData}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          colorScale={colorScale}
          noDataColor={noDataColor}
          mouseMoveOnDatamap={this.props.mouseMoveOnDatamap}
          mouseEnterOnDatamap={this.props.mouseEnterOnDatamap}
          mouseLeaveDatamap={this.props.mouseLeaveDatamap}
          mouseEnterOnSubunit={this.props.mouseEnterOnSubunit}
        />

        <Title
          text={this.props.mapUi.get('legendTitle')}
          className="legend-title"
          coords={{ x: svgWidth - 80, y: svgHeight - 85 }}
        />

        {extremeValues.get('min') && extremeValues.get('max') && mapLegend}
      </svg>
    )
  }
}

MapElements.propTypes = {
  mouseMoveOnDatamap: PropTypes.func.isRequired,
  mouseEnterOnDatamap: PropTypes.func.isRequired,
  mouseLeaveDatamap: PropTypes.func.isRequired,
  mouseEnterOnSubunit: PropTypes.func.isRequired,
  regionData: PropTypes.instanceOf(Map).isRequired,
  extremeValues: PropTypes.instanceOf(Map).isRequired,
  mapUi: PropTypes.instanceOf(Map).isRequired,
}
