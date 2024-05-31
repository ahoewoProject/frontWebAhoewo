import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { MotifForm } from 'src/app/models/gestionDesAgencesImmobilieres/MotifForm';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-autres-services',
  templateUrl: './autres-services.component.html',
  styleUrls: ['./autres-services.component.css']
})
export class AutresServicesComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  user : any;
  dialogVisible: boolean = false;
  motifRejetForm = new MotifForm();

  elementsParPage = 5;
  numeroDeLaPage = 0;

  _service = this._servicesService._service;
  services!: Page<Services>;
  messageSuccess: string | null = null;
  serviceForm: any;
  serviceId!: number;
  emetteur!: any;

  constructor(private _servicesService: ServicesService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute,
    private personneService: PersonneService, private router: Router
  )
  {

  }

  ngOnInit(): void {
    this.initActivatedRoute();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.affichage = 2;
        this.detailService(parseInt(id));
      } else {
        this.listeAutresServices(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  // Fonction pour recupérer les services inexistants
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
    this.router.navigate(['admin/autres-services'])
  }

  detailEmetteur(id: number): void  {
    this.personneService.findById(id).subscribe(
      (response) => {
        this.emetteur = response;
      }
    )
  }

  detailService(id: number): void {
    this._servicesService.findById(id).subscribe(
      (response) => {
        this._service = response;
        if (!this._service) {
          this.voirListe();
        }
        this.detailEmetteur(response.creerPar)
      }
    );
  }

  afficherPageDetail(id: any): void {
    this.router.navigate(['admin/autres-services', id]);
  }

  afficherDialogue(id: number): void {
    this.serviceId = id;
    this.dialogVisible = true;
  }

  validerService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Validation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.validerService(id).subscribe(
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
    this.motifRejetForm.id = this.serviceId;
    this._servicesService.rejeterService(this.motifRejetForm).subscribe(
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

  annuler(): void {
    this.dialogVisible = false;
    this.messageService.add({
      severity: 'warn',
      summary: 'Rejet du service annulée',
      detail: "Vous avez annulé le rejet de ce service !"
    });
  }

  ngOnDestroy(): void {

  }
}
