const {
    app,
    Menu,
    Tray,
    BrowserWindow,
    BrowserView,
    nativeImage,
} = require('electron');
const {ipcMain} = require('electron')
const path = require('path');
const configHelper = require('./configHelper');
  
let tray = null;
let img = '';
let editWin = null;
let refreshWin = null;

app.dock.hide();

let baseMenu = [
    {label: '关于', type: 'normal', click: function() {
        let aboutWin = new BrowserWindow({ width: 250, height: 200});
        aboutWin.loadURL(`file://${__dirname}/app/about.html`);
    }},
    {label: '退出', type: 'normal', click: function() {
        app.quit();
    }},
];
let menuSeparator = [
    {
        type: 'separator',
    }
];
let configList = [];
let contextMenu = Menu.buildFromTemplate(baseMenu);


app.on('ready', () => {
    refreshWin = new BrowserWindow({width: 0, height: 0, frame: false}); //product
    // refreshWin = new BrowserWindow({width: 800, height: 600, frame: false});
    // refreshWin.webContents.openDevTools();
    refreshWin.on('closed', () => {
        // refreshWin = null
    })
    // 或加载本地HTML文件
    refreshWin.loadURL(`file://${__dirname}/app/refresh.html`);
    refreshWin.webContents.on('did-finish-load', ()=> {
        refreshConfig();
    });

    tray = new Tray(path.join(__dirname, '..', 'assets', 'images', 'info.png'));
    // tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

    ipcMain.on('refreshData', (event, arg) => {
        img = nativeImage.createFromDataURL(arg);
        tray.setImage(img);
        refreshWin.webContents.send('getInfo');
    })
    ipcMain.on('saveConfig', (event, arg) => {
        editWin.hide();
        configHelper.setConfig(arg).then((res) => {
            refreshConfig(res);
        }, (err) => {
            console.log(err);
        });
    });
    ipcMain.on('delConfig', (event, arg) => {
        editWin.hide();
        configHelper.delConfig(arg).then((res) => {
            refreshConfig(res);
        });
    });
    ipcMain.on('refreshInfo', (event, arg) => {
        // img = nativeImage.createFromDataURL(arg);
        // tray.setImage(img);
    });
    
});

function refreshConfig(list) {
    if (list) {
        configList = list;
        setTrayMenu();
        refreshWin.webContents.send('refreshConfig', configList.find(item => item.checked));
        return;
    }
    configHelper.getConfig().then((res) => {
        configList = res;
        setTrayMenu();
        refreshWin.webContents.send('refreshConfig', configList.find(item => item.checked));
    });
}

function edit(index) {
    console.log(index);
    editWin = new BrowserWindow({width: 1000, height: 800, frame: false});
    editWin.webContents.openDevTools();
    editWin.on('closed', () => {
        // editWin = null
    })
    // 或加载本地HTML文件
    editWin.loadURL(`file://${__dirname}/app/edit.html`);
    if (index != undefined) {
        let config = configList[index];
        editWin.webContents.on('did-finish-load', () => {
            editWin.webContents.send('config', config)
        });
    }
}

function refreshInfo(config) {
    
}

function setTrayMenu() {
    let configToMenu = [];
    let editMenu = [{
        type: configList.length > 0 ? 'submenu' : 'normal' ,
        submenu: [{
            label: '新增',
            type: 'normal',
            click() {
                edit();
            },
        }, {
            type: 'separator',
        }],
        label: configList.length > 0 ? '编辑' : '新增',
        click() {
            edit();
        },
    }];

    
    if (configList.length > 0) {
        editMenu[0].submenu.push();
    }
    
    for(let i = 0; i < configList.length; i++) {
        configToMenu.push({
            label: configList[i].title || '<未命名>',
            type: 'radio',
            checked: configList[i].checked,
            click(menuItem, browserWindow, event) {
                configHelper.selectConfig(configList[i]).then((res) => {
                    refreshConfig(res);
                });
            },
        });
        editMenu[0].submenu.push({
            label: configList[i].title || '<未命名>',
            type: 'normal',
            click() {
                edit(i);
            },
        });
    }
    contextMenu = Menu.buildFromTemplate(configToMenu.concat(menuSeparator).concat(editMenu).concat(baseMenu));
    tray.setContextMenu(contextMenu)
}