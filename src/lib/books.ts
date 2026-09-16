import {supabase} from './supabaseClient';

import type {Book, BookInput} from '../types';

export async function getAllBooks(): Promise<Book[]> {
    const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true})


    if (error) throw error
    return data as Book[]


}

export async function searchBooks(query: string): Promise<Book[]> {
    const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order('title', { ascending: true})

    if (error) throw error 
    return data as Book[]
}

export async function addBook(book: BookInput): Promise<Book> {
    const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

    if (error) throw error
    return data as Book
}


export async function updateBook(id: string, updates: Partial<BookInput>): Promise<Book> {
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
    const {error} = await supabase.from('books').delete().eq('id',id)
    if (error) throw error
}