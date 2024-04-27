import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { Notification } from 'src/app/models/Notification';
import { BehaviorService } from 'src/app/services/behavior.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  user: any;
  affichage = 1;

  numeroDeLaPage = 0;
  elementsParPage = 5;

  notification = this.notificationService.notification;
  notifications!: Page<Notification>;
  messageSuccess: string | null = null;

  constructor(private notificationService: NotificationsService, private messageService: MessageService,
    private personneService: PersonneService, private confirmationService: ConfirmationService,
    private behaviorService: BehaviorService, private router: Router
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.initListeNotifications(this.numeroDeLaPage, this.elementsParPage);
  }

  listeNotificationsByAdmin(numeroDeLaPage: number, elementsParPage: number): void {
    this.notificationService.getNotificationsByAdmin(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.notifications = response;
        this.notifications.content.forEach((notification) => {
          if (notification.lu == false) {
            this.notificationService.lireNotification(notification.id).subscribe(
              (response) => {
                this.notificationService.initListeNotificationsNonLues();
                this.notificationService.getNotificationsByAdmin(numeroDeLaPage, elementsParPage).subscribe(
                  (response) => {
                    this.notifications = response;
                  }
                )
              }
            )
          }
        });
      }
    );
  }

  listeNotificationsByNotaire(numeroDeLaPage: number, elementsParPage: number): void {
    this.notificationService.getNotificationsByNotaire(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.notifications = response;
        this.notifications.content.forEach((notification) => {
          if (notification.lu == false) {
            this.notificationService.lireNotification(notification.id).subscribe(
              (response) => {
                this.notificationService.initListeNotificationsNonLues();
                this.notificationService.getNotificationsByNotaire(numeroDeLaPage, elementsParPage).subscribe(
                  (response) => {
                    this.notifications = response;
                  }
                )
              }
            )
          }
        });
      }
    );
  }

  listeNotificationsByOwner(numeroDeLaPage: number, elementsParPage: number): void {
    this.notificationService.getNotificationsByOwner(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.notifications = response;
        this.notifications.content.forEach((notification) => {
          if (notification.lu == false) {
            this.notificationService.lireNotification(notification.id).subscribe(
              (response) => {
                this.notificationService.initListeNotificationsNonLues();
                this.notificationService.getNotificationsByOwner(numeroDeLaPage, elementsParPage).subscribe(
                  (response) => {
                    this.notifications = response;
                  }
                )
              }
            )
          }
        });
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeNotificationsByAdmin(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.listeNotificationsByNotaire(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listeNotificationsByOwner(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirListe(): void {
    this.initListeNotifications(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  initListeNotifications(numeroDeLaPage: number, elementsParPage: number): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeNotificationsByAdmin(numeroDeLaPage, elementsParPage);
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      this.listeNotificationsByNotaire(numeroDeLaPage, elementsParPage);
    } else {
      this.listeNotificationsByOwner(numeroDeLaPage, elementsParPage);
    }
  }

  detailNotification(id: number): void {
    this.notificationService.findById(id).subscribe(
      (response) => {
        this.notification = response;
      }
    );
  }

  redirectToPageConcernee(url: string): void {
    this.router.navigate([this.pageConcerneeUrl(url)])
  }

  afficherPageDetail(id: number): void {
    this.detailNotification(id);
    this.affichage = 2;
  }

  supprimerNotification(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir supprimer cette notification ?',
      header: "Suppression d'une notification",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.notificationService.supprimerNotification(id).subscribe(
          (response) => {
            console.log(response);
            this.notificationService.initListeNotificationsNonLues();
            this.voirListe();
            this.messageSuccess = "La notification a été supprimé avec succès !";
            this.messageService.add({
              severity: 'success',
              summary: 'Suppression de la notification confirmée',
              detail: this.messageSuccess
            })
          }
        );

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Suppression de la notification de bien rejetée',
              detail: "Vous avez rejeté la suppression de cette notification !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Suppression de la notification annulée',
              detail: "Vous avez annulé la suppression de cette notification !"
            });
            break;
        }
      }
    });
  }

  pageConcerneeUrl(url: string): string {
    let redirectURL = '';
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      redirectURL = '/admin' + url;
    } else if (this.user.role.code == 'ROLE_NOTAIRE') {
      redirectURL = '/notaire' + url;
    } else if (this.user.role.code == 'ROLE_RESPONSABLE') {
      redirectURL = '/responsable/agences-immobilieres' + url;
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      redirectURL = '/agent-immobilier/agences-immobilieres' + url;
    } else if (this.user.role.code == 'ROLE_CLIENT') {
      redirectURL = '/client' + url;
    } else if (this.user.role.code == 'ROLE_DEMARCHEUR') {
      redirectURL = '/demarcheur' + url;
    } else if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      redirectURL = '/proprietaire' + url;
    } else if (this.user.role.code == 'ROLE_GERANT') {
      redirectURL = '/gerant' + url;
    }

    return redirectURL;
  }

  ngOnDestroy(): void {

  }
}
