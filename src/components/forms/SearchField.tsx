import { Label } from '@/src/components/ui/Label'

interface SearchFieldProps {
  label: string
  children: React.ReactNode
}

export default function SearchField({ label, children }: SearchFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="font-semibold">{label}</Label>
      {children}
    </div>
  )
}
