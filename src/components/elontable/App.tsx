import React, { useRef } from 'react'
import { Patch } from 'immer'
import ElonTable, { ElonTableRef } from './ElonTable'
import { CellProps } from './ElonTableCell'

const App: React.FC = () => {
  const tableRef = useRef<ElonTableRef>(null)

  const columns = [{
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
  }]
  const tableData = [
    { name: 'Alice', age: 25, sex: 0, birthday: '1997-10-10' },
    { name: 'Bob', age: 30, sex: 1, birthday: '1997-07-01' },
    { name: 'Charlie', age: 35, sex: 0, birthday: '2001-02-27' }
  ]

  const addRow = () => {
    tableRef.current!.updateTableData(draft => {
      draft.push({ name: '', age: 0, sex: 0, birthday: '' })
    })
  }

  const deleteRow = () => {
    tableRef.current!.updateTableData(draft => {
      const selectRowIndex = tableRef.current!.selection?.mouseDownCell.rowIndex
      if (selectRowIndex) {
        draft.splice(selectRowIndex, 1)
      }
    })
  }

  const handleChange = (patches: Patch[]) => {
    console.log(patches)
  }

  return (
    <>
      <button onMouseDown={addRow}>addRow</button>
      <button onMouseDown={deleteRow} style={{ marginLeft: 5 }}>deleteRow</button>
      <br /><span>select all: ctrl + a</span>
      <br /><span>copy: ctrl + c</span>
      <br /><span>paste: ctrl + v</span>
      <br /><span>undo: ctrl + z</span>
      <br /><span>redo: ctrl + y</span>
      <br /><span>input: double click</span>
      <ElonTable ref={tableRef} columns={columns} tableData={tableData} onChange={handleChange}/>
    </>
  )
}

const NameHeader = () => (
  <h3 style={{ margin: 8 }}>Name</h3>
)

const SexCell = ({ tableData, rowIndex, column, updateTableData }: CellProps) => (
  <select value={tableData[rowIndex][column.dataKey]} style={{ margin: 8 }}
    onChange={e => updateTableData(draft => {
      draft[rowIndex][column.dataKey] = e.target.value
    })}>
    <option value="0">female</option>
    <option value="1">male</option>
  </select>
)

export default App