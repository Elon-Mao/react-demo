import React from 'react'
import { ColumnOption } from './ElonTable'

const ElonTableHeader: React.FC<ColumnOption> = ({
  dataKey
}) => (
  <div className="table-header" title={dataKey}>
    {dataKey}
  </div>
)

export default ElonTableHeader
