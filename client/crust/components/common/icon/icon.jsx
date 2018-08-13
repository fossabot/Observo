import { h, render, Component } from 'preact';
//Import Generic Styles
import './icon.less'
import './mdi.less'

import classNames from 'classnames'

export default class Icon extends Component {
    render(props, state) {
        return (
            <i onClick={props.onClick} class={props.class + " icon"}></i>
        )
    }
}