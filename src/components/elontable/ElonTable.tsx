import { forwardRef, useState, useEffect, useRef, Dispatch, SetStateAction, useCallback, useImperativeHandle, useMemo, createElement, RefObject, memo } from 'react'
import { Patch } from 'immer'
import { useImmer } from 'use-immer'
import { UpdateFunction, useUndoRedo } from './use-undo-redo'
import ElonTableCell, { CellProps } from './ElonTableCell'
import ElonTableHeader from './ElonTableHeader'
import ElonTableSelection, { TableSelection } from './ElonTableSelection'
import './styles.css'

export type AnyArray = Array<any>

export interface Column {
  dataKey: string
  width?: string | number
  type?: string
  headerRender?: React.FC<Column>
  cellRender?: React.FC<CellProps>
}

export interface TableProps {
  columns: Column[]
  tableData: AnyArray
  onChange?: (patches: Patch[]) => void
}

export interface ElonTableRef {
  columns: Column[]
  updateColumns: UpdateFunction<Column[]>
  tableData: AnyArray
  updateTableData: UpdateFunction<AnyArray>
  undoTableData: () => void
  redoTableData: () => void
  selection: TableSelection | undefined
  setSelection: Dispatch<SetStateAction<TableSelection | undefined>>
  copyTable: () => void
  pasteTable: () => void
  selectAll: () => void
}

const ElonTable = memo(forwardRef<ElonTableRef, TableProps>((props, ref) => {
  const columnsInitial: Column[] = useMemo(() => props.columns.map(column => Object.assign({}, {
    width: 200,
    type: 'text',
    headerRender: ElonTableHeader,
    cellRender: ElonTableCell
  }, column)), [])
  const [columns, updateColumns] = useImmer(columnsInitial)
  const [tableData, updateTableData, undoTableData, redoTableData] = useUndoRedo(props.tableData, props.onChange)
  const [selection, setSelection] = useState<TableSelection>()
  const tableRef = useRef<HTMLDivElement>(null)
  const selecting = useRef(false)
  const undoAndClear = useCallback(() => {
    undoTableData()
    setSelection(undefined)
  }, [])
  const redoAndClear = useCallback(() => {
    redoTableData()
    setSelection(undefined)
  }, [])
  useEffect(() => {
    const handleMouseDown = () => {
      setSelection(undefined)
    }
    const handleMouseUp = () => {
      selecting.current = false
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.target === document.body) {
        switch (event.key) {
          case 'c':
            elonTableRef.current!.copyTable()
            break
          case 'v':
            elonTableRef.current!.pasteTable()
            break
          case 'z':
            elonTableRef.current!.undoTableData()
            break
          case 'y':
            elonTableRef.current!.redoTableData()
            break
          case 'a':
            event.preventDefault()
            elonTableRef.current!.selectAll()
            break
        }
      }
    }
    addEventListener('mousedown', handleMouseDown, true)
    addEventListener('mouseup', handleMouseUp)
    addEventListener('keydown', handleKeyDown)
    return () => {
      removeEventListener('mousedown', handleMouseDown)
      removeEventListener('mouseup', handleMouseUp)
      removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const elonTableRef = ref as RefObject<ElonTableRef>
  const copyTable = () => {
    if (!selection) {
      return
    }
    let row0 = selection.mouseDownCell.rowIndex
    let row1 = selection.mouseEnterCell.rowIndex
    if (row0 > row1) {
      [row0, row1] = [row1, row0]
    }
    let column0 = selection.mouseDownCell.columnIndex
    let column1 = selection.mouseEnterCell.columnIndex
    if (column0 > column1) {
      [column0, column1] = [column1, column0]
    }
    navigator.clipboard.writeText(tableData.slice(row0, row1 + 1)
      .map(row => columns.slice(column0, column1 + 1)
        .map(column => row[column.dataKey]).join('\t')).join('\n'))
  }
  const pasteTable = () => {
    if (!selection) {
      return
    }
    const row0 = selection.mouseDownCell.rowIndex
    const column0 = selection.mouseDownCell.columnIndex
    navigator.clipboard.readText().then(clipText => {
      updateTableData(draft => {
        clipText.split(/[\n\r?]+/).forEach((line, lineIndex) => {
          if (!line) {
            return
          }
          const rowIndex = row0 + lineIndex
          if (draft[rowIndex] === undefined) {
            draft[rowIndex] = {}
          }
          line.split('\t').forEach((text, textIndex) => {
            const columnIndex = column0 + textIndex
            if (columnIndex < columns.length) {
              draft[rowIndex][columns[columnIndex].dataKey] = text
            }
          })
        })
      })
    })
  }
  const selectAll = () => {
    const tableBody = tableRef.current!.lastElementChild!
    const maxRow = tableData.length - 1
    const maxColumn = columns.length - 1
    setSelection({
      mouseDownCell: {
        rowIndex: 0,
        columnIndex: 0,
        target: tableBody.children[0].children[0] as HTMLDivElement
      },
      mouseEnterCell: {
        rowIndex: maxRow,
        columnIndex: maxColumn,
        target: tableBody.children[maxRow].children[maxColumn] as HTMLDivElement
      }
    })
  }
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
    selecting.current = true
    const cell = {
      rowIndex,
      columnIndex,
      target: event.currentTarget
    }
    setSelection({
      mouseDownCell: cell,
      mouseEnterCell: cell
    })
  }
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, rowIndex: number, columnIndex: number) => {
    if (!selecting.current) {
      return
    }
    setSelection({
      mouseDownCell: selection!.mouseDownCell,
      mouseEnterCell: {
        rowIndex,
        columnIndex,
        target: event.currentTarget
      }
    })
  }

  useImperativeHandle(ref, () => {
    return {
      columns,
      updateColumns,
      tableData,
      updateTableData,
      undoTableData: undoAndClear,
      redoTableData: redoAndClear,
      selection,
      setSelection,
      copyTable,
      pasteTable,
      selectAll
    }
  }, [columns, tableData, selection])

  return (
    <div className="table" ref={tableRef}>
      <ElonTableSelection selection={selection}></ElonTableSelection>
      <div className="table-head">
        {columns.map((column, columnIndex) => (
          <div className="table-column" style={{ width: column.width }} key={columnIndex}>
            {createElement(column.headerRender!, column)}
          </div>
        ))}
      </div>
      <div className="table-body">
        {tableData.map((_row, rowIndex) => (
          <div className="table-row" key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <div className="table-cell-wrapper" style={{ width: column.width }} key={columnIndex}
                onMouseDown={e => handleMouseDown(e, rowIndex, columnIndex)}
                onMouseEnter={e => handleMouseEnter(e, rowIndex, columnIndex)}>
                {createElement(column.cellRender!, {
                  value: tableData[rowIndex][column.dataKey],
                  rowIndex,
                  column,
                  elonTableRef
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}))

export default ElonTable
