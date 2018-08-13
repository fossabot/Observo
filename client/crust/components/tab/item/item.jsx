import { h, render, Component } from 'preact';
//Import Generic Styles
import ThemeWrapper from '../../../theme.jsx'
import Provider from '../../../provider.jsx'
import Tools from '../../../tools.jsx'

import './item.less'

import { Common } from '../../../crust.jsx'
class Item extends Component {
    constructor() {
        super()
        this.state.ripple = {}
    }
    initializeRef (ref) {
        if (!ref) {
          // ref is called on removal with null element
          return
        }
        this.ref = ref
      }
    componentDidMount() {
        this.ref.style.width = "300px";

    }

    /*data allows for props to be used across items*/
    render(props, state) {
        let data = Tools.build({
            ripple: true,
            section: "tab",
            component: "item",
            type: "primary",
        }, props)
        return (
            <div {...data}  ref={ref => this.initializeRef(ref)}>
                <Common.Label>{props.id}</Common.Label>
                {props.children}
                <div id="selection-indicator"></div>
                <svg id="close-button" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path id="close-button-path"></path>
                </svg>
            </div>
        )
    }
}
export default ThemeWrapper(Provider.Ripple(Item))