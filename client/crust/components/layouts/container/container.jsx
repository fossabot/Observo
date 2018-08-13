import { h, render, Component } from 'preact';

//Import Generic Styles
import './container.less'

import classNames from 'classnames'

export default class Container extends Component {
    render(props, state) {
        return (
            <div style={props.style} class={"container " + props.class} style={props.style} onClick={props.onClick}>{props.children}</div>
        )
    }
}