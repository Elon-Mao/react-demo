import React from 'react'
import { Column } from './ElonTable'

const ElonTableHeader: React.FC<Column> = ({
  dataKey
}) => (
  <div className="table-header" title={dataKey}>
    {dataKey}
  </div>
)

export default ElonTableHeader
