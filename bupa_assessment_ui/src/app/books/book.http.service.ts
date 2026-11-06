import { Injectable } from "@angular/core";
import { BooksByOwner } from "./books";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { shareReplay } from "rxjs/internal/operators/shareReplay";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable()
export class BookHttpService {
    constructor(private httpClient: HttpClient) {
    }

    getBooks(): Observable<BooksByOwner[]> {
        return this.httpClient.get<BooksByOwner[]>('http://localhost:3000/api/bookowners');    
    }
}