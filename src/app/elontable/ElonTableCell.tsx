import React, { useState } from 'react'
import { ColumnProps } from './ElonTableColumn'

export interface CellProps {
  data: any
  rowIndex: number
  columnProps: ColumnProps
  onUpdate: (rowIndex: number, dataKey: string, newValue: any) => void
}

const ElonTableCell: React.FC<CellProps> = ({
  data,
  rowIndex,
  columnProps,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(data[rowIndex][columnProps.dataKey])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onUpdate(rowIndex, columnProps.dataKey, inputValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="table-cell">{
      isEditing ? (
        <input
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          className="table-input" />) : (
        <div onDoubleClick={handleDoubleClick}>
          {inputValue}
        </div>
      )
    }</div>
  )
}

export default ElonTableCell
