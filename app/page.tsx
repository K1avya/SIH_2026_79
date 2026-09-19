import { QuantifyProvider } from '@/context/quantify-context'
import { QuantifyView } from '@/components/quantify-view'

export default function HomePage() {
  return (
    <QuantifyProvider>
      <QuantifyView />
    </QuantifyProvider>
  )
}
