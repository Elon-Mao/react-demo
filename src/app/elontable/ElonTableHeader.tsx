import React from 'react'
import { ColumnProps } from './ElonTableColumn'

const ElonTableHeader: React.FC<ColumnProps> = ({
  dataKey
}) => (
  <div className="table-header">
    {dataKey}
  </div>
)

export default ElonTableHeader
