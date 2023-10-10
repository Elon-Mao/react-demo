import React from 'react'
import { ColumnOption } from './ElonTable'

const ElonTableHeader: React.FC<ColumnOption> = ({
  dataKey
}) => (
  <div className="table-header">
    {dataKey}
  </div>
)

export default ElonTableHeader
