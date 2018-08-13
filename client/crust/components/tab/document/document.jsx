import { h, render, Component } from 'preact';
//Import Generic Styles
import ThemeWrapper from '../../../theme.jsx'
import classNames from 'classnames'
import './document.less'
import { Tab } from "../../../crust.jsx"
class DocumentTab extends Component {
    constructor() {
        super()
        this.state.ripple = {}
        this.state.tabs = []
    }
    addTab() {
        let tabs = this.state.tabs 
        tabs.push(<Tab.Item id="Hello" class="expand" />)
        this.setState({tabs: tabs})
    }
    renderButton(props) {
        if (props.openDocument) {
            return (<svg id="open-button" viewBox="0 0 100 100" preserveAspectRatio="none" onClick={this.addTab.bind(this)}>
                <path id="open-button-path"></path>
            </svg>)
        }
    }
    renderObjects() {
        
        return (this.state.tabs)
    }
    render(props, state) {
        let type = "primary"
        if (props.type) {
            buttonType = props.type
        }
        //let classes = classNames(`${props.theme}`, 'common', 'button', `${type}`);
        let classes = []
        let style = {}
        if (props.style) {
            style = props.style
        }
        style.backgroundColor = "orange"
        return (
            <div class="crust--tab--document">
                {this.renderObjects()}
                <div id="selection-indicator-container">
                    <div id="selection-indicator" hidden></div>
                </div>
                {this.renderButton(props)}

            </div>
        )
    }
}
export default ThemeWrapper(DocumentTab)