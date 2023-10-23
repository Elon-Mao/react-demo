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
  let top, height, colorTop, colorHeight, blankTop, blankHeight
  let left, width, colorLeft, colorWidth, blankLeft, blankWidth
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

  return (
    <>
      <div className="table-selection" style={{
        top,
        left,
        height,
        width
      }}>
        <div style={{
          top: colorTop,
          left: blankLeft,
          height: colorHeight,
          width: blankWidth
        }}></div>
        <div style={{
          top: blankTop,
          left: colorLeft,
          height: blankHeight,
          width: colorWidth
        }}></div>
        <div style={{
          top: colorTop,
          left: colorLeft,
          height: colorHeight,
          width: colorWidth
        }}></div>
      </div>
    </>
  )
}

export default ElonTableSelection;
