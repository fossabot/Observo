import React, { Component } from 'react'

//Import Generic Styles
import './grid.less'

import classNames from 'classnames'

export default class Grid extends Component {
   
    render() {
        let id = ""
        let gridClass = classNames({
            'crust--grid--flex': true,
            'crust--grid--row': (this.props.row & !this.props.center) || (this.props.canvas && !this.props.row),
            'crust--grid--col': this.props.col & !this.props.center,
            'crust--grid--col-center': this.props.col && this.props.center,
            'crust--grid--row-center': this.props.row && this.props.center,
        });
        let gridStyle = {}

        if (this.props.background) {
            gridStyle.backgroundColor = this.props.background
        }
        if (this.props.width) {
            gridStyle.flex = '0 0 auto'
            gridStyle.width = this.props.width
        }
        if (this.props.height) {
            gridStyle.flex = '0 0 auto'
            gridStyle.height = this.props.height
        }
        if (this.props.canvas) {
            id = "crust--grid--canvas"
        }
        let _id = "?"
        if (this.props.id) {
            _id = this.props.id
        }
        return (
            <div ref={this.props.gridRef} data-id={_id} className={classNames(gridClass, this.props.className)} id={id} style={{...gridStyle, ...this.props.style}} onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}>{this.props.children}</div>
        )
    }
}