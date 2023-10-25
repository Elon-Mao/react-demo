import React from 'react'

interface CellWrapper {
  rowIndex: number
  columnIndex: number
  target: HTMLDivElement
}

export interface TableSelection {
  mouseDownCell: CellWrapper
  mouseEnterCell: CellWrapper
}

interface TableSelectionProps {
  selection?: TableSelection
}

const ElonTableSelection: React.FC<TableSelectionProps> = ({ selection }) => {
  if (!selection) {
    return (
      <></>
    )
  }
  const mouseDownCellRef = selection.mouseDownCell.target
  const mouseEnterCellRef = selection.mouseEnterCell.target
  let left, width, colorLeft, colorWidth, blankLeft, blankWidth
  let top, height, colorTop, colorHeight, blankTop, blankHeight
  if (selection.mouseDownCell.columnIndex > selection.mouseEnterCell.columnIndex) {
    blankLeft = mouseDownCellRef.offsetLeft - mouseEnterCellRef.offsetLeft
    blankWidth = mouseDownCellRef.clientWidth
    left = mouseEnterCellRef.offsetLeft
    width = blankLeft + blankWidth
    colorLeft = 0
    colorWidth = blankLeft
  } else {
    blankLeft = 0
    blankWidth = mouseDownCellRef.clientWidth
    left = mouseDownCellRef.offsetLeft
    width = mouseEnterCellRef.offsetLeft - mouseDownCellRef.offsetLeft + mouseEnterCellRef.clientWidth
    colorLeft = blankWidth
    colorWidth = width - blankWidth
  }
  if (selection.mouseDownCell.rowIndex > selection.mouseEnterCell.rowIndex) {
    blankTop = mouseDownCellRef.offsetTop - mouseEnterCellRef.offsetTop
    blankHeight = mouseDownCellRef.clientHeight
    top = mouseEnterCellRef.offsetTop
    height = blankTop + blankHeight
    colorTop = 0
    colorHeight = blankTop
  } else {
    blankTop = 0
    blankHeight = mouseDownCellRef.clientHeight
    top = mouseDownCellRef.offsetTop
    height = mouseEnterCellRef.offsetTop - mouseDownCellRef.offsetTop + mouseEnterCellRef.clientHeight
    colorTop = blankHeight
    colorHeight = height - blankHeight
  }

  return (
    <div className="table-selection" style={{
      left,
      top,
      width,
      height
    }}>
      <div style={{
        left: blankLeft,
        top: colorTop,
        width: blankWidth,
        height: colorHeight
      }}></div>
      <div style={{
        left: colorLeft,
        top: blankTop,
        width: colorWidth,
        height: blankHeight
      }}></div>
      <div style={{
        left: colorLeft,
        top: colorTop,
        width: colorWidth,
        height: colorHeight
      }}></div>
    </div>
  )
}

export default ElonTableSelection
