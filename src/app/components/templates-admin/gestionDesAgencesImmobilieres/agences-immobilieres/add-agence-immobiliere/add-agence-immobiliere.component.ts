import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PaysService } from 'src/app/services/gestionDesBiensImmobiliers/pays.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-add-agence-immobiliere',
  templateUrl: './add-agence-immobiliere.component.html',
  styleUrls: ['./add-agence-immobiliere.component.css']
})
export class AddAgenceImmobiliereComponent implements OnInit, OnDestroy {

  logoURL: any;
  user: any;
  menus: MenuItem[] | undefined;
  activeIndex: number = 0;
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();

  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  listeDesPays: Pays[] = [];
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  agenceStep1Form: any;
  agenceStep2Form: any;
  logoAgence: any;
  agenceImmobiliereData: FormData = new  FormData();

  heureMin = new Date('1970-01-02T06:00:00');
  heureMax = new Date('1970-01-02T23:59:59');

  constructor(
    private messageService: MessageService, private paysService: PaysService,
    private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private agenceImmobiliereService: AgenceImmobiliereService,
    private router: Router, private personneService: PersonneService
  ) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.listePaysActifs();
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.menusOfAgence();
    this.initAgenceStep1Form();
    this.initAgenceStep2Form();
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

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres']);
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

  ajouterAgenceImmobiliere(): void {

    this.agenceImmobiliere.quartier = this.quartierSelectionne;

    this.agenceImmobiliereData.append('logoAgence', this.logoAgence);
    this.agenceImmobiliereData.append('agenceImmobiliereJson', JSON.stringify(this.agenceImmobiliere));

    this.agenceImmobiliereService.addAgenceImmobiliere(this.agenceImmobiliereData).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres'], { queryParams: { ajoutReussi: true } });
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

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_ADMINISTRATEUR':
        roleBasedURL = '/admin';
        break;
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier';
        break;
      case 'ROLE_CLIENT':
        roleBasedURL = '/client';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  ngOnDestroy(): void {

  }
}
