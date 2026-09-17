import { useState, type FormEvent } from 'react'
import type { Book, BookInput, Language, Material } from '../types'

const LANGUAGES: Language[] = ['English', 'Spanish', 'Bilingual']
const MATERIALS: Material[] = ['Hardback', 'Paperback', 'Board']

interface Props {
  initial?: Book
  onSubmit: (book: BookInput) => Promise<void>
  onCancel?: () => void
}

export function BookForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1)
  const [language, setLanguage] = useState<Language>(initial?.language ?? 'English')
  const [material, setMaterial] = useState<Material>(initial?.material ?? 'Hardback')
  const [wishlisted, setWishlisted] = useState(initial?.wishlisted ?? false)
  const [saving, setSaving] = useState(false)

  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({ title, author, quantity, language, material, wishlisted })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-slate-300 rounded bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full border border-slate-300 rounded bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">Quantity</label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-slate-300 rounded bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full border border-slate-300 rounded bg-white px-3 py-2 text-slate-900"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as Material)}
            className="w-full border border-slate-300 rounded bg-white px-3 py-2 text-slate-900"
          >
            {MATERIALS.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={wishlisted}
          onChange={(e) => setWishlisted(e.target.checked)}
        />
        Wishlisted (don't own it yet)
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : initial ? 'Save changes' : 'Add book'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-slate-300 rounded px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}