import React, { Component } from 'react'
import { Button, Intent, Spinner, Switch, Tooltip, Icon, ProgressBar, Dialog, MenuDivider, Popover, Alignment, Menu, MenuItem, Classes, Collapse, Overlay, Position, InputGroup } from "@blueprintjs/core";
import { Layout } from "crust"
import { AppToaster } from "./toaster";
require("babel-polyfill")


export default class Settings extends Component {
    constructor() {
        super()
        this.state = {
            selectedView: null
        }
    }
    componentWillReceiveProps() {

    }
    componentDidMount() {
        for (let item in this.props.settings) {
            let i = this.props.settings[item]
            if (i.selected) {
                this.setState({ selectedView: item, localSettings: this.props.settings, localSettingsO: this.props.settings })
                break
            }
        }
    }
    switchView(name) {
        this.setState({ selectedView: name })
    }
    renderSectionList() {
        let items = []

        for (let item in this.state.localSettings) {
            let i = this.state.localSettings[item]
            let styleText = { paddingLeft: 10, marginTop: 5, fontSize: 30 }
            let styleIcon = { width: 30, height: 30 }
            if (item == this.state.selectedView) {
                styleText.color = "#00acd7"
                styleIcon.color = "#00acd7"
            }
            items.push(<Layout.Grid key={item} row height="50px" style={{ cursor: "pointer" }} className="obsero--settings-section" onClick={this.switchView.bind(this, item)}>
                <Layout.Grid>
                    <Layout.Grid row center style={{ paddingTop: 15, paddingBottom: 15 }}>
                        <Layout.Box>
                            <Icon icon={i.icon} style={styleIcon} />
                            <p style={styleText} >{i.display}</p>
                        </Layout.Box>
                    </Layout.Grid>
                </Layout.Grid>
            </Layout.Grid>)
        }
        return items
    }
    updateDropdown(data, name) {
        console.log("loop")
        let copy = this.state.localSettings
        console.log(copy[data.category].sections)
        for (let object in copy[data.category].sections) {
            if (copy[data.category].sections[object].id == data.section) {
                for (let s in copy[data.category].sections[object].list) {
                    if (copy[data.category].sections[object].list[s].id == data.object) {
                        for (let t in copy[data.category].sections[object].list[s].options) {
                            if (copy[data.category].sections[object].list[s].options !== "undefined") {
                                if (copy[data.category].sections[object].list[s].options[t].text == name) {
                                    copy[data.category].sections[object].list[s].options[t].selected = true
                                } else {
                                    copy[data.category].sections[object].list[s].options[t].selected = false
                                }
                            }

                        }
                    }
                }
            }
        }
        this.setState({ localSettings: copy })
    }
    updateSwitch(data, boolean) {
        console.log(boolean)
        console.log("loop")
        let copy = this.state.localSettings
        console.log(copy[data.category].sections)
        for (let object in copy[data.category].sections) {
            if (copy[data.category].sections[object].id == data.section) {
                for (let s in copy[data.category].sections[object].list) {
                    if (copy[data.category].sections[object].list[s].id == data.object) { 
                        copy[data.category].sections[object].list[s].options.selected = !boolean
                    }
                }
            }
        }
        this.setState({ localSettings: copy })
    }
    renderSectionArea() {
        let renderSwitch = (key, boolean, text, data) => {
            return <Layout.Grid key={"observoSettingSwitch" + key} height="30px" style={{ marginTop: 5 }}>
                <Layout.Box>
                    <p style={{ paddingLeft: 10, marginTop: 5, fontSize: 20 }} >{text}: </p> <Switch checked={boolean.selected} style={{ marginLeft: 15, marginTop: 5, fontSize: 20 }} large onChange={this.updateSwitch.bind(this, data, boolean.selected)} />
                </Layout.Box>
            </Layout.Grid>
        }
        let renderTitle = (key, title) => {
            return <Layout.Grid key={key} height="50px" style={{ borderBottom: "1px solid black" }}> <p style={{ paddingLeft: 10, marginTop: 5, fontSize: 30 }} >{title}</p></Layout.Grid>
        }
        let renderDropdown = (key, options, text, data) => {
            let getMenu = (z) => {
                let opts = []
                for (let o in z) {

                    let a = z[o]
                    let _icon = null, _text = null, _disabled = false
                    if (a.icon != null) {
                        _icon = a.icon
                    }
                    if (a.text != null) {
                        _text = a.text
                    }
                    if (a.selected != null) {
                       if (a.selected) {
                            _disabled = true
                       }
                    }
                    opts.push(<MenuItem disabled={_disabled} key={"observoSettingDropdown" + o} onClick={this.updateDropdown.bind(this, data, _text)} icon={_icon} text={_text} />)
                }
                return <Menu>{opts}</Menu>
            }
            let getSelected = (z) => {
                for (let o in z) {
                    let a = z[o]
                    if (a.selected) {
                        let useIcon = null
                        if (a.icon != null) {
                            useIcon = <Icon icon={a.icon} style={{ width: 15, height: 15, marginRight: 5 }} />
                        }
                        return <span>{useIcon}{a.text}</span>
                    }
                }
            }


            return <Layout.Grid key={key} height="30px" style={{ marginTop: 5 }}>
                <Layout.Box>
                    <p style={{ paddingLeft: 10, marginTop: 5, fontSize: 20 }} >{text}: </p>
                    <Popover content={getMenu(options)} position={Position.RIGHT}>
                        <Button style={{ marginLeft: 15 }} text={getSelected(options)} />
                    </Popover>
                </Layout.Box>
            </Layout.Grid>
        }

        let items = []
        for (let item in this.state.localSettings) {
            let i = this.state.localSettings[item]
            if (item == this.state.selectedView) {
                for (let sec in i.sections) {
                    let section = i.sections[sec]
                    console.log(i.sections[sec])
                    items.push(renderTitle(section.id, section.display))
                    for (let o in section.list) {
                        let object = section.list[o]
                        if (object.type != null && object.options != null) {
                            let data = { category: item, section: section.id, object: object.id }
                            if (object.type == "DROPDOWN") {

                                items.push(renderDropdown(object.id, object.options, object.display, data))
                            }
                            if (object.type == "TOGGLE") {
                                items.push(renderSwitch(object.id, object.options, object.display, data))
                            }
                        }
                    }
                }
            }
        }
        return items
    }
    saveHandler() {
        if (this.props.onSave) {
            this.props.onSave()
        }
    }
    cancelHandler() {
        if (this.props.onCancel) {
            this.props.onCancel()
        }
    }
    render() {
        return <Overlay
            icon="cog"
            isOpen={this.props.isOpen}
            onClose={this.props.onClose}
            title="Settings"
            style={{ width: 500, height: 350 }}
            transitionDuration={0}
        >
            <Layout.Grid height="100%" width="100%" background="lightgray" className={Classes.ELEVATION_4} >
                <Layout.Grid col>
                    <Layout.Grid col height="40px" style={{ borderBottom: "1px solid #C9D0D5" }}>
                        <div className="pt-dialog-header" style={{ margin: 0 }}><Icon icon="cog" />
                            <h4 className="pt-dialog-header-title">Settings</h4>
                            <div className="pt-dialog-footer-actions" style={{ paddingRight: 10 }}>
                                <Button
                                    intent={Intent.SUCCESS}
                                    text="Save"
                                    style={{ paddingRight: 10 }}
                                    onClick={this.saveHandler.bind(this)}
                                />
                                <Button
                                    intent={Intent.DANGER}
                                    text="Cancel"
                                    onClick={this.cancelHandler.bind(this)}
                                />
                            </div>
                        </div>
                    </Layout.Grid>

                    <Layout.Grid row>
                        <Layout.Grid col width="200px">
                            {this.renderSectionList()}
                        </Layout.Grid>
                        <Layout.Grid width="10px" height="100%" background="white" style={{ borderLeft: "3px solid white" }}> </Layout.Grid>
                        <Layout.Grid col height="100%" width="100%" style={{ overflowY: "auto", overflow: "overlay" }}>
                            {this.renderSectionArea()}
                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
            </Layout.Grid>
        </Overlay>
    }
}