import { app, BrowserWindow,globalShortcut,dialog,ipcMain,clipboard  } from 'electron'
const path = require('path')

import Datastore from 'nedb'
let db=new Datastore({
  autoload: true,
  filename: path.join(app.getPath('userData'), '/data.db')
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
  function createWindow () {

  mainWindow = new BrowserWindow({
    height: 385,
    useContentSize: true,
    width: 500,
    webPreferences:{
      webSecurity:false
    },
    resizable:false,
    maximizable:false
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
     mainWindow=null
  })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

function loadModules() {
    require('./native/tray.js')
    require('./native/menu.js')
}
loadModules()


app.on('ready',()=>{
  db.findOne({"type":"settings"},(err,docs)=>{
    if(docs && docs.key){
      register(docs.key);
    }
  })
})
function register(key){
  const ret = globalShortcut.register(key, () => {
     if(mainWindow.isFocused()){
       mainWindow.hide()
     }else{
       db.findOne({type:'settings'},(err,docs)=>{
         if(docs && docs.plate==true){
           let q=clipboard.readText()
           mainWindow.webContents.send('translate',q)
         }
       })
       mainWindow.show()
     }
  })
  if (!ret) {
    dialog.showErrorBox("信息提示","快捷键["+key+"]注册失败")
  }
}
ipcMain.on('key',(event,args)=>{
  globalShortcut.unregisterAll()
  register(args.key);
})

ipcMain.on('copy',(event,args)=>{
   if(args){
     clipboard.writeText(args)
   }
})


app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})


