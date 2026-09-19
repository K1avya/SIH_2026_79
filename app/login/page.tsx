import { QuantifyProvider } from '@/context/quantify-context'
import { QuantifyView } from '@/components/quantify-view'

export const metadata = {
  title: 'Sign In & Role Selection | QUANTIFY - SIH26140',
  description: 'Authenticate as Learner or Administrator to access the Quantify Quantum Algorithm Learning Platform.',
}

export default function LoginPage() {
  return (
    <QuantifyProvider initialTab="login">
      <QuantifyView />
    </QuantifyProvider>
  )
}
