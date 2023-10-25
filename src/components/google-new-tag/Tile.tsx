import React, { useEffect, useRef } from 'react'
import { Updater } from 'use-immer'

export interface TileProps extends React.HTMLProps<HTMLDivElement> {
  tileId: React.Key
  left?: number
  top?: number
  positionIndex?: number
}

export interface TilePropsEx extends TileProps {
  updateTiles: Updater<TileProps[]>
  draggingId: React.Key | undefined
  dragStart: (tileId: React.Key) => void
  dragTile: (tileId: React.Key) => void
  dragEnd: (tileId: React.Key) => void
}

const Tile: React.FC<TilePropsEx> = ({
  title,
  href,
  style,
  tileId,
  positionIndex,
  updateTiles,
  draggingId,
  dragStart,
  dragTile,
  dragEnd
}) => {
  const tileRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef(false)
  useEffect(() => {
    transitionRef.current = true
    setTimeout(() => {
      transitionRef.current = false
    }, 300)
  }, [positionIndex])

  const HandleMouseEnter = () => {
    if (transitionRef.current) {
      return
    }
    updateTiles(draft => {
      if (draggingId === undefined) {
        draft.find(tile => tile.tileId === tileId)!.style = {
          backgroundColor: 'var(--tile-hover-color)'
        }
      } else {
        dragTile(tileId)
      }
    })
  }

  const handleMouseLeave = () => {
    if (draggingId === undefined) {
      updateTiles(draft => {
        delete draft.find(tile => tile.tileId === tileId)!.style
      })
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const mousedownLeft = event.currentTarget.offsetLeft
    const mousedownTop = event.currentTarget.offsetTop
    const mousedownX = event.clientX
    const mousedownY = event.clientY
    let isMoved = false

    const handleMouseUp = () => {
      removeEventListener('mouseup', handleMouseUp)
      removeEventListener('mousemove', handleMouseMove)
      if (!isMoved) {
        window.open(href)
      }
      dragEnd(tileId)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const difX = event.clientX - mousedownX
      const difY = event.clientY - mousedownY
      if (!isMoved) {
        if (Math.abs(difX) > 2 || Math.abs(difY) > 2) {
          isMoved = true
        }
      }
      tileRef.current!.style.left = mousedownLeft + difX + 'px'
      tileRef.current!.style.top = mousedownTop + difY + 'px'
    }

    addEventListener('mouseup', handleMouseUp)
    addEventListener('mousemove', handleMouseMove)
    dragStart(tileId)
  }

  return (
    <div key={tileId} ref={tileRef} className="tile" title={title} style={style}
      onMouseEnter={HandleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}>
      <div className="tile-icon">
        <img draggable="false" src={`https://www.google.com/s2/favicons?domain=${href}&sz=24`} />
      </div>
      <div className="tile-title">
        <span>{title}</span>
      </div>
    </div>
  )
}

export default Tile
