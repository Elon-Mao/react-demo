import React from 'react'

interface CellWrapper {
  rowIndex: number
  columnIndex: number
  target: HTMLDivElement
}

export interface TableSelection {
  mouseDownCell: CellWrapper
  mouseMoveCell: CellWrapper
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
  const mouseMoveCellRef = selection.mouseMoveCell.target
  let top, height, colorTop, colorHeight, blankTop, blankHeight
  let left, width, colorLeft, colorWidth, blankLeft, blankWidth
  if (selection.mouseDownCell.rowIndex > selection.mouseMoveCell.rowIndex) {
    blankTop = mouseDownCellRef.offsetTop - mouseMoveCellRef.offsetTop
    blankHeight = mouseDownCellRef.clientHeight
    top = mouseMoveCellRef.offsetTop
    height = blankTop + blankHeight
    colorTop = 0
    colorHeight = blankTop
  } else {
    blankTop = 0
    blankHeight = mouseDownCellRef.clientHeight
    top = mouseDownCellRef.offsetTop
    height = mouseMoveCellRef.offsetTop - mouseDownCellRef.offsetTop + mouseMoveCellRef.clientHeight
    colorTop = blankHeight
    colorHeight = height - blankHeight
  }
  if (selection.mouseDownCell.columnIndex > selection.mouseMoveCell.columnIndex) {
    blankLeft = mouseDownCellRef.offsetLeft - mouseMoveCellRef.offsetLeft
    blankWidth = mouseDownCellRef.clientWidth
    left = mouseMoveCellRef.offsetLeft
    width = blankLeft + blankWidth
    colorLeft = 0
    colorWidth = blankLeft
  } else {
    blankLeft = 0
    blankWidth = mouseDownCellRef.clientWidth
    left = mouseDownCellRef.offsetLeft
    width = mouseMoveCellRef.offsetLeft - mouseDownCellRef.offsetLeft + mouseMoveCellRef.clientWidth
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
