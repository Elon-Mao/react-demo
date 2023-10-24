import React, { useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import Tile, { TileProps } from './Tile'
import './styles.css'

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastIdRef = useRef<React.Key>(0)

  useEffect(() => {
    containerRef.current!.style.opacity = '1'
  }, [containerRef])

  const [tiles, updateTiles] = useImmer<TileProps[]>([{
    tileId: 0,
    href: 'https://github.com/',
    'aria-label': 'GitHub'
  }, {
    tileId: 1,
    href: 'https://chat.openai.com/',
    'aria-label': 'ChatGPT'
  }, {
    tileId: 2,
    href: 'https://www.youtube.com/',
    'aria-label': 'YouTube'
  }, {
    tileId: 3,
    href: 'https://www.etymonline.com/',
    'aria-label': 'Etymonline'
  }, {
    tileId: 4,
    href: 'https://www.linkedin.com/',
    'aria-label': 'Linkedin'
  }, {
    tileId: 5,
    href: 'https://spring.io/guides/',
    'aria-label': 'Spring | Guides'
  }, {
    tileId: 6,
    href: 'https://vuejs.org/',
    'aria-label': 'Vue.js'
  }])
  const [draggingId, setDraggingId] = useState<React.Key>()

  const handleDragStart = (tileId: React.Key) => {
    setDraggingId(tileId)
    updateTiles(draft => {
      draft.forEach((tile, index) => {
        const tileRef = containerRef.current!.children[index] as HTMLDivElement
        tile.style = {
          position: 'fixed',
          top: tileRef.offsetTop,
          left: tileRef.offsetLeft
        }
        tile.positionIndex = index
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
    updateTiles(draft => {
      draft.forEach(tile => {
        delete tile.style
      })
      const draggingIndex = draft.findIndex(tile => tile.tileId === tileId)
      const targetIndex = draft.findIndex(tile => tile.tileId === lastIdRef.current)
      console.log(tileId, draggingIndex, targetIndex)
      draft.splice(targetIndex, 0, ...draft.splice(draggingIndex, 1))
    })
    setDraggingId(undefined)
  }

  const dragTile = (tileId: React.Key) => {
    lastIdRef.current = tileId
    containerRef.current!.style.pointerEvents = 'none'
    setTimeout(() => {
      containerRef.current!.style.pointerEvents = "auto"
    }, 300);
    updateTiles(draft => {
      const draggingTile = draft.find(tile => tile.tileId === draggingId)!
      const draggingIndex = draggingTile.positionIndex!
      const targetTile = draft.find(tile => tile.tileId === tileId)!
      const targetIndex = targetTile.positionIndex!
      const targetLeft = targetTile.style!.left
      const targetTop = targetTile.style!.top
      let i = targetIndex
      let tile0 = targetTile
      do {
        draggingIndex > targetIndex ? i++ : i--
        const tile1 = draft.find(tile => tile.positionIndex === i)!
        tile0.style!.left = tile1.style!.left
        tile0.style!.top = tile1.style!.top
        tile0.positionIndex = tile1.positionIndex
        tile0 = tile1
      } while (i !== draggingIndex)
      draggingTile.style!.left = targetLeft
      draggingTile.style!.top = targetTop
      draggingTile.positionIndex = targetIndex
    })
  }

  return (
    <>
      <div ref={containerRef} className='container'>
        {tiles.map(tile => (
          <Tile key={tile.tileId} {...tile} updateTiles={updateTiles} draggingId={draggingId}
            dragStart={handleDragStart} dragEnd={handleDragEnd} dragTile={dragTile} />
        ))}
      </div>
    </>
  )
}

export default App
