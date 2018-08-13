import { h, render, Component } from 'preact';
//Import Generic Styles
import ThemeWrapper from '../../../theme.jsx'
import classNames from 'classnames'

class Input extends Component {
    render(props, state) {
        let inputType = "default"
        if (props.type) {
            inputType = props.type
        }
        let inputClass = classNames(`${props.theme}`, 'form', 'input', `${inputType}`);
        let inputStyle = {}
        if (props.style) {
            inputStyle = props.style
        }
        return (
            <input type="text" placeholder={props.placeholder} value={props.value} style={inputStyle} class={classNames(inputClass, props.class)} onInput={props.onInput} />
        )
    }
}
export default ThemeWrapper(Input)