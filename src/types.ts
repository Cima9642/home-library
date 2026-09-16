export type Language = 'English' | 'Spanish' | 'Bilingual';
export type Material = 'Board' | 'Hardback' | 'Paperback' ;

export interface Book {
    id: string
    title: string
    author:string
    material: Material
    quantity: number
    language: Language
    wishlisted: boolean
    created_at: string

}



export type BookInput = Omit<Book, 'id' | 'created_at'>;


