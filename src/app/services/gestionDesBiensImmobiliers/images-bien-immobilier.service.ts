import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesBienImmobilierService {

  url!: string;

  constructor(private httpClient: HttpClient) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  // Ajout d'une occurrence d'un bien immobilier;
  // url: http://localhost:4040/api/images/bien-immobilier
  getImagesByBienImmobilier(idBienImmobilier: number): Observable<Array<ImagesBienImmobilier>>{
    return this.httpClient.get<Array<ImagesBienImmobilier>>(this.url + 'images/bien-immobilier/' + idBienImmobilier);
  }

  //Recupérer une image;
  // url: http://localhost:4040/api/image/bien-immobilier/{id}
  getImage(id: number): Observable<Blob> {
    return this.httpClient.get(this.url + 'image/bien-immobilier/' + id, { responseType: 'blob' });
  }
}
