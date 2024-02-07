import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, switchMap } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Notification } from 'src/app/models/Notification';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { RoleService } from 'src/app/services/gestionDesComptes/role.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {

  user: any;
  elementsParPage = 1; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle
  notifications!: Page<Notification>;
  notificationsNonLues: Notification[] = [];
  activeLink: any;

  constructor(
    private personneService: PersonneService,
    private router: Router,
    private behaviorService: BehaviorService,
    private notificationService: NotificationsService,
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.behaviorService.activeLink$.subscribe((donnee) => {
      this.activeLink = donnee;
    });
    interval(1000) // Exécution toutes les 1 seconde
    .pipe(
      switchMap(() => {
        this.notificationService.initListeNotificationsNonLues();
        return this.notificationService.notificationsNonLuesEvent;
      })
    )
    .subscribe((data: Notification[]) => {
      this.notificationsNonLues = data;
      this.initListeNotifications();
    });
    this.notificationService.initListeNotificationsNonLues();
    this.notificationService.notificationsNonLuesEvent.subscribe(
      (data: Notification[]) => {
        this.notificationsNonLues = data;
    });
    this.initListeNotifications();
  }

  getElapsedTime(dateNotification: Date): string {
    const now = new Date();
    const notificationDate = new Date(dateNotification);

    const elapsedMilliseconds = now.getTime() - notificationDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    if (elapsedDays > 0) {
      return `Il y a ${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`;
    } else if (elapsedHours > 0) {
      return `Il y a ${elapsedHours} heure${elapsedHours > 1 ? 's' : ''}`;
    } else if (elapsedMinutes > 0) {
      return `Il y a ${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${elapsedSeconds} seconde${elapsedSeconds > 1 ? 's' : ''}`;
    }
  }

  redirectToPageConcernee(url: string): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.behaviorService.notificationsNonLuesByAdmin();
      this.behaviorService.setActiveLink('/admin' + url);
      this.router.navigate(['admin' + url])
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/proprietaire' + url);
      this.router.navigate(['proprietaire' + url])
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/responsable' + url);
      this.router.navigate(['responsable' + url])
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/demarcheur' + url);
      this.router.navigate(['demarcheur' + url])
    } else if (this.user.role.code == 'ROLE_GERANT') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/gerant' + url);
      this.router.navigate(['gerant' + url])
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/agent-immobilier' + url);
      this.router.navigate(['agent-immobilier' + url])
    } else if (this.user.role.code == 'ROLE_CLIENT') {
      this.behaviorService.notificationsNonLuesByOwner();
      this.behaviorService.setActiveLink('/client' + url);
      this.router.navigate(['client' + url])
    }
  }

  lireNotification() {
    this.notificationsNonLues.forEach((notification) => {
      this.notificationService.lireNotification(notification.id).subscribe(
        (response) => {
          this.notificationService.initListeNotificationsNonLues();
        }
      )
    });
  }

  setActiveLink(link: string) {
    this.activeLink = link;
    this.behaviorService.setActiveLink(this.activeLink);
  }

  seDeconnecter(): void {
    this.personneService.deconnexion();
  }

  redirectToNotificationPage(): string {
    let notificationUrl = '';
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      notificationUrl = '/admin/notifications';
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      notificationUrl = '/responsable/agences-immobilieres/notifications';
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      notificationUrl = '/proprietaire/notifications';
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      notificationUrl = '/demarcheur/notifications';
    } else if (this.user.role.code == 'ROLE_GERANT') {
      notificationUrl = '/gerant/notifications';
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      notificationUrl = '/agent-immobilier/notifications';
    } else if (this.user.role.code == 'ROLE_CLIENT') {
      notificationUrl = '/client/notifications';
    }

    return notificationUrl;
  }

  redirectToProfilPage(): string {
    let profilUrl = '';
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      profilUrl = '/admin/profil';
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      profilUrl = '/responsable/profil';
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      profilUrl = '/proprietaire/profil';
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      profilUrl = '/demarcheur/profil';
    } else if (this.user.role.code == 'ROLE_GERANT') {
      profilUrl = '/gerant/profil';
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      profilUrl = '/agent-immobilier/profil';
    } else if (this.user.role.code == 'ROLE_CLIENT') {
      profilUrl = '/client/profil';
    }

    return profilUrl;
  }

  listeNotificationsByAdmin(): void {
    this.notificationService.getNotificationsByAdmin(0, 3).subscribe(
      (response) => {
        this.notifications = response;
      }
    );
  }

  listeNotificationsByOwner(): void {
    this.notificationService.getNotificationsByOwner(0, 3).subscribe(
      (response) => {
        this.notifications = response;
      }
    );
  }

  initListeNotifications(): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeNotificationsByAdmin();
    } else {
      this.listeNotificationsByOwner();
    }
  }

}
