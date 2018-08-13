/**
 * NerdyDash
 * (c) Team2337 / Brendan Fuller
 * 
 * Concept from xel-toolkit
 */
import { h, render, Component } from 'preact';
import './menubar.less';

import { Layout, Common } from '../../../crust.jsx'
import ElectronWindow from './window.js'
/** @jsx h */
export default class Menubar extends Component {
    constructor() {
        super()
        this.state
    }
    minimize() {
        ElectronWindow.minimize()
    }
    maximize() {
        ElectronWindow.maximize()
    }
    unmaximize() {
        ElectronWindow.unmaximize()
    }
    exit() {
        ElectronWindow.close()
    }
    componentDidMount() {
        this.setState({zoom: true})
        ElectronWindow.addMaximizeListener(() =>{
            this.setState({zoom: false})
        })
        ElectronWindow.addUnmaximizeListener(() =>{
            this.setState({zoom: true})
        })
    }
    zoom() {
        let zoom = this.state.zoom
        if (zoom) {
           this.maximize()
           zoom = false
        } else {
            this.unmaximize()
            zoom = true
        }
        this.setState({zoom: zoom})
    }
    renderZoom(props) {
        if (props.zoom) {
            let d = []
            let zoom = this.state.zoom
            if (!zoom) {
                d.push(  <Common.Icon class="menubar-icon mdi mdi-fullscreen" style="display: none !important;"></Common.Icon> )
                d.push(  <Common.Icon class="menubar-icon mdi mdi-fullscreen-exit"></Common.Icon> )
               
            } else {
                d.push(  <Common.Icon class="menubar-icon mdi mdi-fullscreen"></Common.Icon> )
                d.push(  <Common.Icon class="menubar-icon mdi mdi-fullscreen-exit" style="display: none !important;"></Common.Icon> )
            }
            return ( <div class="menubar-menuitem-right menubar-zoom" onClick={this.zoom.bind(this)}>
            <div class="menubar-icon-holder">
                {d}
            </div>
        </div>)
        }
    }
    render(props, state) {
        let c = "menubar";
        if (props.disabled) {
            c = c + " menubar-disabled"
        }
        return (
            <div class={c} style={props.style} id="menubar">{props.children}
                <Layout.Box class="menubar-drag" />
                <Layout.Box class="menubar-right">
                    <div class="menubar-menuitem-right menubar-minimize"  onClick={this.minimize}>
                        <div class="menubar-icon-holder">
                            <Common.Icon class="menubar-icon mdi mdi-minus"></Common.Icon>
                        </div>
                    </div>
                    {this.renderZoom(props)}
                   
                    <div class="menubar-menuitem-right menubar-close" onClick={this.exit}>
                        <div class="menubar-icon-holder">
                            <Common.Icon class="menubar-icon mdi mdi-close"></Common.Icon>
                        </div>
                    </div>
                </Layout.Box>

            </div>
        )
    }
}