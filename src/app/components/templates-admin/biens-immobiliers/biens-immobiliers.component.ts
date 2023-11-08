import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { TypeDeBien } from 'src/app/models/gestionDesBiensImmobiliers/TypeDeBien';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-biens-immobiliers',
  templateUrl: './biens-immobiliers.component.html',
  styleUrls: ['./biens-immobiliers.component.css']
})
export class BiensImmobiliersComponent implements OnInit {

  imagesBienImmobilier: any[] = [];
  responsiveOptions: any[] | undefined;
  typeDeBienSelectionne!: TypeDeBien;
  recherche: string = '';
  affichage = 1;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  bienImmobilier = this.bienImmobilierService.bienImmobilier;
  biensImmobiliers : BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  typesDeBien: TypeDeBien[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  bienImmobilierForm: any;
  APIEndpoint: string;
  imagePrincipale: any;
  bienImmobilierData: FormData = new  FormData();

  constructor(
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private bienImmobilierService: BienImmobilierService,
    private typeDeBienService: TypeDeBienService,
    private imagesBienImmobilierService: ImagesBienImmobilierService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
    ];
    if(this.user.role.code == 'ROLE_GERANT'){
      this.listeBiensImmobiliersParGerant();
    }
    else{
      this.listeBiensImmobiliersParProprietaire();
    }
    this.initBienImmobilierForm();
    this.listeTypesDeBien();
  }

  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id)
    .subscribe((response) => {
      this.images = response;
      console.log(response);
      }
    );
  }

  listeBiensImmobiliersParProprietaire(){
    this.bienImmobilierService.getAllByProprietaire().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  listeTypesDeBien():void{
    this.typeDeBienService.getAll().subscribe(
      (response) => {
        this.typesDeBien = response;
      }
    );
  }

  listeBiensImmobiliersParGerant(){
    this.bienImmobilierService.getAllByGerant().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    );
  }

  // Récupération des biens immobiliers de la page courante
  get biensImmobiliersParPage(): any[] {
    return this.biensImmobiliers.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    if(this.user.role.code == 'ROLE_GERANT'){
      this.listeBiensImmobiliersParGerant();
    }
    else{
      this.listeBiensImmobiliersParProprietaire();
    }
  }

  voirListe(): void{
    if(this.user.role.code == 'ROLE_GERANT'){
      this.listeBiensImmobiliersParGerant();
    }
    else{
      this.listeBiensImmobiliersParProprietaire();
    }
    this.bienImmobilierForm.reset();
    this.affichage = 1;
    this.erreur = false;
  }

  detailBienImmobilier(id: number): void {
    console.log(id)
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImmobilier = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailBienImmobilier(id);
    this.getImagesBienImmobilier(id);
    this.affichage = 4;
  }

  initBienImmobilierForm(): void {
    this.bienImmobilierForm = new FormGroup({
      adresse: new FormControl(this.bienImmobilier.adresse, [Validators.required]),
      ville: new FormControl(this.bienImmobilier.ville, [Validators.required]),
      surface: new FormControl(this.bienImmobilier.surface, [Validators.required]),
      description: new FormControl(this.bienImmobilier.description, [Validators.required]),
      typeDeBien: new FormControl('', [Validators.required]),
    })
  }

  get typeDeBien(){
    return this.bienImmobilierForm.get('typeDeBien');
  }

  get adresse(){
    return this.bienImmobilierForm.get('adresse');
  }

  get ville(){
    return this.bienImmobilierForm.get('ville');
  }

  get surface(){
    return this.bienImmobilierForm.get('surface');
  }

  get description(){
    return this.bienImmobilierForm.get('description');
  }

  telechargerImagePrincipale(event: any) {
    const uploadedFile: File = event.files[0];
    console.log(uploadedFile)
    this.imagePrincipale = uploadedFile;
    this.messageSuccess = "L'image principale du bien immobilier a été téléchargé avec succès.";
    this.messageService.add({ severity: 'info', summary: 'Téléchargement réussi', detail: this.messageSuccess })
  }


  telechargerImagesBienImmobilier(event: any) {
    for(let file of event.files) {
      this.imagesBienImmobilier.push(file);
    }
    this.messageSuccess = "Les images du bien immobilier ont été téléchargé avec succès.";
    this.messageService.add({ severity: 'info', summary: 'Téléchargement réussi', detail: this.messageSuccess })
  }

  typeDeBienChoisi(event: any) {
    this.typeDeBienSelectionne = event.value;
  }

  afficherFormulaireAjouter(): void {
    this.affichage = 2;
    this.bienImmobilier = new BienImmobilier();
  }

  afficherFormulaireModifier(id: number): void {
    this.detailBienImmobilier(id);
    this.affichage = 3;
  }

  ajouterBienImmobilier(): void {

    //Ajout de l'image principale dans le FormData
    this.bienImmobilierData.append('imagePrincipale', this.imagePrincipale);

    /*Parcours de la liste des images d'un bien immobilier en ajoutant
    celle-ci dans le FormData*/
    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('imagesBienImmobilier', image);
    }

    //Ajout des occurences d'un bien immobilier dans le FormData
    this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

    this.bienImmobilierService.addBienImmobilier(this.bienImmobilierData).subscribe(
      (response) => {
        if(response.id > 0) {
          this.bienImmobilierData.delete('imagePrincipale');
          this.bienImmobilierData.delete('imagesBienImmobilier');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else {
          this.bienImmobilierData.delete('imagePrincipale');
          this.bienImmobilierData.delete('imagesBienImmobilier');
          this.bienImmobilierData.delete('bienImmobilierJson');
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
          this.afficherFormulaireAjouter();
          this.bienImmobilier.typeDeBien = response.typeDeBien;
          this.bienImmobilier.adresse = response.adresse;
          this.bienImmobilier.ville = response.ville;
          this.bienImmobilier.surface = response.surface;
          this.bienImmobilier.description = response.description;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) => {
      this.bienImmobilierData.delete('imagePrincipale');
      this.bienImmobilierData.delete('imagesBienImmobilier');
      this.bienImmobilierData.delete('bienImmobilierJson');
      console.log(error)
      if(error.status === 409) {
        this.erreur = true;
        this.messageErreur = "Un bien immobilier avec ce nom existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }

  modifierBienImmobilier(id: number): void {

    //Ajout de l'image principale dans le FormData
    this.bienImmobilierData.append('imagePrincipale', this.imagePrincipale);

    /*Parcours de la liste des images d'un bien immobilier en ajoutant
    celle-ci dans le FormData*/
    for (const image of this.imagesBienImmobilier) {
      this.bienImmobilierData.append('imagesBienImmobilier', image);
    }

    //Ajout des occurences d'un bien immobilier dans le FormData
    this.bienImmobilierData.append('bienImmobilierJson', JSON.stringify(this.bienImmobilier));

    this.bienImmobilierService.updateBienImmobilier(id, this.bienImmobilierData).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else {
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout du bien immobilier !"
          this.afficherFormulaireAjouter();
          this.bienImmobilier.typeDeBien = response.typeDeBien;
          this.bienImmobilier.adresse = response.adresse;
          this.bienImmobilier.ville = response.ville;
          this.bienImmobilier.surface = response.surface;
          this.bienImmobilier.description = response.description;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) => {
      console.log(error)
      if(error.status === 409) {
        this.erreur = true;
        this.messageErreur = "Un bien immobilier avec ce nom existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }


  activerBienImmobilier(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce bien immobilier ?',
      header: "Activation d'un bien immobilier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bienImmobilierService.activerBienImmobilier(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été activé avec succès !";
          this.messageService.add({ severity: 'success', summary: "Activation du bien immobilier confirmée", detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: "Activation du bien immobilier rejetée", detail: "Vous avez rejeté l'activation de ce bien immobilier !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: "Activation du bien immobilier annulée", detail: "Vous avez annulé l'activation de ce bien immobilier !" });
            break;
        }
      }
    });
  }

  desactiverBienImmobilier(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce bien immobilier ?',
      header: "Désactivation d'un bien immobilier",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bienImmobilierService.desactiverBienImmobilier(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le bien immobilier a été désactivé avec succès.";
          this.messageService.add({ severity: 'success', summary: "Désactivaction du bien immobilier confirmée", detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: "Désactivation du bien immobilier rejetée", detail: 'Vous avez rejeté la désactivation de ce bien immobilier !' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: "Désactivation du bien immobilier annulée", detail: 'Vous avez annulé la désactivation de ce bien immobilier !' });
            break;
        }
      }
    });
  }

}
