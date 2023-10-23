import React, { memo, useEffect, useRef } from 'react'

export interface ContainerProps {
  children: React.ReactNode
}

const ElonSliderContainer: React.FC<ContainerProps> = memo(({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current!.style.opacity = '1'
  }, [containerRef])

  return (
    <div ref={containerRef} className='container'>
      {children}
    </div>
  )
})

export default ElonSliderContainer
