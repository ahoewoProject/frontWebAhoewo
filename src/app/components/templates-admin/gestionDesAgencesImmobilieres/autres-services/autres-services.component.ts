import { Component } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { MotifRejetServiceForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifRejetServiceForm';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';

@Component({
  selector: 'app-autres-services',
  templateUrl: './autres-services.component.html',
  styleUrls: ['./autres-services.component.css']
})
export class AutresServicesComponent {

  recherche: string = '';
  affichage = 1;
  user : any;
  dialogVisible: boolean = false;
  motifRejetServiceForm = new MotifRejetServiceForm();

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  _service = this._servicesService._service;
  services!: Page<Services>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  serviceId!: number;

  constructor(
    private _servicesService: ServicesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {

  }

  ngOnInit(): void {
    this.listeAutresServices(this.numeroDeLaPage, this.elementsParPage);
  }

  // Fonction pour recupérer les services
  listeAutresServices(numeroDeLaPage: number, elementsParPage: number) {
    this._servicesService.getAutresServicesPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.services = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeAutresServices(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listeAutresServices(this.numeroDeLaPage, this.elementsParPage);
    this.affichage = 1;
  }

  annuler(): void {
    this.dialogVisible = false;
    this.messageService.add({
      severity: 'warn',
      summary: 'Rejet du service annulée',
      detail: "Vous avez annulé le rejet de ce service !"
    });
  }

  detailService(id: number): void {
    this._servicesService.findById(id).subscribe(
      (response) => {
        this._service = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailService(id);
    this.affichage = 2;
  }

  validerService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Validation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.validerServices(id).subscribe(
        (response) => {
          this.voirListe();
          this.messageSuccess = "Le service a été validé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Validation du service confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Validation du service rejetée',
              detail: "Vous avez rejeté la validation de ce service !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Validation du service annulée',
              detail: "Vous avez annulé la validation de ce service !"
            });
            break;
        }
      }
    });
  }

  enregistrerMotif(): void {
    this.motifRejetServiceForm.id = this.serviceId;
    this._servicesService.rejeterServices(this.motifRejetServiceForm).subscribe(
      (response) => {
        this.dialogVisible = false;
        this.voirListe();
        this.messageSuccess = "Le service a été rejeté avec succès !";
        this.messageService.add({
          severity: 'success',
          summary: 'Rejet du service confirmé',
          detail: this.messageSuccess
        });
      }
    );
  }

  afficherDialogue(id: number): void {
    this.serviceId = id;
    this.dialogVisible = true;
  }
}
