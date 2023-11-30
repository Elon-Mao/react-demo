import fs from 'fs'
import path from 'path'
import { SandpackFile } from '@codesandbox/sandpack-react'
import MenuItem from '../types/MenuItem'

const defaultOptions = {
  template: "react-ts",
  options: {
    editorHeight: 'calc(100vh - 80px)'
  }
}

export default function generateMenu() {
  const menuItems: MenuItem[] = []
  fs.readdirSync(__dirname).forEach((component: string) => {
    if (component === 'menu.ts') {
      return
    }
    const menuItemFiles = {} as Record<string, SandpackFile>
    const componentPath = path.join(__dirname, component)
    fs.readdirSync(componentPath).forEach((file: string) => {
      const filePath = path.join(componentPath, file)
      const fileData = fs.readFileSync(filePath, 'utf8').replaceAll('\r', '')
      if (file === 'info.json') {
        const jsonData = Object.assign({}, defaultOptions, JSON.parse(fileData))
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
  return menuItems.sort((menuItem1, menuItem2) => menuItem1.id - menuItem2.id)
}