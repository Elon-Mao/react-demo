import React, { useEffect, useState } from 'react'
import { ColumnOption } from './ElonTable'

export interface CellProps {
  data: any
  rowIndex: number
  columnOption: ColumnOption
  onUpdate: (rowIndex: number, dataKey: string, newValue: any) => void
}

const ElonTableCell: React.FC<CellProps> = ({
  data,
  rowIndex,
  columnOption,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(data[rowIndex][columnOption.dataKey])

  useEffect(() => {
    setInputValue(data[rowIndex][columnOption.dataKey])
  }, [data, rowIndex, columnOption])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onUpdate(rowIndex, columnOption.dataKey, inputValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="table-cell" onDoubleClick={handleDoubleClick}>{
      isEditing || columnOption.type !== 'text' ? (
        <input
          value={inputValue}
          type={columnOption.type}
          onChange={handleChange}
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
