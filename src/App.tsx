import { useEffect, useState, useCallback } from 'react'
import { PasswordGate } from './components/PasswordGate'
import { BookForm } from './components/BookForm'
import { BookList } from './components/BookList'
import { getAllBooks, searchBooks, addBook, updateBook, deleteBook } from './lib/books'
import { hasSupabaseConfig } from './lib/supabaseClient'
import type { Book, BookInput } from './types'



function LibraryApp() {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = useCallback(async () => {
    return query.trim() ? searchBooks(query.trim()) : getAllBooks()
  }, [query])

  async function loadBooks() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks()
      setBooks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return
    }

    let cancelled = false

    async function initialize() {
      try {
        const data = await fetchBooks()
        if (!cancelled) {
          setBooks(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load books.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [fetchBooks])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    await loadBooks()
  }

  async function handleAddOrEdit(input: BookInput) {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, input)
      } else {
        await addBook(input)
      }
      setShowForm(false)
      setEditingBook(null)
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return

    try {
      await deleteBook(id)
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book.')
    }
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <h1 className="text-2xl font-bold"> Home Library</h1>
          <p className="mt-3">
            The app is missing its Supabase production environment variables.
          </p>
          <p className="mt-2 text-sm">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment, then rebuild.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Home Library</h1>
          <button
            onClick={() => {
              setEditingBook(null)
              setShowForm((v) => !v)
            }}
            className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700"
          >
            {showForm ? 'Close' : 'Add book'}
          </button>
        </div>

        {showForm && (
          <BookForm
            initial={editingBook ?? undefined}
            onSubmit={handleAddOrEdit}
            onCancel={() => {
              setShowForm(false)
              setEditingBook(null)
            }}
          />
        )}

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="flex-1 border border-slate-300 rounded bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
          />
          <button type="submit" className="bg-slate-800 text-white rounded px-4 py-2">
            Search
          </button>
        </form>

        {error && <p className="text-red-600">{error}</p>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <BookList
            books={books}
            onEdit={(book) => {
              setEditingBook(book)
              setShowForm(true)
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <PasswordGate>
      <LibraryApp />
    </PasswordGate>
  )
}

export default App