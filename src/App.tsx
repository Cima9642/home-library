import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { PasswordGate } from './components/PasswordGate'
import { BookForm } from './components/BookForm'
import { BookList } from './components/BookList'
import { addBook, deleteBook, getAllBooks, searchBooks, updateBook } from './lib/books'
import { hasSupabaseConfig } from './lib/supabaseClient'
import type { Book, BookInput } from './types'

function LibraryApp() {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const fetchBooks = useCallback(async () => {
    const trimmedQuery = query.trim()
    return trimmedQuery ? searchBooks(trimmedQuery) : getAllBooks()
  }, [query])

  const clearSelection = useCallback(() => {
    setSelected(new Set())
  }, [])

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

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowInventory(true)
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
      setShowInventory(true)
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return

    try {
      await deleteBook(id)
      clearSelection()
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book.')
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function bulkDelete() {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} book(s)?`)) return

    try {
      await Promise.all([...selected].map((id) => deleteBook(id)))
      clearSelection()
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete selected books.')
    }
  }

  async function bulkSetWishlist(wishlisted: boolean) {
    if (selected.size === 0) return

    try {
      await Promise.all([...selected].map((id) => updateBook(id, { wishlisted })))
      clearSelection()
      await loadBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update selected books.')
    }
  }

  const selectedBooks = books.filter((book) => selected.has(book.id))
  const hashWishlistedSelection = selectedBooks.some((book) => book.wishlisted)

  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <h1 className="text-2xl font-bold">Home Library</h1>
          <p className="mt-3">
            The app is missing its Supabase production environment variables.
          </p>
          <p className="mt-2 text-sm">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment,
            then rebuild.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Home Library</h1>

          <div className="flex w-fit gap-1 rounded-lg bg-slate-200 p-1">
            <button
              type="button"
              onClick={() => setShowInventory((value) => !value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${
                showInventory ? 'bg-white text-slate-800 shadow' : 'text-slate-600'
              }`}
            >
              {showInventory ? 'Hide inventory' : 'Inventory'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingBook(null)
              setShowForm((value) => !value)
            }}
            className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
          >
            {showForm ? 'Close' : 'Add book'}
          </button>
        </div>

        {showForm ? (
          <BookForm
            initial={editingBook ?? undefined}
            onSubmit={handleAddOrEdit}
            onCancel={() => {
              setShowForm(false)
              setEditingBook(null)
            }}
          />
        ) : (
          <>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title or author..."
                className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
              />
              <button type="submit" className="rounded bg-slate-800 px-4 py-2 text-white">
                Search
              </button>
            </form>

            {showInventory && (
              <>
                {selected.size > 0 && (
                  <div className="sticky top-0 flex items-center gap-2 rounded-lg bg-white p-3 text-sm shadow">
                    <span className="text-slate-600">{selected.size} selected</span>

                    <button
                      type="button"
                      onClick={clearSelection}
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={bulkDelete}
                      className="ml-auto cursor-pointer text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                    {hashWishlistedSelection ? (
                      <button
                        type="button"
                        onClick={() => bulkSetWishlist(false)}
                        className="cursor-pointer text-slate-700 hover:underline "
                      >
                        Remove from Wishlist
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => bulkSetWishlist(true)}
                        className="cursor-pointer text-amber-700 hover:underline"
                      >
                        Add to Wishlist
                      </button>
                    )}
                  </div>
                )}

                {error && <p className="text-red-600">{error}</p>}

                {loading ? (
                  <p className="text-slate-500">Loading...</p>
                ) : (
                  <BookList
                    books={books}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                    onEdit={(book) => {
                      setEditingBook(book)
                      setShowForm(true)
                    }}
                    onDelete={handleDelete}
                  />
                )}
              </>
            )}
              
          </>
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