import React from 'react'
import ElonTableHeader from './ElonTableHeader'
import ElonTableCell, { CellProps } from './ElonTableCell'

export interface ColumnProps {
  dataKey: string
  width?: string
  type?: string
  headerRender?: React.FC<ColumnProps>
  cellRender?: React.FC<CellProps>
}

export const columnDefaultProps = {
  width: '200px',
  type: 'text',
  headerRender: ElonTableHeader,
  cellRender: ElonTableCell
}

const ElonTableColumn: React.FC<ColumnProps> = ({
  dataKey,
  width,
  headerRender
}) => (
  <div className="table-column" style={{ width }}>
    {headerRender!({ dataKey })}
  </div>
)

export default ElonTableColumn
