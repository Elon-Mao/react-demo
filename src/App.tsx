import React, { useLayoutEffect, useState } from 'react'
import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react'
import MenuItem from './types/MenuItem'
// import TableApp from './components/elontable/App'
declare const MENU_ITEMS: MenuItem[]
const App: React.FC = () => {

  const [sandpackProps, setSandpackProps] = useState<SandpackProps>(MENU_ITEMS[0])

  useLayoutEffect(() => {
    const iframe = document.getElementsByTagName('IFRAME')[0] as HTMLIFrameElement
    iframe.onload = (() => {
      if (!iframe.allow.includes("clipboard-read")) {
        iframe.setAttribute("allow", iframe.allow + " clipboard-read;")
        iframe.src = iframe.src
      }
    })
  })

  return (
    <>
      <Sandpack {...sandpackProps} />
    </>
  )
}

export default App