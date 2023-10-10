'use client'

import React from 'react'
import ElonTable, { useElonTable } from './elontable/ElonTable'
import { CellProps } from './elontable/ElonTableCell'

const App: React.FC = () => {
  const tableProps = useElonTable([{
    dataKey: 'name',
    headerRender: NameHeader
  }, {
    dataKey: 'age',
    type: 'number',
    width: '50px'
  }, {
    dataKey: 'sex',
    width: '100px',
    cellRender: SexCell
  }, {
    dataKey: 'email',
    width: '300px'
  }], [
    { name: 'Alice', age: 25, sex: 0, email: 'alice@example.com' },
    { name: 'Bob', age: 30, sex: 1, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, sex: 0, email: 'charlie@example.com' }
  ], (patches) => {
    console.log(patches)
  })

  return (
    <div className="App">
      <ElonTable {...tableProps}>
      </ElonTable>
    </div>
  )
}

const NameHeader = () => (
  <h3 style={{ margin: '8px' }}>Name</h3>
)

const SexCell = ({ data, rowIndex, columnOption, onUpdate }: CellProps) => (
  <select value={data[rowIndex][columnOption.dataKey]} style={{ margin: '8px' }}
    onChange={e => onUpdate(rowIndex, columnOption.dataKey, e.target.value)}>
    <option value="0">female</option>
    <option value="1">male</option>
  </select>
)

export default App
