'use client'

import React, { useEffect, useRef } from 'react'
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

  const tableDataRef = useRef(tableProps.tableData)
  tableDataRef.current = tableProps.tableData

  return (
    <>
      <span></span>
      <ElonTable {...tableProps}>
      </ElonTable>
    </>
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
