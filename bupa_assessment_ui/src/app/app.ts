import { Component, computed, effect, OnDestroy, Signal, signal } from '@angular/core';
import { BookHttpService } from './books/book.http.service';
import { Book, BooksByOwner } from './books/books';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Subject } from 'rxjs/internal/Subject';
import { BooksOwnedComponent } from './books_owned/books-owned.component';

@Component({
  providers: [BookHttpService],
  imports: [BooksOwnedComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App{
  private clickTricker = new Subject<void>();
  protected readonly hardcoverOnly = signal(false);

  private booksByOwner: Signal<BooksByOwner[] | undefined> = signal([]);
  protected readonly booksOfAdults = computed(() =>
    (this.booksByOwner() ?? [])
      .filter(owner => owner.age >= 18)
      .flatMap(owner => owner.books)
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  protected readonly booksOfChildren = computed(() =>
    (this.booksByOwner() ?? [])
      .filter(owner => owner.age < 18)
      .flatMap(owner => owner.books)
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  constructor(private bookHttpService: BookHttpService) {
    this.booksByOwner = toSignal<BooksByOwner[] | undefined>(
      this.clickTricker.pipe(
        switchMap(() => this.bookHttpService.getBooks())
      )
    );

  }

  protected readonly title = signal('bupa_assessment');

  getBooks(): void {
    this.hardcoverOnly.update(()=>false);
    this.clickTricker.next();
  }

  hardCoverOnly(): void {
    this.hardcoverOnly.update(()=>true);
  }
}
