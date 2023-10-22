import React, { RefObject, memo, useEffect, useState } from 'react'
import { Column, ElonTableRef } from './ElonTable'

export interface CellProps {
  value: any
  rowIndex: number
  column: Column
  elonTableRef: RefObject<ElonTableRef>
}

const ElonTableCell: React.FC<CellProps> = memo(({
  value,
  rowIndex,
  column,
  elonTableRef
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => setInputValue(value), [value])

  const handleBlur = () => {
    setIsEditing(false)
    elonTableRef.current!.updateTableData(draft => {
      draft[rowIndex][column.dataKey] = inputValue
    })
  }

  return (
    <div className="table-cell" onDoubleClick={() => setIsEditing(true)}>{
      isEditing || column.type !== 'text' ? (
        <input
          value={inputValue}
          type={column.type}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus={isEditing}
          className="table-input" />) : (
        <div title={inputValue}>
          {inputValue}
        </div>
      )
    }</div>
  )
})

export default ElonTableCell
