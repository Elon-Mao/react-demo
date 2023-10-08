'use client'

import React from 'react'
import { Patch } from 'immer'
import ElonTable from './elontable/ElonTable'
import ElonTableColumn from './elontable/ElonTableColumn'

const App: React.FC = () => {
  const tableData = [
    { name: 'Alice', age: 25, email: 'alice@example.com' },
    { name: 'Bob', age: 30, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' }
  ]

  const handleUpdateData = (patches: Patch[]) => {
    console.log(patches)
  }

  return (
    <div className="App">
      <ElonTable data={tableData} onUpdateData={handleUpdateData}>
        <ElonTableColumn dataKey="name" width='150px' headerRender={() => (
          <h3 style={{ margin: '8px' }}>Name(disabled)</h3>
        )} cellRender={({ data, rowIndex, columnProps }) => (
          <div className='table-cell' style={{ cursor: 'not-allowed', userSelect: 'none' }}>
            {data[rowIndex][columnProps.dataKey]}
          </div>
        )} />
        <ElonTableColumn dataKey="age" />
        <ElonTableColumn dataKey="email" width="300px" />
      </ElonTable>
    </div>
  )
}

export default App
