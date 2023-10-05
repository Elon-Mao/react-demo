import React, { ReactNode, useState, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { ColumnProps, columnDefaultProps } from './ElonTableColumn'
import ElonTableSelection, { TableSelection } from './ElonTableSelection'
import './styles.css'

interface TableProps {
  data: any
  children: ReactNode
  onUpdateData: (newData: any) => void
}

let selecting = false

const ElonTable: React.FC<TableProps> = ({ data, children, onUpdateData }) => {
  const [selection, setSelection] = useState<TableSelection>()
  const [copyText, setCopyText] = useState('')

  useEffect(() => {
    const handleMouseDown = () => {
      console.log('clear select')
    }
    const handleMouseUp = () => {
      selecting = false
    }
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c' && selection) {
        setCopyText('abcdef')
      }
    }
    addEventListener('mousedown', handleMouseDown)
    addEventListener('mouseup', handleMouseUp)
    addEventListener('keydown', handleKeydown)
    return () => {
      removeEventListener('mousedown', handleMouseDown)
      removeEventListener('mouseup', handleMouseUp)
      removeEventListener('keydown', handleKeydown)
    }
  }, [])

  const columns = useMemo(() => (React.Children.toArray(children) as React.ReactElement<ColumnProps>[])
    .map((column) => React.cloneElement(column, Object.assign({}, columnDefaultProps, column.props))), [children])

  const onUpdate = (rowIndex: number, dataKey: string, newValue: any) => {
    const newData = [...data]
    newData[rowIndex][dataKey] = newValue
    onUpdateData(newData)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
    event.stopPropagation()
    selecting = true
    const cell = {
      rowIndex,
      columnIndex,
      target: event.currentTarget
    }
    setSelection({
      mouseDownCell: cell,
      mouseMoveCell: cell
    })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
    if (!selecting) {
      return
    }
    setSelection({
      mouseDownCell: selection!.mouseDownCell,
      mouseMoveCell: {
        rowIndex,
        columnIndex,
        target: event.currentTarget
      }
    })
  }

  return (
    <div className="table" >
      <ElonTableSelection selection={selection} copyText={copyText}></ElonTableSelection>
      <div className="table-head">
        {columns}
      </div>
      <div className="table-body">
        {data.map((_row: any, rowIndex: number) => (
          <div className="table-row" key={rowIndex}>
            {columns.map((column, columnIndex) => {
              const CellRender = column.props.cellRender!
              return (
                <div className="table-cell-wrapper" style={{ width: column.props.width }} key={columnIndex}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, columnIndex)}
                  onMouseMove={(e) => handleMouseMove(e, rowIndex, columnIndex)}>
                  <CellRender data={data} rowIndex={rowIndex} columnProps={column.props} onUpdate={onUpdate} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ElonTable
