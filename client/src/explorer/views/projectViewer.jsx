import React, { Component } from 'react'
import { Button, Card, Intent, Icon, Dialog, Alignment, Tag, Tooltip, ButtonGroup, Classes, Collapse, Overlay, Position, InputGroup, Alert, Elevation } from "@blueprintjs/core";
import { Layout } from "crust"
import classNames from 'classnames'
import hotkeys from 'hotkeys-js';
import io from 'socket.io-client';
import moment from 'moment';
window.moment = moment;
require("babel-polyfill")

export default class ProjectViewer extends Component {
    constructor() {
        super()
        this.state = {
            alertDisconnect: false
        }
    }
    /**
     * GoBack - Go Back? idk
     */
    goBack() {
        if (this.state.alertDisconnect == false) {
            this.setState({ alertDisconnect: true })
        } else {
            this.setState({ alertDisconnect: false })
        }
    }
    /**
     * ConnectToServer - When a server is selected this will trigger
     */
    connectToServer(ip) {


    }
    /**
     * RenderServers - Renders all servers listed on the sidebar
     */
    renderServers() {
        if (this.props.projects != null) {
            let items = []
            for (let p in this.props.projects) {
                let project = this.props.projects[p]
                items.push(
                    <Layout.Grid key={p} height="75px" width="100%" style={{ borderBottom: "1px solid black", cursor: "pointer" }} className="box">
                        <p>{project.name}</p>
                        <p>Last Edited: {moment(new Date(project.lastEdited.replace(/\s/g, "T")).toUTCString()).fromNow()}</p>
                    </Layout.Grid>
                )
                console.log(new Date(project.lastEdited.replace(/\s/g, "T")).toUTCString())
            }
            return items
        }
        return null
    }
    /**
     * Renders ALERT about disconnecting from the server
     */
    renderDisconnect() {
        return <Alert
            cancelButtonText="Cancel"
            confirmButtonText="Disconnect"
            icon="offline"
            intent={Intent.DANGER}
            isOpen={this.state.alertDisconnect}
            onCancel={this.goBack.bind(this)}
            onConfirm={() => { this.setState({ alertDisconnect: false }); this.props.socketDisconnect() }}
        >
            <p>
                Are you sure you want to disconnect? </p>
        </Alert>
    }
    render() {
        const renderRoles = (roles) => {
            let items = []
            for (let r in roles) {
                let role = roles[r]
                items.push(<Layout.Grid key={r}><Tag style={{ background: role.color, marginBottom: 10, margin: 3 }}>{role.name}</Tag></Layout.Grid>)
            }
            return items
        }
        return <Layout.Grid row id="container" style={{ justifyContent: 'flex-start', height: '100%' }}>
            <Layout.Grid col>
                <Layout.Grid style={{ alignSelf: 'stretch', flexGrow: 2 }}>
                    <Layout.Grid col>
                        <Layout.Grid row style={{ flex: '0 0 auto', height: 350 }}>
                            <Layout.Grid>
                                <Card interactive={false} elevation={Elevation.TWO} style={{ margin: 10 }}>
                                    <h2>{this.props.serverProperties.name}</h2>
                                    <p>{this.props.serverProperties.ip}</p>
                                </Card>
                            </Layout.Grid>
                            <Layout.Grid>
                                <Card interactive={false} elevation={Elevation.TWO} style={{ margin: 10 }}>

                                    <Layout.Grid row>
                                        <Layout.Grid>
                                            <h2>{this.props.userData.name}<sup></sup></h2>
                                        </Layout.Grid>
                                        <Layout.Grid col>
                                            {renderRoles(this.props.userData.roles)}
                                        </Layout.Grid>
                                    </Layout.Grid>
                                </Card>
                            </Layout.Grid>
                        </Layout.Grid>
                        <Layout.Grid height="230px">

                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
                <Layout.Grid row style={{ flex: '0 0 auto', height: 100, marginLeft: 10 }}>
                    <Layout.Grid style={{ flex: '0 0 auto', width: 60 }}>
                        <Tooltip content="Go back" position={Position.LEFT}>
                            <Button id="back" onClick={this.goBack.bind(this)}>
                                <Layout.Box>
                                    <Icon icon="chevron-left" style={{ width: 30, height: 30 }} />
                                </Layout.Box>
                            </Button>
                        </Tooltip>
                    </Layout.Grid>
                </Layout.Grid>
            </Layout.Grid>
            <Layout.Grid col width="300px" height="100%" style={{ overflowY: "auto", overflow: "overlay" }} className="observo--sidebar">
                {this.renderServers()}
            </Layout.Grid>
            {this.renderDisconnect()}
        </Layout.Grid>

    }
}


