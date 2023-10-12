const menuItems = []
const fs = require('fs')
const path = require('path')
fs.readdirSync(__dirname).forEach((component) => {
  if (component === 'menu.js') {
    return
  }
  const menuItemFiles = {}
  const componentPath = path.join(__dirname, component)
  fs.readdirSync(componentPath).forEach((file) => {
    const filePath = path.join(componentPath, file)
    const fileData = fs.readFileSync(filePath, 'utf8').replaceAll('\r', '')
    if (file === 'info.json') {
      const jsonData = JSON.parse(fileData)
      jsonData.files = menuItemFiles
      menuItems.push(jsonData)
    } else {
      menuItemFiles[file] = {
        code: fileData
      }
    }
  })
  menuItemFiles['App.tsx'].active = true
})
module.exports = menuItems.sort((menuItem1, menuItem2) => menuItem1.id - menuItem2.id)