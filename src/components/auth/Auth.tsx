'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      // O erro já é tratado no hook useAuth
      console.error('Erro na autenticação:', error)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="mb-8">
          <Image
            src="/images/logo.png"
            alt="UX na Real"
            width={90}
            height={24}
            className="h-6 w-auto"
          />
        </div>
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-lg backdrop-blur-sm">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">
              {isSignUp ? 'Criar conta' : 'Entrar na sua conta'}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-md border-0 bg-white/5 p-2 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-foreground/50 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border-0 bg-white/5 p-2 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-foreground/50 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  isSignUp ? 'Criar conta' : 'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm hover:text-primary/80"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp
                ? 'Já tem uma conta? Entre aqui'
                : 'Não tem uma conta? Crie uma aqui'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 