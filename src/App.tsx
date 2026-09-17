import { useEffect, useState } from 'react'
import { PasswordGate } from './components/PasswordGate'
import { BookForm } from './components/BookForm'
import { BookList } from './components/BookList'
import { getAllBooks, searchBooks, addBook, updateBook, deleteBook } from './lib/books'
import type { Book, BookInput } from './types'



function LibraryApp() {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadBooks() {
    setLoading(true)
    const data = query.trim() ? await searchBooks(query.trim()) : await getAllBooks()
    setBooks(data)
    setLoading(false)
  }

  useEffect(() => {
    loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    await loadBooks()
  }

  async function handleAddOrEdit(input: BookInput) {
    if (editingBook) {
      await updateBook(editingBook.id, input)
    } else {
      await addBook(input)
    }
    setShowForm(false)
    setEditingBook(null)
    await loadBooks()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return
    await deleteBook(id)
    await loadBooks()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">📚 Home Library</h1>
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