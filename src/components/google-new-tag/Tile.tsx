import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'

export interface TileProps extends React.HTMLProps<HTMLAnchorElement> {
  key: React.Key
}

const Tile: React.FC<TileProps> = memo(({
  'aria-label': ariaLabel,
  href
}) => {
  const [dragging, setDragging] = useState(false)
  const [style, updateStyle] = useImmer<React.CSSProperties>({})
  const tileRef = useRef<HTMLDivElement>(null)
  const isMoved = useRef(false)
  const originalTop = useRef(0)
  const originalLeft = useRef(0)
  const originalX = useRef(0)
  const originalY = useRef(0)

  const HandleMouseEnter = () => {
    updateStyle(draft => {
      draft.backgroundColor = 'var(--tile-hover-color)'
    })
  }

  const handleMouseLeave = () => {
    updateStyle(draft => {
      if (draft.transitionProperty !== 'none') {
        draft.backgroundColor = undefined
      }
    })
  }

  const handleMouseUp = useCallback(() => {
    removeEventListener('mouseup', handleMouseUp)
    removeEventListener('mousemove', handleMouseMove)
    if (!isMoved.current) {
      window.open(href)
    }
    setDragging(false)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const difX = event.clientX - originalX.current
    const difY = event.clientY - originalY.current
    if (!isMoved.current) {
      if (difX > 2 || difY > 2) {
        isMoved.current = true
      }
    }
    updateStyle(draft => {
      draft.top = originalTop.current + difY
      draft.left = originalLeft.current + difX
    })
  }, [])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true)
    isMoved.current = false
    originalTop.current = event.currentTarget.offsetTop
    originalLeft.current = event.currentTarget.offsetLeft
    originalX.current = event.clientX
    originalY.current = event.clientY
    addEventListener('mouseup', handleMouseUp)
    addEventListener('mousemove', handleMouseMove)
    updateStyle(draft => {
      draft.transitionProperty = 'none'
      draft.position = 'absolute'
      draft.top = originalTop.current
      draft.left = originalLeft.current
    })
  }

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  console.log(style)

  return (
    <>
      <div ref={tileRef} className="tile" title={ariaLabel} style={style}
        onMouseEnter={HandleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleClick}>
        <div className="tile-icon">
          <img draggable="false" src={`https://www.google.com/s2/favicons?domain=${href}&sz=128`} />
        </div>
        <div className="tile-title">
          <span>{ariaLabel}</span>
        </div>
      </div>
      {
        dragging ? <div className="tile" /> : <></>
      }
    </>
  )
})

export default Tile
