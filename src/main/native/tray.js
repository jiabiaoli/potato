const path = require('path')
const {ipcMain, app, Menu, Tray} = require('electron')

let appIcon = null
app.on('ready',function () {
  const iconName = process.platform === 'win32' ? '/windows-icon.png' : '/iconTemplate.png'
  const iconPath = path.join(__static, iconName)
  appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([{
    label: '移除',
    click: () => {
      event.sender.send('tray-removed')
    }
  }])

  appIcon.setToolTip('在托盘中的 Electron 示例.')
  appIcon.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
})
