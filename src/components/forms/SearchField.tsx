'use client'

interface SearchFieldProps {
  label: string
  children: React.ReactNode
}

export default function SearchField({ label, children }: SearchFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
