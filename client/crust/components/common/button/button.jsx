import { h, render, Component } from 'preact';
import ThemeWrapper from '../../../theme.jsx'
import Provider from '../../../provider.jsx'
import Tools from '../../../tools.jsx'
class Button extends Component {
    render(props, state) {
        let data = Tools.build({
            ripple: true,
            section: "common",
            component: "button",
            type: "primary"
        }, props)
        
        return (
            <button type="button" {...data}>{props.children}</button>
        )
    }
}

export default ThemeWrapper(Provider.Ripple(Button))