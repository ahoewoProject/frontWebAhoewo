import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { BienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/BienImmobilier';
import { Caracteristiques } from 'src/app/models/gestionDesBiensImmobiliers/Caracteristiques';
import { ImagesBienImmobilier } from 'src/app/models/gestionDesBiensImmobiliers/ImagesBienImmobilier';
import { Publication } from 'src/app/models/gestionDesPublications/Publication';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { CaracteristiquesService } from 'src/app/services/gestionDesBiensImmobiliers/caracteristiques.service';
import { ImagesBienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/images-bien-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PublicationService } from 'src/app/services/gestionDesPublications/publication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit, OnDestroy {

  recherche: string = '';
  affichage = 1;
  responsiveOptions: any[] | undefined;
  typesDeTransactions: string[] = [];
  typeDeTransactionSelectionne!: string;
  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  user: any;
  biensImmobiliers: BienImmobilier[] = [];
  images: ImagesBienImmobilier[] = [];
  bienImm!: any;
  bienSelectionne!: BienImmobilier;
  publication = this.publicationService.publication;
  publications!: Page<Publication>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  caracteristique: Caracteristiques = new Caracteristiques();

  APIEndpoint: string;
  publicationForm: any;
  publicationReussie: any;

  constructor(private publicationService: PublicationService, private activatedRoute: ActivatedRoute,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private personneService: PersonneService, private caracteristiquesServices: CaracteristiquesService,
    private imagesBienImmobilierService: ImagesBienImmobilierService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.publicationReussie = this.activatedRoute.snapshot.queryParams['publicationReussie'];

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

    this.initialiserPublicationForm();
    this.publicationForm.get('prixDuBien').valueChanges.subscribe((value: number) => {
      this.updateCommissionInputState(value);
    });
    if (this.user.role.code == 'ROLE_PROPRIETAIRE') {
      this.listeBiensPropres();
    } else {
      this.listeBiensPropresEtDelegues();
    }
    this.listePublications(this.numeroDeLaPage, this.elementsParPage);
    this.listeTypeDeTransactions();
  }

  //Fonction pour recupérer les images associées à un bien immobilier
  getImagesBienImmobilier(id: number): void {
    this.imagesBienImmobilierService.getImagesByBienImmobilier(id).subscribe(
      (response) => {
        this.images = response;
      }
    );
  }

  initialiserPublicationForm(): void {
    this.publicationForm = new FormGroup({
      bienImmobilier: new FormControl('', [Validators.required]),
      typeDeTransaction: new FormControl('', [Validators.required]),
      libelle: new FormControl('', [Validators.required]),
      prixDuBien: new FormControl('', [Validators.required]),
      avance: new FormControl(''),
      caution: new FormControl(''),
      commission: new FormControl({value: '', disabled: true}),
    })
  }

  updateCommissionInputState(prix: number): void {
    const commissionControl = this.publicationForm.get('commission');
    if (this.typeDeTransactionSelectionne == 'Vente' && prix <= 100000000) {
      commissionControl.setValue(10);
      commissionControl.disable();
    } else {
      commissionControl.enable();
    }
  }

  get avance () {
    return this.publicationForm.get('avance');
  }

  get caution () {
    return this.publicationForm.get('caution');
  }

  get commission () {
    return this.publicationForm.get('commission');
  }

  get bienImmobilier() {
    return this.publicationForm.get('bienImmobilier');
  }

  get typeDeTransaction() {
    return this.publicationForm.get('typeDeTransaction');
  }

  get libelle() {
    return this.publicationForm.get('libelle');
  }

  get prixDuBien() {
    return this.publicationForm.get('prixDuBien');
  }

  // Liste des biens propres et délégués(Responsable, Agent immobilier, Démarcheur, Gérant)
  listeBiensPropresEtDelegues(): void {
    this.bienImmobilierService.getBiensPropresDelegues().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  // Liste des biens d'un propriétaire
  listeBiensPropres(): void {
    this.bienImmobilierService.getBiensByProprietaire().subscribe(
      (response) => {
        this.biensImmobiliers = response;
      }
    )
  }

  listePublications(numeroDeLaPage: number, elementsParPage: number): void {
    this.publicationService.getPublications(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.publications = response;
        if (this.publicationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Publication réussie', detail: 'Le bien correspondant a été publié avec succès.' });
        }
      }
    )
  }

  detailPublication(id: number): void {
    this.publicationService.findById(id).subscribe(
      (response) => {
        this.publication = response;
        this.bienSelectionne = this.publication.bienImmobilier;
        this.typeDeTransactionSelectionne = this.publication.typeDeTransaction;
        if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation) ||
          this.isTypeBienTerrain(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienImmobilier(this.publication.bienImmobilier.id);
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.detailBienAssocie(this.publication.bienImmobilier.id);
        }

        if (this.isTypeBienTerrain(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Vente'];
        } else if (this.isTypeDeBienSupport(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Location', 'Vente'];
        } else if (this.isTypeDeBienAssocie(this.publication.bienImmobilier.typeDeBien.designation)) {
          this.typesDeTransactions = ['Location'];
        }
      }
    )
  }

  voirPageDetail(idPublication: number, idBien: number): void {
    this.affichage = 2;
    this.getImagesBienImmobilier(idBien);
    this.detailPublication(idPublication);
  }

  pagination(event: any): void {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listePublications(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.affichage = 1;
    this.publicationForm.reset();
    this.caracteristique = new Caracteristiques();
    this.listePublications(this.numeroDeLaPage, this.elementsParPage);
  }

  //Fonction pour afficher les détails d'un bien immobilier
  detailBienImmobilier(id: number): void {
    this.bienImmobilierService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        if (!this.isTypeBienTerrain(this.bienImm.typeDeBien.designation)) {
          this.detailCaracteristiquesBien(id);
        }
      }
    );
  }

  //Fonction pour afficher les détails d'un bien associé
  detailBienAssocie(id: number): void {
    this.bienImmAssocieService.findById(id).subscribe(
      (response) => {
        this.bienImm = response;
        this.detailCaracteristiquesBien(id);
      }
    );
  }


  //Détails caracteristiques d'un bien
  detailCaracteristiquesBien(id: number) {
    this.caracteristiquesServices.getCaracteristiquesOfBienImmobilier(id).subscribe(
      (response) => {
        this.caracteristique = response;
      }
    );
  }

  listeTypeDeTransactions(): void {
    this.typesDeTransactions = ['Location', 'Vente'];
    this.typeDeTransactionSelectionne = this.typesDeTransactions[0];
  }

  bienChoisi(event: any) {
    this.bienSelectionne = event.value;
    if (this.isTypeBienTerrain(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienSupport(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location', 'Vente'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    } else if (this.isTypeDeBienAssocie(this.bienSelectionne.typeDeBien.designation)) {
      this.typesDeTransactions = ['Location'];
      this.typeDeTransactionSelectionne = this.typesDeTransactions[0]
    }
    console.log(this.typeDeTransactionSelectionne)
  }

  typeDeTransactionChoisi(event: any) {
    this.typeDeTransactionSelectionne = event.value;
  }

  voirFormulaireAjouter(): void {
    this.affichage = 3;
  }

  ajouterPublication(): void {
    this.publication.bienImmobilier = this.bienSelectionne;
    this.publication.typeDeTransaction = this.typeDeTransactionSelectionne;
    this.publicationService.ajouterPublication(this.publication).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La publication a été ajouté avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Publication réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de l'ajout !";
          this.messageService.add({
            severity: 'error',
            summary: 'Publication échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        if (error.error == "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        } else if (error.error == "Une publication avec un des biens associés à ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        } else if (error.error == "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Publication non réussie',
            detail: error.error
          });
        }
      }
    )
  }

  voirFormulaireModifier(id: number): void {
    this.detailPublication(id);
    console.log(this.publication);
    this.affichage = 4;
  }

  modifierPublication(): void {
    this.publicationService.updatePublication(this.publication.id, this.publication).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "La publication a été modifié avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          })
        } else {
          this.messageErreur = "Une erreur s'est produite lors de la modification !";
          this.messageService.add({
            severity: 'error',
            summary: 'Modification échouée',
            detail: this.messageErreur
          })
        }
      },
      (error) => {
        // console.log(error)
        // if (error.error == "Une publication avec ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // } else if (error.error == "Une publication avec un des biens associés à ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // } else if (error.error == "Une publication avec le bien support auquel est associé ce bien est toujours active. Veuillez désactiver la publication avant d'en ajouter une autre.") {
        //   this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Modification non réussie',
        //     detail: error.error
        //   });
        // }
      }
    )
  }

  activerPublication(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette publication ?',
      header: "Activation d'une publication",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publicationService.activerPublication(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La publication a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation d\'une publication confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de la publication rejetée',
              detail: "Vous avez rejeté l'activation de cette publication !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de la publication annulée',
              detail: "Vous avez annulé l'activation de cette publication !"
            });
            break;
        }
      }
    });
  }

  desactiverPublication(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette publication ?',
      header: "Désactivaction d'une publication",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.publicationService.desactiverPublication(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "La publication a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation d\'une publication confirmée',
            detail: this.messageSuccess
          })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de la publication rejetée',
              detail: "Vous avez rejeté la désactivation de cette publication !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de la publication annulée',
              detail: "Vous avez annulé la désactivation de cette publication !"
            });
            break;
        }
      }
    });
  }

  resetPublicationForm(): void {
    this.publicationForm.reset();
  }

  private isTypeBienTerrain(designation :string): boolean {
    return designation === "Terrain";
  }

  private isTypeDeBienSupport(designation: string): boolean {
    return designation === "Maison" || designation === 'Villa' || designation === "Immeuble";
  }

  private isTypeDeBienAssocie(designation: string): boolean {
    return designation === "Appartement" || designation === "Chambre salon" || designation === "Chambre" ||
      designation === "Bureau" || designation === "Magasin" || designation === "Boutique";
  }

  afficherCommission(): boolean {
    return (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER' || this.user.role.code == 'ROLE_DEMARCHEUR')
    && (this.typeDeTransactionSelectionne == 'Location' || this.typeDeTransactionSelectionne == 'Vente');
  }

  afficherAvanceEtCaution(): boolean {
    return this.typeDeTransactionSelectionne == 'Location'
  }

  afficherFraisDeVisite(): boolean {
    return (this.user.role.code == 'ROLE_RESPONSABLE' || this.user.role.code == 'ROLE_AGENTIMMOBILIER' || this.user.role.code == 'ROLE_DEMARCHEUR');
  }

  afficherCategorie(): boolean {
    return this.bienImm.typeDeBien.designation == 'Maison' ||
    this.bienImm.typeDeBien.designation == 'Villa' ||
    this.bienImm.typeDeBien.designation == 'Immeuble' ||
    this.bienImm.typeDeBien.designation == 'Appartement' ||
    this.bienImm.typeDeBien.designation == 'Chambre salon' ||
    this.bienImm.typeDeBien.designation == 'Chambre' ||
    this.bienImm.typeDeBien.designation == 'Bureau';
  }

  afficherCaracteristique(): boolean {
    return this.bienImm.typeDeBien.designation == 'Maison' ||
    this.bienImm.typeDeBien.designation == 'Villa' ||
    this.bienImm.typeDeBien.designation == 'Immeuble' ||
    this.bienImm.typeDeBien.designation == 'Appartement' ||
    this.bienImm.typeDeBien.designation == 'Chambre salon' ||
    this.bienImm.typeDeBien.designation == 'Chambre' ||
    this.bienImm.typeDeBien.designation == 'Bureau' ||
    this.bienImm.typeDeBien.designation == 'Magasin' ||
    this.bienImm.typeDeBien.designation == 'Boutique';
  }

  ngOnDestroy(): void {

  }
}
