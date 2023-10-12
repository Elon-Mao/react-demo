'use client'

import React from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import MenuItem from './types/MenuItem'
declare const MENU_ITEMS: MenuItem[]

const App: React.FC = () => {
  console.log(MENU_ITEMS)
  return (
    <>
      <Sandpack template="react-ts" options={{
        editorHeight: 500
      }} files={MENU_ITEMS[0].files} customSetup={{
        dependencies: {
          "use-immer": "0.9.0",
          "immer": "10.0.3"
        }
      }} />
    </>
  )
}

export default App
