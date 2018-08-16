import React, { Component } from 'react'
import { Button, Intent, Spinner, Tree, ITreeNode, Tooltip, Icon, ProgressBar, Navbar, Dialog, Alignment, ButtonGroup, Menu, MenuItem, Classes, Collapse, Overlay, Position, InputGroup } from "@blueprintjs/core";
import { Layout } from "crust"
import classNames from 'classnames'
import hotkeys from 'hotkeys-js';
import io from 'socket.io-client';
require("babel-polyfill")

export default class Loader extends Component {
    renderSpinner() {
        if (this.props.isSpinner == false) return null
        return <svg id="spinner" className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: 200, height: 200 }}>
            <style dangerouslySetInnerHTML={{ __html: "\n                        ellipse {\n                            fill: none;\n                            stroke: currentColor;\n                            stroke-linecap: round;\n                            stroke-dasharray: 10, 1000;\n                            animation: dash-animation 2s cubic-bezier(0.8, 0.25, 0.25, 0.9) infinite, rotate-animation 2s linear infinite, colors 6s ease-in-out infinite;\n                            transform-origin: center;\n                        }\n\n                        @keyframes rotate-animation {\n                            to {\n                                transform: rotate(360deg);\n                            }\n                        }\n\n                        @keyframes colors {\n                            0% {\n                                stroke: #4285F4;\n                            }\n                            25% {\n                                stroke: #DE3E35;\n                            }\n                            50% {\n                                stroke: #F7C223;\n                            }\n                            75% {\n                                stroke: #1B9A59;\n                            }\n                            100% {\n                                stroke: #4285F4;\n                            }\n                        }\n\n                        @keyframes dash-animation {\n                            50% {\n                                stroke-dasharray: 200;\n                                stroke-dashoffset: 0;\n                            }\n                            100% {\n                                stroke-dasharray: 245;\n                                stroke-dashoffset: -260;\n                            }\n                        }\n                    " }} />
            <ellipse ry={40} rx={40} cy={50} cx={50} strokeWidth={10} />
        </svg>
    }
    renderFailed() {
        if (this.props.isSpinner != false) return null
        return <svg id="x" xmlns="http://www.w3.org/2000/svg" version={1.0} viewBox="0 0 100 100" style={{ width: 200, height: 200 }}>
            <defs id="defs8980" />
            <g id="layer1">
                <path d="M 6.3895625,6.4195626 C 93.580437,93.610437 93.580437,93.610437 93.580437,93.610437" style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: '18.05195999', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} id="path8986" />
                <path d="M 6.3894001,93.6106 C 93.830213,6.4194003 93.830213,6.4194003 93.830213,6.4194003" style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: '17.80202103', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} id="path8988" />
            </g>
        </svg>
    }
    renderMessage() {
        if (this.props.isSpinner == false) return "Failed to connect!"
        return "Connecting..."
    }
    render() {
        return <Layout.Grid className="background" row style={{ justifyContent: 'flex-start', height: '100%', zIndex: 9999 }}>
            <Layout.Grid style={{ alignSelf: 'stretch', flexGrow: 6 }}>
                <section className="bg-gray" style={{ position: 'relative', margin: 'auto', top: '20%', right: 0, bottom: 0, left: 0, textAlign: 'center' }}>
                    {this.renderSpinner()}
                    {this.renderFailed()}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <p id="title" style={{ fontSize: 40, fontWeight: 'bold' }}>{this.renderMessage()}</p>

                </section>
            </Layout.Grid>
        </Layout.Grid >

    }
}


