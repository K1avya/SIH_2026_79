import { AuthShowcase } from '@/components/auth-showcase'
import { AuthForm } from '@/components/auth-form'

export default function Page() {
  return (
    <main
      className="quantum grid min-h-screen lg:grid-cols-2"
      style={{ background: 'var(--q-bg)', color: 'var(--q-text)' }}
    >
      <AuthShowcase />
      <div className="flex items-center justify-center p-6 sm:p-10">
        <AuthForm />
      </div>
    </main>
  )
}
