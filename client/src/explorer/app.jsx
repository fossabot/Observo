import React, { Component } from 'react'
const notifier = require('node-notifier');
import { Button, Intent, Spinner, Tree, ITreeNode, Tooltip, Icon, ProgressBar, Navbar, Dialog, Alignment, ButtonGroup, Menu, MenuItem, Classes, Collapse, Overlay, Position, InputGroup } from "@blueprintjs/core";
import { Cell, col, Table } from "@blueprintjs/table";
import { Window, TitleBar, Text } from 'react-desktop/windows';
import { Layout } from "crust"
import Draggable from 'react-draggable';
import classNames from 'classnames'
import { AppToaster } from "./toaster";
import hotkeys from 'hotkeys-js';
import io from 'socket.io-client';
require("babel-polyfill")

//TODO: REMOVE AS ITS DEBUG
stash.set('serverList', { "butter": { name: "Butter", ip: "localhost:3000" } });

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

import ServerList from './views/serverlist.jsx'
import Home from './views/home.jsx'
import Loader from './views/loader.jsx'

class RuntimeEnv {
    constructor() {

    }
    connectToServer() {

    }
}

const runtime = new RuntimeEnv()



export default class App extends Component {
    constructor() {
        super()
        //Starting "Orginal" Positions
        this.oPosX = -888
        this.oPosY = 0

        //Normal Postiions
        this.posX = this.oPosX
        this.posY = this.oPosY

        //Offset of Grid (how wide and how long each view is
        this.dPosX = 888
        this.dPosY = 637

        this.socketObject = null

        this.state = {
            isSpinner: true,
            showSignInDialog: false,
            username: null,
            password: null
        }
    }
    /**
     * componentDidMount
     */
    componentDidMount() {
        //Update the location of the view when loaded (HOME VIEW)
        this.moveTo(0, 0, 0)
    }
    updatePosition(x, y, time) {
        //Update Position
        let keyframes = [{
            transform: `translate(${this.posX}px, ${this.posY}px)` //Pos From
        },
        {
            transform: `translate(${x}px, ${y}px)` //Pos Towards
        }
        ]
        //Animation Timinings
        let timing = {
            duration: time,
            iterations: 1,
            easing: "ease",
            fill: "forwards"
        }
        //Run the animation via the dom node of the grid reference
        let animation = ReactDOM.findDOMNode(this.refs.grid).animate(
            keyframes,
            timing
        )
        //Update the postions in this class object
        this.posX = x
        this.posY = y


        //Do something when the animation is done, like enable click events or whatever
        animation.onfinish = function () {

        };

    }
    /**
     * Move the View to a location as a GRID (so 0,0 or 1,0.. etc)
     * @param {Int} x 
     * @param {Int} y 
     * @param {Int} time 
     */
    moveTo(x, y, time = 1000) {
        x = this.oPosX - (this.dPosX * x)
        y = this.oPosY + (this.dPosY * y)
        this.updatePosition(x, y, time)
    }
    /**
     * Moves the view upwards with a optional time (default 750ms)
     * @param {Int} time 
     */
    moveUp(time = 750) {
        let y = this.posY + this.dPosY
        this.updatePosition(this.posX, y, time)
    }
    /**
     * Moves the view downwards with a optional time (default 750ms)
     * @param {Int} time 
     */
    moveDown(time = 750) {
        let y = this.posY - this.dPosY
        this.updatePosition(this.posX, y, time)
    }
    /**
     * Moves the view left with a optional time (default 750ms)
     * @param {Int} time 
     */
    moveLeft(time = 750) {
        let x = this.posX + this.dPosX
        this.updatePosition(x, this.posY, time)
    }
    /**
     * Moves the view right with a optional time (default 750ms)
     * @param {Int} time 
     */
    moveRight(time = 750) {
        let x = this.posX - this.dPosX
        this.updatePosition(x, this.posY, time)

    }
    /////////////////////////
    async connectToServer(ip) {
        console.log("triggered")
        let self = this
        console.log(ip)
        let socketObject = io.connect(`http://${ip}/core/`)
        socketObject.on('connect_error', async () => {
            self.setState({ isSpinner: false })
            await sleep(2000)
            socketObject.close()
            this.moveTo(-1,0,0)    
            self.setState({ isSpinner: true })
        })
        //If the client can connect run this event
        socketObject.on('connect', function () {
            socketObject.on('disconnect', function () {
                socketObject.close()
                self.socketObject = null
            })
            socketObject.on("auth_sessionKey", (data) => {
                console.log(data)
                self.setState({showSignInDialog: true})
            }) 
            
        })
        this.socketObject = socketObject
    }
    async authSignIn() {
        if (this.socketObject != null) {
            this.socketObject.emit("auth_signIn", {username: this.state.username, password: this.state.password})
        }
    }
    toggleShowSignIn() {
        if (this.state.showSignInDialog == false) {
            this.setState({showSignInDialog: true})
        } else {
            this.moveTo(-1,0,0)   
            this.setState({showSignInDialog: false}) 
        }
        
    }
    renderShowSignInDialog() {
        return <Dialog
        icon="connect"
        isOpen={this.state.showSignInDialog}
        onClose={this.toggleShowSignIn.bind(this)}
        title="Sign In"
    >
        <div className="pt-dialog-body">
            <Layout.Grid canvas style={{ padding: 10 }}>
                <Layout.Grid row>
                    <Layout.Grid row>
                        <Layout.Grid col width="75px">
                            <Layout.Grid>
                                <p>Username</p>
                            </Layout.Grid>
                            <Layout.Grid style={{paddingTop: 5}}>
                                <p>Password</p>
                            </Layout.Grid>
                        </Layout.Grid>
                        <Layout.Grid col>
                            <Layout.Grid>
                                <InputGroup leftIcon="user" />
                            </Layout.Grid>
                            <Layout.Grid style={{paddingTop: 5}}>
                                <InputGroup onInput={(event) => {console.log(event.target.value)}}leftIcon="password" />
                            </Layout.Grid>
                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
            </Layout.Grid>
        </div>
        <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
                <Button
                    intent={Intent.SUCCESS}
                    text="Add"
                />
            </div>
        </div>
    </Dialog>
    }
    render() {
        return (
            <Window color="rgba(0, 153, 191, 0)" background="rgba(0, 153, 191, 1)">
                <TitleBar background="#00acd7" title={<span className="observo-text">OBSERVO</span>} controls />

                <Layout.Grid canvas>
                    <Layout.Grid row style={{ "justifyContent": "flex-start" }} ref="grid">
                        <Layout.Grid col>
                            <Layout.Grid width="888px" height="637px">
                                <ServerList moveTo={this.moveTo.bind(this)} moveRight={this.moveRight.bind(this)} onConnect={(ip) => { this.moveTo(-1, -1, 0); this.connectToServer(ip) }} />
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                <Loader isSpinner={this.state.isSpinner} />
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                7
                            </Layout.Grid>
                        </Layout.Grid>
                        <Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                <Home moveLeft={this.moveLeft.bind(this)} moveRight={this.moveRight.bind(this)} />
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                5
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                8
                            </Layout.Grid>
                        </Layout.Grid>
                        <Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                3
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                6
                            </Layout.Grid>
                            <Layout.Grid width="888px" height="637px">
                                9
                            </Layout.Grid>
                        </Layout.Grid>


                    </Layout.Grid>
                </Layout.Grid>
                {this.renderShowSignInDialog()}
            </Window>
        )
    }
}

