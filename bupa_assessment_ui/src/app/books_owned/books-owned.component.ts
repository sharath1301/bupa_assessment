import { Component, input, signal } from "@angular/core";
import { Book } from "../books/books";

@Component({
    selector: 'books-owned',
    templateUrl: './books-owned.component.html'
})
export class BooksOwnedComponent {
    hardcoverOnly = input(false);
    booksOwned = input.required<Book[]>();
    title = input.required<string>();
}