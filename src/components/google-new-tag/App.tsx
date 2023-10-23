import React, { memo, useCallback, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import Container from './Container'
import Tile, { TileProps } from './Tile'
import './styles.css'

const App: React.FC = () => {
  // const [dragging, setDragging] = useState(false)
  const [tiles, updateTiles] = useImmer([{
    key: 0,
    href: 'https://github.com/',
    'aria-label': 'GitHub'
  }, {
    key: 1,
    href: 'https://chat.openai.com/',
    'aria-label': 'ChatGPT'
  }, {
    key: 2,
    href: 'https://www.youtube.com/',
    'aria-label': 'YouTube'
  }, {
    key: 3,
    href: 'https://www.etymonline.com/',
    'aria-label': 'Etymonline'
  }, {
    key: 4,
    href: 'https://www.linkedin.com/',
    'aria-label': 'Linkedin'
  }, {
    key: 5,
    href: 'https://spring.io/guides/',
    'aria-label': 'Spring | Guides'
  }, {
    key: 6,
    href: 'https://vuejs.org/',
    'aria-label': 'Vue.js'
  }])

  return (
    <>
      <Container>
        {tiles.map(tile => (
          <Tile {...tile}/>
        ))}
      </Container>
    </>
  )
}

export default App
