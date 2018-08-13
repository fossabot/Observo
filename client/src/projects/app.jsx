
import React, { Component } from 'react'
import { render } from 'react-dom'
const notifier = require('node-notifier');
import { Button, Intent, Spinner, Tree, ITreeNode, Tooltip, Icon, ProgressBar, Navbar, Alignment, ButtonGroup, Menu, MenuItem, Classes } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import { Window, TitleBar, Text } from 'react-desktop/windows';
import { Layout } from "crust"
import Draggable from 'react-draggable';

import { AppToaster } from "./toaster";
import DocTabs from "./components/doctabs/doctabs.jsx"

import io from 'socket.io-client';
require("babel-polyfill")

let plugin = require("./defined").PluginManager

let manager = new plugin()



export default class App extends Component {
    constructor() {
        super();
        this.newTab = () => { }
        /*Sidebar Stuff*/

        /*this.state.nodes*/

        this.state = {
            tabs: [],
            code: "console.log('hello');",
            bob: () => { return null}
        }
        this.socket = io('http://localhost:3000')
        let plugin = manager.addDefined("PLUGINS", "./plugins", false, [])
        let api = manager.addDefined("API", "./api", true, ["CLIENT"])  
        manager.appReady(() => {
          
        })
    }

    //DocTabs
    addTab() {
        let name = this.state.text
        let tabs = this.state.tabs
        tabs.push({ title: name })
        this.setState({ tabs: tabs })
    }
    docTabChange(tabs) {
        this.setState({ tabs: tabs })
    }
    closeTab(name) {
        console.log(name)
    }
    onSelected(name) {
        console.log(name)
    }

    // Button and Monoaco
    onChange(newValue, e) {
        if (newValue != this.state.code) {
            this.socket.emit('code', newValue);
        }

    }    //reders the component
    btnClick() {
        notifier.notify(
            {
              title: 'Observo',
              message: 'Update is Ready!',
              sound: true, // Only Notification Center or Windows Toasters
              wait: true // Wait with callback, until user action is taken against notification
            },
            function(err, response) {
              // Response is response from notification
            }
          );
        AppToaster.show({ message: "Toasted." });
    }

    updateText(event) {
        this.setState({ text: event.target.value })
    }
    editorDidMount(editor, monaco) {
        this.editor = editor
        console.log('editorDidMount', editor);
        editor.onDidChangeCursorSelection((data) => {
            console.log(data)
            if (data.selection.endColumn == data.selection.startColumn) {
                if (data.selection != this.state.selection) {
                    //this.socket.emit('selection', data);
                }
            }
            if (data.reason >= 3) {
                this.socket.emit('selection', data);
            }

        })
        var decorations = editor.deltaDecorations([], [
            //line, startColumn, emdline, endColumn
            { range: new monaco.Range(1, 1, 1, 10), options: { inlineClassName: 'user-selection' } }
        ]);
    }

    componentDidMount() {
        this.socket.on('code', (data) => {
            this.setState({ code: data })
        });
        this.socket.on('selection', (data) => {
            this.setState({ selection: data.selection })
        });
    }
    selection(data) {
        console.log(data)
    }
    render(props, state) {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <Window color="rgba(0, 153, 191, 0)" background="rgba(0, 153, 191, 1)">
                <TitleBar background="#00acd7" title={<span className="observo-text">OBSERVO</span>} controls />

                <Layout.Grid canvas>
                    <Layout.Grid row>
                        {/*Sidebar*/}
                        <Layout.Grid width="200px" height="100%" background="gray">

                            <Button onClick={this.btnClick} text="Procure toast Maybe" />
                            {this.state.bob()}
                        </Layout.Grid>

                        {/*User Bar*/}
                        <Layout.Grid col>
                            <Layout.Grid row height="50px">

                                {/*Doctabs*/}
                                <Layout.Grid background="lightblue">
                                    <DocTabs key="tabs" tabs={this.state.tabs} onChange={this.docTabChange.bind(this)} onSelect={this.onSelected.bind(this) } onClose={this.closeTab.bind()}/>
                                </Layout.Grid>
                                <Layout.Grid width="120px">
                                    <Navbar>
                                        <Navbar.Group align={Alignment.LEFT}>
                                            <Button className="pt-minimal" icon="user" />
                                            <Button className="pt-minimal" icon="notifications" />
                                            <Button className="pt-minimal" icon="cog" />
                                        </Navbar.Group>
                                    </Navbar>
                                </Layout.Grid>
                            </Layout.Grid>
                            <Layout.Grid>
                                <Button onClick={this.addTab.bind(this)} style={{ width: '100px' }}>+</Button>
                                <input className="pt-input" type="text" placeholder="Text input" onChange={this.updateText.bind(this)} dir="auto" />
                                
                            </Layout.Grid>
                        </Layout.Grid>
                    </Layout.Grid>
                </Layout.Grid>
            </Window>

        );

    }
}

