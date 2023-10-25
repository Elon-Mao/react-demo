import React, { useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import Tile, { TileProps } from './Tile'
import './styles.css'

const App: React.FC = () => {
  const [tiles, updateTiles] = useImmer<TileProps[]>([{
    tileId: 0,
    href: 'https://github.com/',
    title: 'GitHub'
  }, {
    tileId: 1,
    href: 'https://chat.openai.com/',
    title: 'ChatGPT'
  }, {
    tileId: 2,
    href: 'https://www.youtube.com/',
    title: 'YouTube'
  }, {
    tileId: 3,
    href: 'https://www.etymonline.com/',
    title: 'Etymonline'
  }, {
    tileId: 4,
    href: 'https://www.linkedin.com/',
    title: 'Linkedin'
  }, {
    tileId: 5,
    href: 'https://spring.io/guides/',
    title: 'Spring | Guides'
  }, {
    tileId: 6,
    href: 'https://vuejs.org/',
    title: 'Vue.js'
  }].map((tile, index) => {
    return {
      ...tile,
      positionIndex: index
    }
  }))
  const [draggingId, setDraggingId] = useState<React.Key>()
  const containerRef = useRef<HTMLDivElement>(null)
  const lastIdRef = useRef<React.Key>(0)
  useEffect(() => {
    containerRef.current!.style.opacity = '1'
  }, [containerRef])

  const handleDragStart = (tileId: React.Key) => {
    lastIdRef.current = tileId
    setDraggingId(tileId)
    updateTiles(draft => {
      draft.forEach((tile, index) => {
        const tileRef = containerRef.current!.children[index] as HTMLDivElement
        tile.style = {
          position: 'fixed',
          left: tileRef.offsetLeft,
          top: tileRef.offsetTop,
        }
        tile.left = tileRef.offsetLeft
        tile.top = tileRef.offsetTop
      })
      const draggingStyle = draft.find(tile => tile.tileId === tileId)!.style!
      draggingStyle.zIndex = 1
      draggingStyle.transitionProperty = 'none'
      draggingStyle.backgroundColor = 'var(--tile-hover-color)'
      draggingStyle.pointerEvents = 'none'
      draggingStyle.cursor = 'default'
    })
  }

  const handleDragEnd = (tileId: React.Key) => {
    setDraggingId(undefined)
    updateTiles(draft => {
      const draggingIndex = draft.findIndex(tile => tile.tileId === tileId)
      const targetIndex = draft.findIndex(tile => tile.tileId === lastIdRef.current)
      draft.splice(targetIndex, 0, ...draft.splice(draggingIndex, 1))
      draft.forEach((tile, index) => {
        delete tile.style
        tile.positionIndex = index
      })
    })
  }

  const dragTile = (tileId: React.Key) => {
    lastIdRef.current = tileId
    updateTiles(draft => {
      const draggingTile = draft.find(tile => tile.tileId === draggingId)!
      const draggingIndex = draggingTile.positionIndex!
      const targetTile = draft.find(tile => tile.tileId === tileId)!
      const targetIndex = targetTile.positionIndex!
      const targetLeft = targetTile.left
      const targetTop = targetTile.top
      let i = targetIndex
      let tile0 = targetTile
      do {
        draggingIndex > targetIndex ? i++ : i--
        const tile1 = draft.find(tile => tile.positionIndex === i)!
        tile0.style!.left = tile1.left
        tile0.style!.top = tile1.top
        tile0.left = tile1.left
        tile0.top = tile1.top
        tile0.positionIndex = tile1.positionIndex
        tile0 = tile1
      } while (i !== draggingIndex)
      draggingTile.left = targetLeft
      draggingTile.top = targetTop
      draggingTile.positionIndex = targetIndex
    })
  }

  return (
    <div ref={containerRef} className='container'>
      {tiles.map(tile => (
        <Tile key={tile.tileId} {...tile} updateTiles={updateTiles} draggingId={draggingId}
          dragStart={handleDragStart} dragEnd={handleDragEnd} dragTile={dragTile} />
      ))}
    </div>
  )
}

export default App
