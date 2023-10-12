import React, { useEffect, useMemo } from 'react'
import ElonTable, { useElonTable } from './ElonTable'
import { CellProps } from './ElonTableCell'

const NameHeader = () => (
  <h3 style={{ margin: 8 }}>Name</h3>
)

const SexCell = ({ data, rowIndex, columnOption, onUpdate }: CellProps) => (
  <select value={data[rowIndex][columnOption.dataKey]} style={{ margin: 8 }}
    onChange={e => onUpdate(rowIndex, columnOption.dataKey, e.target.value)}>
    <option value="0">female</option>
    <option value="1">male</option>
  </select>
)

const App: React.FC = () => {
  const tableProps = useElonTable([{
    dataKey: 'name',
    headerRender: NameHeader
  }, {
    dataKey: 'age',
    type: 'number',
    width: 50
  }, {
    dataKey: 'sex',
    width: 100,
    cellRender: SexCell
  }, {
    dataKey: 'birthday',
    type: 'date',
  }], [
    { name: 'Alice', age: 25, sex: 0, birthday: '1997-10-10' },
    { name: 'Bob', age: 30, sex: 1, birthday: '1997-07-01' },
    { name: 'Charlie', age: 35, sex: 0, birthday: '2001-02-27' }
  ])

  useEffect(() => {
    console.log(tableProps.tableData)
  }, [tableProps.tableData])

  const selectRowIndex = useMemo(() => tableProps.selection?.mouseDownCell.rowIndex, [tableProps.selection])

  const addRow = () => {
    tableProps.updateTableData((draft) => {
      draft.push({ name: '', age: 0, sex: 0, birthday: '' })
    })
  }

  const deleteRow = () => {
    tableProps.updateTableData((draft) => {
      if (selectRowIndex) {
        draft.splice(selectRowIndex, 1)
      }
    })
  }

  return (
    <>
      <button onMouseDown={addRow}>addRow</button>
      <button onMouseDown={deleteRow} style={{marginLeft: 5}}>deleteRow</button>
      <br /><span>select all: ctrl + a</span>
      <br /><span>copy: ctrl + c</span>
      <br /><span>paste: ctrl + v</span>
      <br /><span>undo: ctrl + z</span>
      <br /><span>redo: ctrl + y</span>
      <br /><span>input: double click</span>
      <ElonTable {...tableProps}>
      </ElonTable>
    </>
  )
}

export default App
