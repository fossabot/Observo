#Observo Client

The Observo Client is a Electron based app, running on React and Socket IO built with Webpack. It allows projects to be created with use of **pages**. Pages are the plugin base of Observo. It allows for communication with the direct API of observo for sleek integration with storage, sockets and visuals.


### Main Dependents
- electron
- socket.io
- react
- import-window
- classnames
- crust
- blueprintjs
- react-desktop
- redux??
- monoaco

### Included Dependents (for Plugin API)
- flowchart.js
- ???


## Overview


- Observo Explore (tbd)
    - Shows server and local projects to open
- Observo Encase
    - The main editor where all the pages are loaded and all API calls are directly used from the server.
        
### Explore
    ??

### Encase

When loading up a server, you select a project, from that it will check the dependencies requried for usage from the OPM (Observo Package Manager??).
After that we load the Encase Editor.

The encase editor is where all of the main code is in place. It loads all pages via the plugin system which is direclty binded to the Observo API. This API is also linked to the server connect to it. So the pages needs a backend and frontend file for any pages to work.


## Observo API
The basic of the API that the server and client will use to conummnicate. This is just a little snippet of what it may look like.
- Observo
    - User (Server)
        - Group
            - Root [No one usually, for dev]
            - Master [Server owner or operator]
            - ... Create your own (or let plugins do it for you)
    - Project 
        - Storage (Sever)
            - Create Table
            - Basic MySQL syntax
        - Realtime (Server and Cleint)
            - Hook on to events, have call backs, @Socket.io
        - Console (Server and Client)
            - Add Commands to be ran (runs only a server code)
        - JSO (Runs on Server, edit on client)
            - Allow for data returns in usage of JSO Bindings
                - Example: TBA API plugin for server, which can return data to be used for updating a table for example.
        - Visual Data (Client)
            - React Syntax using Blueprint and Crust.
            - Anything can be used but REF aren't allow (maybe?)
            - Sandbox so no document code and be injected and same for anything else really. 
    - Settings (Server and Client)
        - Settings
            - ?
        - Visual - [Show settings in client settings if user ]
    