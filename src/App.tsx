import React, { useLayoutEffect, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import MenuItem from './types/MenuItem'
declare const MENU_ITEMS: MenuItem[]
const App: React.FC = () => {
  const [currentId, setCurrentId] = useState(MENU_ITEMS[0].id)
  useLayoutEffect(() => {
    const iframe = document.getElementsByTagName('IFRAME')[0] as HTMLIFrameElement
    iframe.onload = (() => {
      if (!iframe.allow.includes("clipboard-read")) {
        iframe.setAttribute("allow", iframe.allow + " clipboard-read;")
        iframe.src = iframe.src
      }
    })
  })

  const sandpackProps = MENU_ITEMS.find(menuItem => menuItem.id === currentId)
  return (
    <div style={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentId}
        onChange={(_e, newValue) => setCurrentId(newValue)}>
        {MENU_ITEMS.map(menuItem => {
          return (
            <Tab key={menuItem.id} label={menuItem.menuName} value={menuItem.id} sx={{ textTransform: 'none' }} />
          )
        })}
      </Tabs>
      <div style={{ flexGrow: 1 }}>
        <Sandpack {...sandpackProps} />
      </div>
    </div>
  )
}

export default App