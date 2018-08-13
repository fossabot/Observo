import React, { Component } from 'react'

//Import Generic Styles
import './box.less'

import classNames from 'classnames'

export default class Box extends Component {
    render() {
        let boxClass = classNames({
            'crust--box': true,
            'crust--box--vertical': this.props.vertical,
        });
        return (
            <div style={this.props.style} className={boxClass + " " + this.props.class} style={this.props.style} onClick={this.props.onClick}>{this.props.children}</div>
        )
    }
}