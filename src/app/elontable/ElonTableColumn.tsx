import React from 'react'
import ElonTableHeader from './ElonTableHeader'
import ElonTableCell, { CellProps } from './ElonTableCell'

export interface ColumnProps {
  dataKey: string
  width?: string
  headerRender?: React.FC<ColumnProps>
  cellRender?: React.FC<CellProps>
}

export const columnDefaultProps = {
  width: '200px',
  headerRender: ElonTableHeader,
  cellRender: ElonTableCell
}

const ElonTableColumn: React.FC<ColumnProps> = ({
  dataKey,
  width,
  headerRender
}) => {
  const HeaderRender = headerRender!
  return (
    <div className="table-column" style={{ width }}>
      <HeaderRender dataKey={dataKey} />
    </div>
  )
}

export default ElonTableColumn
