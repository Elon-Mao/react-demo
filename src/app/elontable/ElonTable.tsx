import React, { ReactNode, useState, useEffect, useMemo, useRef } from 'react'
import { Patch } from 'immer'
import { useUndoRedo } from './use-undo-redo'
import { ColumnProps, columnDefaultProps } from './ElonTableColumn'
import ElonTableSelection, { TableSelection } from './ElonTableSelection'
import './styles.css'

interface TableProps {
  data: any
  children: ReactNode
  onUpdateData: (patches: Patch[]) => void
}

const ElonTable: React.FC<TableProps> = ({ data, children, onUpdateData }) => {
  const [tableData, updateTableData, undoTableData, redoTableData] = useUndoRedo(data, onUpdateData)
  const [selection, setSelection] = useState<TableSelection>()
  const tableDateRef = useRef(tableData)
  tableDateRef.current = tableData
  const selectionRef = useRef(selection)
  selectionRef.current = selection
  const selecting = useRef(false)

  useEffect(() => {
    const handleMouseDown = () => {
      console.log('clear select')
    }
    const handleMouseUp = () => {
      selecting.current = false
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'c':
            if (selectionRef.current) {
              navigator.clipboard.writeText('qwer')
            }
            break
          case 'z':
            if (event.target === document.body) {
              undoTableData()
            }
            break
          case 'y':
            if (event.target === document.body) {
              redoTableData()
            }
            break
        }
      }
    }
    addEventListener('mousedown', handleMouseDown)
    addEventListener('mouseup', handleMouseUp)
    addEventListener('keydown', handleKeyDown)
    return () => {
      removeEventListener('mousedown', handleMouseDown)
      removeEventListener('mouseup', handleMouseUp)
      removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const columns = useMemo(() => (React.Children.toArray(children) as React.ReactElement<ColumnProps>[])
    .map((column) => React.cloneElement(column, Object.assign({}, columnDefaultProps, column.props))), [children])

  const onUpdate = (rowIndex: number, dataKey: string, newValue: any) => {
    updateTableData(draft => {
      draft[rowIndex][dataKey] = newValue
    })
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
    event.stopPropagation()
    selecting.current = true
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
    if (!selecting.current) {
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
    <div className="table">
      <ElonTableSelection selection={selection}></ElonTableSelection>
      <div className="table-head">
        {columns}
      </div>
      <div className="table-body">
        {tableData.map((_row: any, rowIndex: number) => (
          <div className="table-row" key={rowIndex}>
            {columns.map((column, columnIndex) => {
              const CellRender = column.props.cellRender!
              return (
                <div className="table-cell-wrapper" style={{ width: column.props.width }} key={columnIndex}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, columnIndex)}
                  onMouseMove={(e) => handleMouseMove(e, rowIndex, columnIndex)}>
                  <CellRender data={tableData} rowIndex={rowIndex} columnProps={column.props} onUpdate={onUpdate} />
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
