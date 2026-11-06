export type Book = {
    name: string;
    type: 'Hardcover' | 'Paperback' | 'Ebook';
}

export type BooksByOwner = {
    name: string;
    age: number;
    books: Book[];
}
