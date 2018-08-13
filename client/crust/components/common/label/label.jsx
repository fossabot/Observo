import { h, render, Component } from 'preact';
//Import Generic Styles
import ThemeWrapper from '../../../theme.jsx'
import Provider from '../../../provider.jsx'
import classNames from 'classnames'

class Button extends Component {
    render(props, state) {
        let type = "default"
        if (props.type) {
            type = props.type
        }
        let classes = classNames(`${props.theme}`, 'common', 'label', `${type}`);
        let style = {}
        if (props.style) {
            style = props.style
        }
        return (
            <div style={style} class={classNames(classes, props.class)} onClick={props.onClick}>{props.children}</div>
        )
    }
}

export default ThemeWrapper(Provider.Ripple(Button))