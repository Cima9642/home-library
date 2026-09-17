import {supabase} from './supabaseClient';

import type {Book, BookInput} from '../types';

export async function getAllBooks(): Promise<Book[]> {
    if (!supabase) {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true})


    if (error) throw error
    return data as Book[]


}

export async function searchBooks(query: string): Promise<Book[]> {
    if (!supabase) {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order('title', { ascending: true})

    if (error) throw error 
    return data as Book[]
}

export async function addBook(book: BookInput): Promise<Book> {
    if (!supabase) {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

    if (error) throw error
    return data as Book
}


export async function updateBook(id: string, updates: Partial<BookInput>): Promise<Book> {
    if (!supabase) {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

    if (error) throw error
    return data as Book
}

export async function deleteBook(id: string): Promise<void>{
    if (!supabase) {
        throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const {error} = await supabase.from('books').delete().eq('id',id)
    if (error) throw error
}