import {useState, type Form Event} from 'react'
import type {Book, BookInput, Language} from '../types'

const LANGUAGES: Language[] = ['English', 'Spanish', 'Bilingual']

interface Props {
    initial?: Book
    onSubmit: (book: BookInput)=> Promise<void>
    onCancel?: () => void
}