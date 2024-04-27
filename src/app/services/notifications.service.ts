import { Notification } from 'src/app/models/Notification';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../interfaces/Page';
import { PersonneService } from './gestionDesComptes/personne.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public notificationsNonLuesEvent: EventEmitter<Notification[]> = new EventEmitter();
  public notification: Notification = new Notification();
  url!: string;
  user: any;

  constructor(private httpClient: HttpClient, private personneService: PersonneService) {
    const APIEndpoint = environment.APIEndpoint;
    this.url = APIEndpoint + 'api/';
  }

  initListeNotificationsNonLues(): void {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.notificationsNonLuesByAdmin();
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.notificationsNonLuesByNotaire();
    }  else {
      this.notificationsNonLuesByOwner();
    }
  }

  notificationsNonLuesByAdmin(): void {
    this.getNotificationsNonLuesByAdmin().subscribe(
      (response) => {
        this.notificationsNonLuesEvent.emit(response);
      }
    );
  }

  notificationsNonLuesByNotaire(): void {
    this.getNotificationsNonLuesByNotaire().subscribe(
      (response) => {
        this.notificationsNonLuesEvent.emit(response);
      }
    )
  }

  notificationsNonLuesByOwner(): void {
    this.getNotificationsNonLuesByOwner().subscribe(
      (response) => {
        this.notificationsNonLuesEvent.emit(response);
      }
    );
  }

  // Notifications non lues de l'Admin;
  // url: http://localhost:4040/api/notifications/non-lues/admin
  getNotificationsNonLuesByAdmin(): Observable<Array<Notification>>{
    return this.httpClient.get<Array<Notification>>(this.url + 'notifications/non-lues/admin');
  }

  // Notifications non lues du Notaire;
  // url: http://localhost:4040/api/notifications/non-lues/notaire
  getNotificationsNonLuesByNotaire(): Observable<Array<Notification>>{
    return this.httpClient.get<Array<Notification>>(this.url + 'notifications/non-lues/notaire');
  }

  // Notifications non lues des utilisateurs à par Admin;
  // url: http://localhost:4040/api/notifications/non-lues/owner
  getNotificationsNonLuesByOwner(): Observable<Array<Notification>>{
    return this.httpClient.get<Array<Notification>>(this.url + 'notifications/non-lues/owner');
  }

  // Notifications de l'Admin;
  // url: http://localhost:4040/api/notifications/admin
  getNotificationsByAdmin(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Notification>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Notification>>(this.url + 'notifications/admin', {params: params});
  }

  // Notifications du Notaire;
  // url: http://localhost:4040/api/notifications/notaire
  getNotificationsByNotaire(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Notification>>{
    let params = new HttpParams()
      .set('numeroDeLaPage', numeroDeLaPage.toString())
      .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Notification>>(this.url + 'notifications/notaire', {params: params});
  }

  // Notifications des utilisateurs à par Admin;
  // url: http://localhost:4040/api/notifications/owner
  getNotificationsByOwner(numeroDeLaPage: number, elementsParPage: number): Observable<Page<Notification>>{
    let params = new HttpParams()
    .set('numeroDeLaPage', numeroDeLaPage.toString())
    .set('elementsParPage', elementsParPage.toString());
    return this.httpClient.get<Page<Notification>>(this.url + 'notifications/owner', {params: params});
  }

  // Recherche d'une occurrence de notification par la clé primaire ;
  // url: http://localhost:4040/api/notification/{id}
  findById(id: number): Observable<Notification>{
    return this.httpClient.get<Notification>(this.url + 'notification/' + id);
  }

  // Envoi de notification;
  // url: http://localhost:4040/api/envoyer-notification
  envoyerNotification(n: Notification): Observable<Notification>{
    return this.httpClient.post<Notification>(this.url + 'envoyer-notification', n);
  }

  // Lire une notification
  // url: http://localhost:4040/api/lire/notification/{id}
  lireNotification(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'lire/notification/' +  id);
  }

  // Supprimer une notification
  // url: http://localhost:4040/api/supprimer/notification/{id}
  supprimerNotification(id: number): Observable<any>{
    return this.httpClient.get<any>(this.url + 'supprimer/notification/' +  id);
  }
}
