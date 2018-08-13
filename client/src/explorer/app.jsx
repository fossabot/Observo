
import React, { Component } from 'react'
import { render } from 'react-dom'
const notifier = require('node-notifier');
import { Button, Intent, Spinner, Tree, ITreeNode, Tooltip, Icon, ProgressBar, Navbar, Alignment, ButtonGroup, Menu, MenuItem, Classes, Collapse, Overlay } from "@blueprintjs/core";
import { Cell, col, Table } from "@blueprintjs/table";
import { Window, TitleBar, Text } from 'react-desktop/windows';
import { Layout } from "crust"
import Draggable from 'react-draggable';
import classNames from 'classnames'
import { AppToaster } from "./toaster";

import io from 'socket.io-client';
require("babel-polyfill")


class Home extends Component {
    constructor() {
        super()
        this.state = {
            isHelpOpen: false
        }
    }
    openHelp() {
        console.log("click")
        if (this.state.isHelpOpen == false) {
            this.setState({ isHelpOpen: true })
        } else {
            this.setState({ isHelpOpen: false })
        }
    }
    render() {
        return <Layout.Grid row style={{ justifyContent: 'flex-start', height: '100%' }}>
            <Overlay isOpen={this.state.isHelpOpen} style={{top: 10}}>

                <Layout.Grid height="200px" width="100%" background="white" className={Classes.ELEVATION_4} >
                    Thanks for using observo!
                </Layout.Grid>

            </Overlay>
            <Layout.Grid col>
                <Layout.Grid style={{ alignSelf: 'stretch', flexGrow: 2 }}>
                    <Layout.Grid col>
                        <Layout.Grid height="350px">
                            <section style={{ position: 'relative', margin: 'auto', top: '30%', right: 0, bottom: 0, left: 0, borderRadius: 3, textAlign: 'center' }}>
                                <p style={{ fontSize: "72px" }} className="observo-text">
                                    Observo
                                    </p>
                                <p>A multi-user data manipulation system</p>
                            </section>
                        </Layout.Grid>
                        <Layout.Grid row height="230px" style={{ marginLeft: 150 }}>
                            <Layout.Grid>
                                <Layout.Grid row center>
                                    <Button style={{ width: 200, height: 100 }}>
                                        <Layout.Box>
                                            <Icon icon="database" style={{ width: 30, height: 30 }} />

                                            <h3 style={{ paddingLeft: 10 }}>SERVERS</h3>
                                        </Layout.Box>
                                    </Button>
                                </Layout.Grid>
                            </Layout.Grid>
                            <Layout.Grid>
                                <Layout.Grid row center >
                                    <Button style={{ width: 200, height: 100 }} id="projects">
                                        <Layout.Box>
                                            <Icon icon="folder-open" style={{ width: 30, height: 30 }} />
                                            <h3 style={{ paddingLeft: 10 }}>PROJECTS</h3>
                                        </Layout.Box>
                                    </Button>
                                </Layout.Grid>
                            </Layout.Grid>
                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
                <Layout.Grid row height="50px" style={{ marginLeft: 10 }}>
                    <Layout.Grid>
                        <Button id="settings" style={{ height: 50, width: 50 }}>
                            <Layout.Box>
                                <Icon icon="cog" />
                            </Layout.Box>
                        </Button>
                    </Layout.Grid>
                    <Layout.Grid>
                    </Layout.Grid>
                    <Layout.Grid width="57px">
                        <Button id="about" style={{ height: 50, width: 50 }} onClick={this.openHelp.bind(this)}>
                            <Layout.Box>
                                <Icon icon="help" />
                            </Layout.Box>
                        </Button>
                    </Layout.Grid>
                </Layout.Grid>
            </Layout.Grid>
        </Layout.Grid>

    }
}

export default class App extends Component {
    render(props, state) {
        return (
            <Window color="rgba(0, 153, 191, 0)" background="rgba(0, 153, 191, 1)">
                <TitleBar background="#00acd7" title={<span className="observo-text">OBSERVO</span>} controls />

                <Layout.Grid canvas>
                    <Layout.Grid row style={{ "justifyContent": "-start" }}>
                        <Layout.Grid col>
                            <Home />
                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
            </Window>

        )
    }
}

