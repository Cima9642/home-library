import {useState, type ReactNode } from 'react';

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? '';
const SESSION_KEY = 'home-library-unlocked'

export function PasswordGate({children}: {children: ReactNode}) {
    const [unlocked, setUnlocked] = useState(
        () => APP_PASSWORD === '' || sessionStorage.getItem(SESSION_KEY) === 'true'
    )
    const [input,setInput] = useState('')
    const [error, setError] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if(input === APP_PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, 'true')
            setUnlocked(true)
        } else {
            setError(true)
        }


    }

    if (unlocked) return <>{children}</>


    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form 
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
            >
                <h1 className="text-xl font-semibold mb-4 text-slate-800">Home Library</h1>
                <input
                type="password"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                    setError(false)
                }}
                placeholder="Enter password"
                className="w-full border border-slate-300 rounded px-3 py-2 mb-2"
                autoFocus
                />

                {error && <p className="text-red-600 text-sm mb-2">Incorrect password</p>}
                <button
                type="submit"
                className="w-full bg-slate-800 text-white rounded py-2 hover:bg-slate-700"
                >
                    Enter
                </button>

            </form>
        </div>
    )


}