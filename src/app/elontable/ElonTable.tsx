import React, { ReactNode, useState, useEffect, useMemo, useRef, Dispatch, SetStateAction } from 'react'
import { Patch } from 'immer'
import { UpdateFunction, useUndoRedo } from './use-undo-redo'
import { ColumnProps, columnDefaultProps } from './ElonTableColumn'
import ElonTableSelection, { TableSelection } from './ElonTableSelection'
import './styles.css'

type AnyArray = Array<any>

export interface TableProps<S extends AnyArray> {
  tableData: S
  updateTableData: UpdateFunction<S>
  undoTableData: () => void
  redoTableData: () => void
  selection: TableSelection | undefined
  setSelection: Dispatch<SetStateAction<TableSelection | undefined>>
}

const useElonTable = <S extends AnyArray>(
  data: S,
  onUpdateData: (patches: Patch[]) => void = () => { }
): TableProps<S> => {
  const [tableData, updateTableData, undoTableData, redoTableData] = useUndoRedo(data, onUpdateData)
  const [selection, setSelection] = useState<TableSelection>()
  return {
    tableData,
    updateTableData,
    undoTableData,
    redoTableData,
    selection,
    setSelection
  }
}

interface TablePropsWithChildren<S extends AnyArray> extends TableProps<S> {
  children: ReactNode
}

const copyTable = (
  selection: TableSelection | undefined,
  tableData: AnyArray,
  columns: React.ReactElement<ColumnProps>[]
) => {
  if (!selection) {
    return
  }
  let row0 = selection.mouseDownCell.rowIndex
  let row1 = selection.mouseMoveCell.rowIndex
  if (row0 > row1) {
    [row0, row1] = [row1, row0]
  }
  let column0 = selection.mouseDownCell.columnIndex
  let column1 = selection.mouseMoveCell.columnIndex
  if (column0 > column1) {
    [column0, column1] = [column1, column0]
  }
  navigator.clipboard.writeText(tableData.slice(row0, row1 + 1)
    .map(row => columns.slice(column0, column1 + 1)
      .map((column: any) => row[column.props.dataKey]).join('\t')).join('\n'))
}

const ElonTable = <S extends AnyArray>({
  tableData,
  updateTableData,
  undoTableData,
  redoTableData,
  selection,
  setSelection,
  children
}: TablePropsWithChildren<S>) => {
  const tableRef = useRef<HTMLDivElement>(null)
  const tableDataRef = useRef(tableData)
  tableDataRef.current = tableData
  const selectionRef = useRef(selection)
  selectionRef.current = selection
  const selecting = useRef(false)

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
            copyTable(selectionRef.current, tableDataRef.current, columns)
            break
          case 'v':
            if (!selectionRef.current) {
              return
            }
            const row0 = selectionRef.current.mouseDownCell.rowIndex
            const column0 = selectionRef.current.mouseDownCell.columnIndex
            const row1 = tableDataRef.current.length
            const column1 = columns.length
            navigator.clipboard.readText().then((clipText) => {
              updateTableData(draft => {
                clipText.split('\n').forEach((line, lineIndex) => {
                  const rowIndex = row0 + lineIndex
                  if (draft[rowIndex] === undefined) {
                    draft.push({ name: 'Charlie', age: 35, sex: 0, email: 'charlie@example.com' })
                  }
                  line.split('\t').forEach((text, textIndex) => {
                    const columnIndex = column0 + textIndex
                    if (columnIndex < column1) {
                      draft[rowIndex][columns[columnIndex].props.dataKey] = text
                    }
                  })
                })
              })
            })
            break
          case 'z':
            undoTableData()
            break
          case 'y':
            redoTableData()
            break
          case 'a':
            event.preventDefault()
            const tableBody = tableRef.current!.lastElementChild!
            const maxRow = tableDataRef.current.length - 1
            const maxColumn = columns.length - 1
            setSelection({
              mouseDownCell: {
                rowIndex: 0,
                columnIndex: 0,
                target: tableBody.children[0].children[0] as HTMLDivElement
              },

              mouseMoveCell: {
                rowIndex: maxRow,
                columnIndex: maxColumn,
                target: tableBody.children[maxRow].children[maxColumn] as HTMLDivElement
              }
            })
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
    const target = event.target as HTMLElement
    if (target.tagName !== 'DIV') {
      return
    }
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
    <div className="table" ref={tableRef}>
      <ElonTableSelection selection={selection}></ElonTableSelection>
      <div className="table-head">
        {columns}
      </div>
      <div className="table-body">
        {tableData.map((_row: any, rowIndex: number) => (
          <div className="table-row" key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <div className="table-cell-wrapper" style={{ width: column.props.width }} key={columnIndex}
                onMouseDown={e => handleMouseDown(e, rowIndex, columnIndex)}
                onMouseMove={e => handleMouseMove(e, rowIndex, columnIndex)}>
                {column.props.cellRender!({
                  data: tableData,
                  rowIndex,
                  columnProps: column.props,
                  onUpdate
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ElonTable
export { useElonTable }
