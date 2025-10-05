import { ReactNode } from 'react'

interface DetailTableRowProps {
  label: string
  children: ReactNode
  colSpan?: number
}

interface DetailTableDoubleRowProps {
  children: [ReactNode, ReactNode]
}

interface DetailTableFieldProps {
  label: string
  children: ReactNode
}

export function DetailTableRow({ label, children, colSpan = 3 }: DetailTableRowProps) {
  return (
    <tr>
      <th
        className="px-4 py-3 bg-gray-50 text-gray-700 text-sm font-medium text-left border-b border-r"
        style={{ width: '10%' }}
      >
        {label}
      </th>
      <td className="px-4 py-3 text-sm border-b" style={{ width: '40%' }} colSpan={colSpan}>
        {children}
      </td>
    </tr>
  )
}

export function DetailTableDoubleRow({ children }: DetailTableDoubleRowProps) {
  const [firstField, secondField] = children

  return (
    <tr>
      {firstField}
      {secondField}
    </tr>
  )
}

export function DetailTableField({ label, children }: DetailTableFieldProps) {
  return (
    <>
      <th
        className="px-4 py-3 bg-gray-50 text-gray-700 text-sm font-medium text-left border-b border-r"
        style={{ width: '10%' }}
      >
        {label}
      </th>
      <td className="px-4 py-3 text-sm border-b border-r" style={{ width: '40%' }}>
        {children}
      </td>
    </>
  )
}
