import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { interval, switchMap } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Notification } from 'src/app/models/Notification';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ServiceWorkerService } from 'src/app/services/service-worker.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {

  user: any;
  elementsParPage = 1; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle
  notifications!: Page<Notification>;
  notificationsList: Notification[] = [];
  notificationsNonLues: Notification[] = [];
  activeLink: any;
  notificationsDejaAffichees: number[] = [];
  sidebarVisible: boolean = false;
  zIndexForSidebar: number = 2;

  constructor(private personneService: PersonneService, private router: Router,
    private behaviorService: BehaviorService, private notificationService: NotificationsService,
    private serviceWorker: ServiceWorkerService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.serviceWorker.requestPermission();
    if (this.user) {
      this.initNotification();
      // this.notificationService.initListeNotificationsNonLues();
      // this.notificationService.notificationsNonLuesEvent.subscribe(
      //   (data: Notification[]) => {
      //     this.notificationsNonLues = data;
      // });
      // this.initListeNotifications();
    }
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

    let roleBasedURL = '';
    this.sidebarVisible = false;
    switch (this.user.role.code) {
      case 'ROLE_ADMINISTRATEUR':
        this.notificationService.notificationsNonLuesByAdmin();
        roleBasedURL = '/admin';
        break;
      case 'ROLE_NOTAIRE':
        this.notificationService.notificationsNonLuesByNotaire();
        roleBasedURL = '/notaire';
        break;
      case 'ROLE_PROPRIETAIRE':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/responsable/agences-immobilieres';
        break;
      case 'ROLE_DEMARCHEUR':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
        break;
      case 'ROLE_CLIENT':
        this.notificationService.notificationsNonLuesByOwner();
        roleBasedURL = '/client';
        break;
      default:
        break;
    }
    const pageConcerneeURL = roleBasedURL + url;
    this.router.navigateByUrl(pageConcerneeURL);
  }

  lireNotification() {
    // this.sidebarVisible = true;
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

  initNotification(): void {
    interval(1000)
    .pipe(
      switchMap(() => {
        this.notificationService.initListeNotificationsNonLues();
        return this.notificationService.notificationsNonLuesEvent;
      })
    )
    .subscribe((data: Notification[]) => {
      this.notificationsNonLues = data;
      this.notificationsNonLues.forEach((notification) => {
        if (!this.notificationsDejaAffichees.includes(notification.id)) {
          this.afficherNotification(notification.titre, notification.message);
          this.notificationsDejaAffichees.push(notification.id);
        }
      });
      this.initListeNotifications();
    });
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
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      notificationUrl = '/notaire/notifications';
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
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      profilUrl = '/notaire/profil';
    }

    return profilUrl;
  }

  listeNotificationsByAdmin(): void {
    // this.notificationService.getNotificationsByAdmin(0, 3).subscribe(
    //   (response) => {
    //     this.notifications = response;
    //   }
    // );
    this.notificationService.getNotificationsListByAdmin().subscribe(
      (response) => {
        this.notificationsList = response;
      }
    );
  }

  listeNotificationsByNotaire(): void {
    // this.notificationService.getNotificationsByNotaire(0, 3).subscribe(
    //   (response) => {
    //     this.notifications = response;
    //   }
    // );
    this.notificationService.getNotificationsListByNotaire().subscribe(
      (response) => {
        this.notificationsList = response;
      }
    );
  }

  listeNotificationsByOwner(): void {
    // this.notificationService.getNotificationsByOwner(0, 10).subscribe(
    //   (response) => {
    //     this.notifications = response;
    //   }
    // );
    this.notificationService.getNotificationsListByOwner().subscribe(
      (response) => {
        this.notificationsList = response;
      }
    );
  }

  initListeNotifications(): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeNotificationsByAdmin();
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.listeNotificationsByNotaire();
    } else {
      this.listeNotificationsByOwner();
    }
  }

  afficherNotification(titre: string, message: string) {
    const iconUrl = 'assets/images/ahoewo-notif.png';
    this.serviceWorker.showNotification(titre, message, iconUrl);
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest('.notification')) {
  //     this.closeSidebar();
  //   } else {
  //     // Appliquer un z-index à la partie où vous cliquez
  //     this.lireNotification();
  //     this.zIndexForSidebar = 100; // Par exemple, vous pouvez définir un autre z-index ici
  //   }
  // }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('p-sidebar');
    const notification = document.querySelector('.notification');

    if (
      sidebar &&
      !sidebar.contains(target) &&
      notification &&
      !notification.contains(target)
    ) {
      this.closeSidebar();
    } else {
      this.lireNotification();
      // Optionally apply a different z-index if clicking inside the notification area
      this.zIndexForSidebar = 100; // Change this value as needed
    }
  }

  ngOnDestroy(): void {

  }
}
