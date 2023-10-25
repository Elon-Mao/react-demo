import React, { useLayoutEffect, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Link from '@mui/material/Link'
import reactLogo from './assets/react.svg'
import MenuItem from './types/MenuItem'
import './App.css'
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
    <div>
      <AppBar>
        <Toolbar>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Live React Demo
          </Typography>
          <Link href="https://elon-mao.github.io/vue-demo/" variant="h6" color="inherit" target="_blank">
            Vue Demo
          </Link>
        </Toolbar>
      </AppBar>
      <div className='main'>
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
    </div>
  )
}

export default App