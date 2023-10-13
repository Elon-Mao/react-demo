import React, { useEffect, useState } from 'react'
import { AnyArray, Column } from './ElonTable'
import { UpdateFunction } from './use-undo-redo'

export interface CellProps {
  tableData: any
  rowIndex: number
  column: Column
  updateTableData: UpdateFunction<AnyArray>
}

const ElonTableCell: React.FC<CellProps> = ({
  tableData,
  rowIndex,
  column,
  updateTableData
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(tableData[rowIndex][column.dataKey])

  useEffect(() => setInputValue(tableData[rowIndex][column.dataKey]), [tableData, rowIndex, column])

  const handleBlur = () => {
    setIsEditing(false)
    updateTableData(draft => {
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
}

export default ElonTableCell
