const {app, globalShortcut, BrowserWindow,dialog,ipcMain } = require('electron')
import Datastore from 'nedb'
import path from 'path'
let db=new Datastore({
    autoload: true,
    filename: path.join(app.getPath('userData'), '/data.db')
})

app.on('ready',()=>{
    db.findOne({"type":"settings"},(err,docs)=>{
        if(docs && docs.key){
            register(docs.key);
        }
    })
})
function register(key){
    const ret = globalShortcut.register(key, () => {
        let win=BrowserWindow.getFocusedWindow()
            if(win && win.isVisible()){
               app.hide()
            }else{
                console.info(win);
                app.show()
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


app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})
