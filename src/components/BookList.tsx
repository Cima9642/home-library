import type {Book} from '../types'

interface Props {
    books: Book[]
    selected: Set<string>
    onToggleSelect: (id: string) => void
    onEdit: (book: Book) => void
    onDelete: (id: string) => void | Promise<void>
}

export function BookList({books, selected, onToggleSelect, onEdit, onDelete}: Props) {
    if (books.length === 0) {
        return <p className="text-slate-500 italic">No books found</p>
    }

    return (
        <ul className="space-y-2">
            {books.map((book) => (
                <li
                    key={book.id}
                    className={`flex items-center justify-between rounded-lg bg-white p-4 shadow`}
                >
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={selected.has(book.id)}
                            onChange={() => onToggleSelect(book.id)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold text-slate-800">{book.title}</p>
                            <p className="text-sm text-slate-500">
                                {book.author} · {book.language} · {book.material} {!book.wishlisted && `· Qty: ${book.quantity}`}
                            </p>
                            {book.wishlisted && (
                                <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                    Wishlisted
                                </span>
                            )}
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <button
                        onClick={() => onEdit(book)}
                        className="text-sm text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                        <button
                        onClick={() => onDelete(book.id)}
                        className="text-sm text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                    </div>

                </li>
            ))}
        </ul>
    )
}
