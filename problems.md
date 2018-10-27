## The problems that I have encountered

> 1. TypeError: fs.existsSync is not a function [Check Answer](https://github.com/electron/electron/issues/9920)

> 2. Error: Application entry file "build/electron.js" in the "xxx/Contents/Resources/app.asar"  
> **Answer** : Rename `main.js` to `electron.js` and move to `public` directory.

> 3. Unable to find **nedb** Generated database file `*.db` [Check Answer](https://github.com/louischatriot/nedb#browser-version)

<img alt="nedb" src="./nedb.png" width="300" style="display:inline-block;"/>

> 4. How to send an event from `Main process` to **multiple** `Render Process` ?  
> **Answer** : As we know, **main process** send event to **render process** by `window.webContents.send('event-name',...)`。So, we need a **Window Manager** to manage all the window instances, and **window needs to be created in `main process`。  
as we cannot get `child-window instance which created in render process` from `main process`** (mainProcess -> windowA -> windowB)

> 5. How to render different windows with only one `index.html` and react-router?  
> **Answer** : Every window has a method named `loadURL` or `loadFile`, and each window needs a `*.html` to load in **production**. but we have one and only `index.html` file. So, we need to do is changing router from `BrowserRouter` to `HashRouter`, for example `win.loadURL('file://xxx/index.html#some-router')`

> 6. Cannot copy and paste in electron. [Check Answer](https://pracucci.com/atom-electron-enable-copy-and-paste.html)