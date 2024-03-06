import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agences-immobilieres',
  templateUrl: './agences-immobilieres.component.html',
  styleUrls: ['./agences-immobilieres.component.css']
})
export class AgencesImmobilieresComponent implements OnInit, OnDestroy {

  recherche: string = '';
  logoURL: any;
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user: any;
  menus: MenuItem[] | undefined;
  activeIndex: number = 0;
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  agencesImmobilieres!: Page<AgenceImmobiliere>;
  affectationsResponsableAgences!: Page<AffectationResponsableAgence>;
  agencesOfAgent!: Page<AffectationResponsableAgence>;
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  affectationResponsableAgence: AffectationResponsableAgence = new AffectationResponsableAgence();
  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  agenceStep1Form: any;
  agenceStep2Form: any;
  APIEndpoint: string;
  logoAgence: any;
  agenceImmobiliereData: FormData = new  FormData();

  heureMin = new Date('1970-01-02T06:00:00');
  heureMax = new Date('1970-01-02T23:59:59');

  constructor(
    private agenceImmobiliereService: AgenceImmobiliereService,
    private affectationAgentAgenceService: AffectationAgentAgenceService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private paysService: PaysService,
    private regionService: RegionService,
    private villeService: VilleService,
    private quartierService: QuartierService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeAgenceImmobilieresResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listerAgencesImmobilieresParAgentImmobilier(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listeAgencesImmobilieres(this.numeroDeLaPage, this.elementsParPage);
    }
    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.initAgenceStep1Form();
    this.initAgenceStep2Form();
    this.menusOfAgence();
  }

  menusOfAgence(): void {
    this.menus = [
      {
          label: 'Description',
          command: (event: any) => this.messageService.add({severity:'info', summary:'1ère étape', detail: event.item.label})
      },
      {
          label: 'Localisation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'2ème étape', detail: event.item.label})
      },
      {
          label: 'Confirmation',
          command: (event: any) => this.messageService.add({severity:'info', summary:'3ème étape', detail: event.item.label})
      },
    ];
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  //Fonction pour recupérer la liste des pays actifs
  listePaysActifs(): void {
    this.paysService.getPaysActifs().subscribe(
      (response) => {
        this.listeDesPays = response;
      }
    );
  }

  //Fonction pour recupérer la liste des régions actives
  listeRegionsActives(): void {
    this.regionService.getRegionsActives().subscribe(
      (response) => {
        this.regions = response;
      }
    );
  }

  //Fonction pour recupérer la liste des villes actives
  listeVillesActives(): void {
    this.villeService.getVillesActives().subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  //Fonction pour recupérer la liste des quartiers actifs
  listeQuartiersActifs(): void {
    this.quartierService.getQuartiersActifs().subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  //Fonction pour recupérer la liste des agences immobilières
  listeAgencesImmobilieres(numeroDeLaPage: number, elementsParPage: number) {
    this.agenceImmobiliereService.getAffectationsResponsableAgence(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.affectationsResponsableAgences = response;
      }
    );
  }

  //Fonction pour recupérer les agences immobilières par responsable
  listeAgenceImmobilieresResponsable(numeroDeLaPage: number, elementsParPage: number) {
    this.agenceImmobiliereService.findAgencesByResponsablePaginees(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Lister les agences immobilières par agent immobilier
  listerAgencesImmobilieresParAgentImmobilier(numeroDeLaPage: number, elementsParPage: number) {
    this.affectationAgentAgenceService.getAgencesOfAgentPaginees(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.agencesOfAgent = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeAgenceImmobilieresResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listerAgencesImmobilieresParAgentImmobilier(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listeAgencesImmobilieres(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  paginationListeServices(event: any) {
    const idAgence = localStorage.getItem('idAgence');
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeServices(parseInt(idAgence!), this.numeroDeLaPage, this.elementsParPage);
  }

  telecharger(event: any) {
    const uploadedFile: File = event.files[0];
    this.logoAgence = uploadedFile;

    var reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = (_event)=>{
    this.logoURL = reader.result;
    }
    this.messageSuccess = "Le logo de l'agence immobilière a été téléchargé avec succès.";
    this.messageService.add({
      severity: 'info',
      summary: 'Opération de téléchargement réussie',
      detail: this.messageSuccess
    });
  }

  voirListe(): void {
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listeAgenceImmobilieresResponsable(this.numeroDeLaPage, this.elementsParPage);
    } else if (this.user.role.code == 'ROLE_AGENTIMMOBILIER') {
      this.listerAgencesImmobilieresParAgentImmobilier(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listeAgencesImmobilieres(this.numeroDeLaPage, this.elementsParPage);
    }
    this.logoAgence = '';
    this.agenceImmobiliereData.delete('logoAgence');
    this.agenceImmobiliereData.delete('agenceImmobiliereJson');
    this.agenceStep1Form.reset();
    this.agenceStep2Form.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
  }

  listeServices(id: number, numeroDeLaPage: number, elementsParPage: number): void {
    this.servicesAgenceImmobiliereService.findServicesOfAgencePagines(id, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.servicesAgenceImmobiliere = response;
      }
    );
  }

  afficherListeServices(id: number): void {
    this.detailAgenceImmobiliere(id);
    this.listeServices(id, this.numeroDeLaPage, this.elementsParPage);
    localStorage.setItem('idAgence', id.toString());
    this.affichage = 3;
  }

  detailService(id: number): void {
    this.servicesAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.serviceAgenceImmobiliere = response;
      }
    );
  }

  voirListeServices(): void {
    this.affichage = 3;
    const idAgence = localStorage.getItem('idAgence');
    this.listeServices(parseInt(idAgence!), this.numeroDeLaPage, this.elementsParPage);
  }

  afficherPageDetailService(id: number): void {
    this.detailService(id);
    this.affichage = 4;
  }

  detailAgenceImmobiliere(id: number): void {
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.agenceImmobiliereService.findById(id).subscribe(
        (response) => {
          this.agenceImmobiliere = response;
        }
      );
    } else {
      this.agenceImmobiliereService.detailAffectation(id).subscribe(
        (response) => {
          this.affectationResponsableAgence = response;
        }
      )
    }
  }

  afficherPageDetail(id: number): void {
    this.detailAgenceImmobiliere(id);
    this.affichage = 2;
  }


  //Fonction pour sélectionner un pays
  paysChoisi(event: any) {
    this.paysSelectionne = event.value;
    this.regionService.getRegionsByPaysId(this.paysSelectionne.id).subscribe(
      (response) => {
        this.regions = response;
      }
    );
    this.regionSelectionnee = new Region();
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une région
  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
    this.villeService.getVillesByRegionId(this.regionSelectionnee.id).subscribe(
      (response) => {
        this.villes = response;
      }
    );
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner une ville
  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
    this.quartierService.getQuartiersByVilleId(this.villeSelectionnee.id).subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
    this.quartierSelectionne = new Quartier();
  }

  //Fonction pour sélectionner un quartier
  quartierChoisi(event: any) {
    this.quartierSelectionne = event.value;
  }

  initAgenceStep2Form(): void {
    this.agenceStep2Form = new FormGroup({
      pays: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      quartier: new FormControl('', [Validators.required]),
      adresse: new FormControl('')
    });
  }

  initAgenceStep1Form(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.agenceStep1Form = new FormGroup({
      nomAgence: new FormControl('', [Validators.required]),
      telephone: new FormControl('', [Validators.required]),
      adresseEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      heureOuverture: new FormControl('', [Validators.required]),
      heureFermeture: new FormControl('', [Validators.required]),
      description: new FormControl('')
    }, [
        this.validateurHeureOuverture("heureOuverture"),
        this.validateurHeureFermeture("heureFermeture"),
        this.validateurHeures("heureOuverture", "heureFermeture")
      ]);
  }

  get nomAgence() {
    return this.agenceStep1Form.get('nomAgence');
  }

  get telephone() {
    return this.agenceStep1Form.get('telephone');
  }

  get adresseEmail() {
    return this.agenceStep1Form.get('adresseEmail')
  }

  get description() {
    return this.agenceStep1Form.get('description');
  }

  get heureOuverture() {
    return this.agenceStep1Form.get('heureOuverture');
  }

  get heureFermeture() {
    return this.agenceStep1Form.get('heureFermeture');
  }

  get pays() {
    return this.agenceStep2Form.get('pays');
  }

  get region() {
    return this.agenceStep2Form.get('region');
  }

  get ville() {
    return this.agenceStep2Form.get('ville');
  }

  get quartier() {
    return this.agenceStep2Form.get('quartier');
  }

  get adresse() {
    return this.agenceStep2Form.get('adresse');
  }

  resetAgenceStep1Form(): void {
    this.logoAgence = '';
    this.agenceStep1Form.reset();
  }

  etape1(): void {
    this.activeIndex = 0;
    this.onActiveIndexChange(this.activeIndex);
  }

  etape2(): void {
    this.activeIndex = 1;
    this.onActiveIndexChange(this.activeIndex);
  }

  etape3(): void {
    this.activeIndex = 2;
    this.onActiveIndexChange(this.activeIndex);
  }


  validateurHeureOuverture(heureOuverture: string) {
    return function (control: AbstractControl) {

      const heureOuvertureValue = control.get(heureOuverture)?.value;
      if (!heureOuvertureValue || !/^\d{2}:\d{2}$/.test(heureOuvertureValue)) {
        return {}; // Valeur invalide
      }
      if (heureOuvertureValue) {
        // Convertir les valeurs en objets Date
        const dateOuverture = new Date('1970-01-02T' + heureOuvertureValue);
        //console.log(error)(dateOuverture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure d'ouverture en millisecondes depuis l'époque
        const dateOuvertureMs = dateOuverture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        //console.log(error)(heureMinMs)
        //console.log(error)(heureMaxMs)
        //console.log(error)(dateOuvertureMs)
        // Vérifiez si l'heure d'ouverture se trouve entre 6h et minuit
        if (dateOuvertureMs >= heureMinMs && dateOuvertureMs <= heureMaxMs) {
          return null;
        } else {
          return { heureOuvertureHorsPlage: true };
        }
      }
      return null;
    };
  }

  validateurHeureFermeture(heureFermeture: string) {
    return function (control: AbstractControl) {

      const heureFermetureValue = control.get(heureFermeture)?.value;
      if (!heureFermetureValue || !/^\d{2}:\d{2}$/.test(heureFermetureValue)) {
        return {}; // Valeur invalide
      }
      if (heureFermetureValue) {
        // Convertir les valeurs en objets Date
        const dateFermeture = new Date('1970-01-02T' + heureFermetureValue);
        //console.log(error)(dateFermeture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure de fermeture en millisecondes depuis l'époque
        const dateFermetureMs = dateFermeture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        //console.log(error)(heureMinMs)
        //console.log(error)(heureMaxMs)
        //console.log(error)(dateFermetureMs)
        // Vérifiez si l'heure de fermeture se trouve entre 6h et minuit
        if (dateFermetureMs >= heureMinMs && dateFermetureMs <= heureMaxMs) {
          return null;
        } else {
          return { heureFermetureHorsPlage: true };
        }
      }
      return null;
    };
  }

  validateurHeures(heureOuverture: string, heureFermeture: string) {
    const heureRegex = /^\d{2}:\d{2}$/;
    return function (control: AbstractControl) {

      const heureOuvertureValue = control.get(heureOuverture)?.value;
      const heureFermetureValue = control.get(heureFermeture)?.value;

      if (
        (!heureOuvertureValue || !heureRegex.test(heureOuvertureValue)) ||
        (!heureFermetureValue || !heureRegex.test(heureFermetureValue))
      ) {
        return {}; // Valeur invalide pour l'heure d'ouverture ou de fermeture
      }

      if (heureOuvertureValue && heureFermetureValue) {
        // Convertir les valeurs en objets Date
        const dateOuverture = new Date('1970-01-02T' + heureOuvertureValue);
        const dateFermeture = new Date('1970-01-02T' + heureFermetureValue);
        //console.log(error)(dateFermeture);
        //console.log(error)(dateOuverture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure de fermeture en millisecondes depuis l'époque
        const dateOuvertureMs = dateOuverture.getTime();
        const dateFermetureMs = dateFermeture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        //console.log(error)(heureMinMs)
        //console.log(error)(heureMaxMs)
        //console.log(error)(dateFermetureMs)
        //console.log(error)(dateOuvertureMs)

        if (dateOuvertureMs > dateFermetureMs){
          return { heureOuvertureSuperieure: true}
        } else if (dateFermetureMs < dateOuvertureMs){
          return { heuureFermetureInferieure: true }
        } else if (dateOuvertureMs == dateFermetureMs){
          return { heureFermetureEgale: true }
        } else if (dateFermetureMs == dateOuvertureMs){
          return { heureOuvertureEgale: true }
        } else {
          return null;
        }
      }
      return null;
    };
  }

  afficherFormulaireAjouter(): void {
    this.activeIndex = 0;
    this.affichage = 0;
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.agenceImmobiliere = new AgenceImmobiliere();
  }

  afficherFormulaireModifier(id: number): void {
    this.activeIndex = 0;
    this.detailAgenceImmobiliere(id);
    this.affichage = 0;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 1;
  }

  ajouterAgenceImmobiliere(): void {

    this.agenceImmobiliere.quartier = this.quartierSelectionne;

    this.agenceImmobiliereData.append('logoAgence', this.logoAgence);
    this.agenceImmobiliereData.append('agenceImmobiliereJson', JSON.stringify(this.agenceImmobiliere));

    this.agenceImmobiliereService.addAgenceImmobiliere(this.agenceImmobiliereData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Votre agence immobilière a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de votre agence immobilière !"
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      if (error.status == 409) {
        this.messageErreur = "Une agence immobilière avec ce nom existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'ajout",
          detail: this.messageErreur
        });
      }
    })
  }

  modifierAgenceImmobiliere(id: number): void {

    this.agenceImmobiliereData.append('logoAgence', this.logoAgence);
    this.agenceImmobiliereData.append('agenceImmobiliereJson', JSON.stringify(this.agenceImmobiliere));

    this.agenceImmobiliereService.updateAgenceImmobiliere(id, this.agenceImmobiliereData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Votre agence immobilière a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de la modification de votre agence immobilière !";
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur modification',
            detail: this.messageErreur
          });
        }
    },
    (error) => {
      if (error.status == 409) {
        this.messageErreur = "Une agence immobilière avec ce nom existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Modification non réussie',
          detail: this.messageErreur
        });
      }
    })
  }

  activerAgence(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette agence immobilière ?',
      header: "Activation d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agenceImmobiliereService.activerAgence(id).subscribe(
        (response) => {
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: "Activation de l'agence immobilière confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Activation de l'agence immobilière rejetée",
              detail: "Vous avez rejeté l'activation de cette agence immobilière !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Activation de l'agence immobilière annulée",
              detail: "Vous avez annulé l'activation de cette agence immobilière !"
            });
            break;
        }
      }
    });
  }

  desactiverAgence(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette agence immobilière ?',
      header: "Désactivation d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agenceImmobiliereService.desactiverAgence(id).subscribe(
        (response) => {
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: "Désactivaction de l'agence immobilière confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Désactivation de l'agence immobilière rejetée",
              detail: 'Vous avez rejeté la désactivation de cette agence immobilière !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Désactivation de l'agence immobilière annulée",
              detail: 'Vous avez annulé la désactivation de cette agence immobilière !'
            });
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {

  }
}
