import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/Notification';
import { PersonneService } from './gestionDesComptes/personne.service';
import { NotificationsService } from './notifications.service';
import { Page } from '../interfaces/Page';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

  user: any;

  private activeLinkSubject = new BehaviorSubject<string>(this.getActiveLink());
  private notificationsNonLuesSubject = new BehaviorSubject<Array<Notification>>([]);
  private notificationsListSubject = new BehaviorSubject<Page<Notification>>({} as Page<Notification>);

  constructor(private personneService: PersonneService,
    private notificationService: NotificationsService) {

  }

  activeLink$ = this.activeLinkSubject.asObservable();
  notificationsNonLues$ = this.notificationsNonLuesSubject.asObservable();
  notificationsList$ = this.notificationsListSubject.asObservable();

  setActiveLink(link: string): void {
    this.activeLinkSubject.next(link);
    localStorage.setItem('activeLink', link);
  }

  getActiveLink(): string {
    return localStorage.getItem('activeLink') || '';
  }

  notificationsNonLuesByAdmin(): void {
    this.notificationService.getNotificationsNonLuesByAdmin().subscribe(
      (response) => {
        this.notificationsNonLuesSubject.next(response);
      }
    );
  }

  notificationsNonLuesByOwner(): void {
    this.notificationService.getNotificationsNonLuesByOwner().subscribe(
      (response) => {
        this.notificationsNonLuesSubject.next(response);
      }
    );
  }

  listeNotificationsByAdmin(): void {
    this.notificationService.getNotificationsByAdmin(0, 3).subscribe(
      (response) => {
        this.notificationsListSubject.next(response);
      }
    );
  }

  listeNotificationsByOwner(): void {
    this.notificationService.getNotificationsByOwner(0, 3).subscribe(
      (response) => {
        this.notificationsListSubject.next(response);
      }
    );
  }

  initializeNotificationsList(): void {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeNotificationsByAdmin();
    } else {
      this.listeNotificationsByOwner();
    }
  }

  initializeNotificationsNonLues(): void {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.notificationsNonLuesByAdmin();
    } else {
      this.notificationsNonLuesByOwner();
    }
  }

}
