import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './demandes-certifications.component.html',
  styleUrls: ['./demandes-certifications.component.css']
})
export class DemandesCertificationsComponent implements OnInit {

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  demandeCertification = this.demandeCertifService.demandeCertification;
  demandeCertifications : DemandeCertification[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  demandeCertifData: FormData = new  FormData();
  APIEndpoint: string;
  documentJustificatif: any;

  constructor(
    private personneService: PersonneService,
    private demandeCertifService: DemandeCertificationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if(this.user.role.code == 'ROLE_NOTAIRE'){
      this.listeDemandeCertifications();
    }else{
      this.listeDemandeCertifParUtilisateur();
    }
  }

  listeDemandeCertifications(){
    this.demandeCertifService.getAll().subscribe(
      (response) => {
        this.demandeCertifications = response;
      }
    );
  }

  listeDemandeCertifParUtilisateur(){
    this.demandeCertifService.getAll().subscribe(
      (response) => {
        this.demandeCertifications = response;
      }
    )
  }

  // Récupération des demandes de certifications de la page courante
  get demandesCertificationsParPage(): any[] {
    const startIndex = this.pageActuelle;
    const endIndex = startIndex + this.elementsParPage;
    return this.demandeCertifications.slice(startIndex, endIndex);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeDemandeCertifications()
  }

  voirListe(): void{
    if(this.user.role.code == 'ROLE_NOTAIRE'){
      this.listeDemandeCertifications();
    }else{
      this.listeDemandeCertifParUtilisateur();
    }
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.erreur = false;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.demandeCertification = new DemandeCertification();
  }

  onUpload(event: any) {
    const uploadedFile: File = event.files[0];
    console.log(uploadedFile)
    this.documentJustificatif = uploadedFile;
    this.ajoutDemandeCertif()
  }

  onSelectFile(event: any){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      this.documentJustificatif = file;
      console.log(file)
    }
  }

  ajoutDemandeCertif(): void{

    const formValues = {
      personne: this.user
    }

    this.demandeCertifData.append('demandeCertificationJson', JSON.stringify(formValues))
    this.demandeCertifData.append('documentJustificatif', this.documentJustificatif);

    this.demandeCertifService.addDemandeCertif(this.demandeCertifData)
    .subscribe(
      (response) => {

        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La demande de certification a été ajouté avec succès!";
          this.messageService.add({ severity: 'success', summary: 'Demande de certification réussie', detail: this.messageSuccess })
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout de votre demande de certification!"
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout de la demande de certification", detail: this.messageErreur });
          this.afficherFormulaireAjouter();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  detailDemandeCertif(id: number): void {
    this.demandeCertifService.findById(id).subscribe(
      (response) => {
        this.demandeCertification = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailDemandeCertif(id);
    this.affichage = 2;
    this.visibleAddForm = 0;
  }

  certifierCompte(idPersonne: number, idDemandeCertif: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir certifier ce compte ?',
      header: "Certification de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.demandeCertifService.certifierCompte(idPersonne, idDemandeCertif).subscribe(
          (response) => {
            console.log(response);
            this.ngOnInit()
            this.voirListe();
            this.messageSuccess = "Le compte du demandeur a été certifié avec succès!";
            this.messageService.add({ severity: 'success', summary: 'Certification de compte confirmé', detail: this.messageSuccess })
          }
        );
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Certification de compte rejetée', detail: 'Vous avez rejeté la certification de ce compte !' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Certification de compte annulée', detail: 'Vous avez annulé la la certification de ce compte !' });
            break;
        }
      }
    });
  }
}
