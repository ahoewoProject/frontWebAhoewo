import { Injectable } from '@angular/core';
import { ContactezNousForm } from '../models/ContactezNousForm';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactezNousService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Contactez-nous
  // url: http://localhost:4040/api/contactez-nous
  contactezNous(c: ContactezNousForm): Observable<ContactezNousForm> {
    return this.httpClient.post<ContactezNousForm>(this.url + 'contactez-nous', c);
  }
}
