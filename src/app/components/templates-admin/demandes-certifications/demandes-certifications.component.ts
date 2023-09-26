import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './demandes-certifications.component.html',
  styleUrls: ['./demandes-certifications.component.css']
})
export class DemandesCertificationsComponent implements OnInit {

  affichage = 1;
  visibleAddForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 1; // Page actuelle

  erreur: boolean = false;
  demandeCertification = this.demandeCertifService.demandeCertification;
  demandeCertifications : DemandeCertification[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  demandeCertifData: FormData = new  FormData();
  APIEndpoint: string;
  documentJustificatif: any;

  constructor(private demandeCertifService: DemandeCertificationService,
    private cookieService: CookieService){
      this.APIEndpoint = environment.APIEndpoint;
      const userCookie = this.cookieService.get('user');
      this.user = JSON.parse(userCookie);
  }

  ngOnInit(): void {
    if(this.user.role.code == 'ROLE_NOTAIRE'){
      this.listeDemandeCertifications();
    }else{
      this.listeDemandeCertifParUtilisateur();
    }
  }

  listeDemandeCertifications(){
    this.demandeCertifService.getAll()
    .subscribe(response=>{
      this.demandeCertifications = response;
    })
  }

  listeDemandeCertifParUtilisateur(){
    this.demandeCertifService.getAll()
    .subscribe(response=>{
      this.demandeCertifications = response;
    })
  }

  // Récupération des demandes de certifications de la page courante
  get demandesCertificationsParPage(): any[] {
    const startIndex = (this.pageActuelle - 1) * this.elementsParPage;
    const endIndex = startIndex + this.elementsParPage;
    return this.demandeCertifications.slice(startIndex, endIndex);
  }

  // Fonction pour passer à la page précédente
  pagePrecedente() {
    if (this.pageActuelle > 1) {
      this.pageActuelle--;
    }
  }

  // Fonction pour passer à la page suivante
  pageSuivante() {
    if (this.pageActuelle < this.totalPages) {
      this.pageActuelle++;
    }
  }

  // Calcul du nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.demandeCertifications.length / this.elementsParPage);
  }

  // Génération du tableau des numéros de page
  get pages(): number[] {
    const totalPagesToShow = 3; // Nombre total de pages à afficher avant d'afficher "..." et la dernière page

    if (this.totalPages <= totalPagesToShow) {
      return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    // Affiche les 3 premières pages
    const firstPages = Array(totalPagesToShow).fill(0).map((x, i) => i + 1);

    // Affiche "..." et la dernière page
    const lastPage = this.totalPages;
    return [...firstPages, -1, lastPage];
  }

  // Fonction pour définir la page actuelle
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
    }
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

  onSelectFile(event: any){
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      this.documentJustificatif = file;
    }
  }

  ajoutDemandeCertif(): void{
    const formValues = {
      personne: this.user
    }
    console.log(this.documentJustificatif)
    console.log(JSON.stringify(formValues))
    this.demandeCertifData.append('demandeCertificationJson', JSON.stringify(formValues))
    this.demandeCertifData.append('documentJustificatif', this.documentJustificatif);
    this.demandeCertifService.addDemandeCertif(this.demandeCertifData)
    .subscribe(
      (response) => {
        console.log(response);
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La demande de certification a été ajouté avec succès!";
          setTimeout(() => {
            this.messageSuccess = null;
          }, 3000);
        }
        else{
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout de votre demande de certification!"
          setTimeout(() => {
            this.erreur = false;
            this.messageErreur = "";
          }, 3000);
          this.afficherFormulaireAjouter();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  detailDemandeCertif(id: number): void {
    console.log(id)
    this.demandeCertifService.findById(id)
    .subscribe(response=>{
      this.demandeCertification = response;
    })
  }

  afficherPageDetail(id: number): void {
    this.detailDemandeCertif(id);
    this.affichage = 2;
    this.visibleAddForm = 0;
  }

  certifierCompte(idPersonne: number, idDemandeCertif: number): void{
    this.demandeCertifService.certifierCompte(idPersonne, idDemandeCertif).subscribe(response=>{
      console.log(response);
      this.ngOnInit()
      this.voirListe();
      this.messageSuccess = "Le compte de l'utilisateur a été certifié avec succès!";
      setTimeout(() => {
        this.messageSuccess = null;
      }, 3000);
    });
  }
}
