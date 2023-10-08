'use client'

import React from 'react'
import ElonTable, { useElonTable } from './elontable/ElonTable'
import ElonTableColumn from './elontable/ElonTableColumn'

const App: React.FC = () => {
  const tableProps = useElonTable([
    { name: 'Alice', age: 25, sex: 0, email: 'alice@example.com' },
    { name: 'Bob', age: 30, sex: 1, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, sex: 0, email: 'charlie@example.com' }
  ], (patches) => {
    console.log(patches)
  })

  const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>, rowIndex: number) => {
    tableProps.updateTableData(draft => {
      draft[rowIndex].sex = Number(event.target.value)
    })
  }

  return (
    <div className="App">
      <ElonTable {...tableProps}>
        <ElonTableColumn dataKey="name" headerRender={() => (
          <h3 style={{ margin: '8px' }}>Name</h3>
        )} />
        <ElonTableColumn dataKey="sex" width='100px' cellRender={({ data, rowIndex, columnProps }) => (
          <select value={data[rowIndex][columnProps.dataKey]} style={{ margin: '8px' }}
            onChange={e => handleSexChange(e, rowIndex)}>
            <option value="0">female</option>
            <option value="1">male</option>
          </select>
        )} />
        <ElonTableColumn dataKey="age" width='50px' type='number' />
        <ElonTableColumn dataKey="email" width="300px" />
      </ElonTable>
    </div>
  )
}

export default App
