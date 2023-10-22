import React, { memo } from 'react'
import { Column } from './ElonTable'

const ElonTableHeader: React.FC<Column> = memo(({
  dataKey
}) => (
  <div className="table-header" title={dataKey}>
    {dataKey}
  </div>
))

export default ElonTableHeader
