'use client'

interface SearchFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export default function SearchField({
  label,
  children,
  className = '',
}: SearchFieldProps) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
