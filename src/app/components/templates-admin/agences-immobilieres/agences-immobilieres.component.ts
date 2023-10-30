import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agences-immobilieres',
  templateUrl: './agences-immobilieres.component.html',
  styleUrls: ['./agences-immobilieres.component.css']
})
export class AgencesImmobilieresComponent implements OnInit {

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  erreur: boolean = false;
  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  agencesImmobilieres : AgenceImmobiliere[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;
  agenceImmobiliereForm: any;
  APIEndpoint: string;
  logoAgence: any;
  agenceImmobiliereData: FormData = new  FormData();

  heureMin = new Date('1970-01-02T06:00:00');
  heureMax = new Date('1970-01-02T23:59:59');

  constructor(
    private agenceImmobiliereService: AgenceImmobiliereService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if(this.user.role.code == 'ROLE_AGENTIMMOBILIER'){
      this.listeAgenceImmobiliere();
    }
    else{
      this.listeAgencesImmobilieres();
    }
    this.initAgenceImmobiliereForm();
  }

  listeAgencesImmobilieres(){
    this.agenceImmobiliereService.getAll().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  listeAgenceImmobiliere(){
    this.agenceImmobiliereService.getAllByAgentImmobilier().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  // Récupération des agences immobilières de la page courante
  get agencesImmobilieresParPage(): any[] {
    return this.agencesImmobilieres.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeAgencesImmobilieres()
  }

  telecharger(event: any) {
    const uploadedFile: File = event.files[0];
    console.log(uploadedFile)
    this.logoAgence = uploadedFile;
    this.messageSuccess = "Le logo de l'agence immobilière a été téléchargé avec succès.";
    this.messageService.add({ severity: 'info', summary: 'Téléchargement réussi', detail: this.messageSuccess })
  }

  voirListe(): void{
    if(this.user.role.code == 'ROLE_AGENTIMMOBILIER'){
      this.listeAgenceImmobiliere();
    }
    else{
      this.listeAgencesImmobilieres();
    }
    this.agenceImmobiliereForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 0;
    this.erreur = false;
  }

  detailAgenceImmobiliere(id: number): void {
    console.log(id)
    this.agenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.agenceImmobiliere = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailAgenceImmobiliere(id);
    this.affichage = 2;
  }

  initAgenceImmobiliereForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.agenceImmobiliereForm = new FormGroup({
      nomAgence: new FormControl(this.agenceImmobiliere.nomAgence, [Validators.required]),
      adresse: new FormControl(this.agenceImmobiliere.adresse, [Validators.required]),
      telephone: new FormControl(this.agenceImmobiliere.telephone, [Validators.required]),
      adresseEmail: new FormControl(this.agenceImmobiliere.adresseEmail, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      heureOuverture: new FormControl('', [Validators.required]),
      heureFermeture: new FormControl('', [Validators.required]),
    }, [
        this.validateurHeureOuverture("heureOuverture"),
        this.validateurHeureFermeture("heureFermeture"),
        this.validateurHeures("heureOuverture", "heureFermeture")
      ]);
  }

  get nomAgence(){
    return this.agenceImmobiliereForm.get('nomAgence');
  }

  get adresse(){
    return this.agenceImmobiliereForm.get('adresse');
  }

  get telephone(){
    return this.agenceImmobiliereForm.get('telephone');
  }

  get adresseEmail(){
    return this.agenceImmobiliereForm.get('adresseEmail')
  }


  get heureOuverture(){
    return this.agenceImmobiliereForm.get('heureOuverture');
  }

  get heureFermeture(){
    return this.agenceImmobiliereForm.get('heureFermeture');
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
        console.log(dateOuverture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure d'ouverture en millisecondes depuis l'époque
        const dateOuvertureMs = dateOuverture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        console.log(heureMinMs)
        console.log(heureMaxMs)
        console.log(dateOuvertureMs)
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
        console.log(dateFermeture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure de fermeture en millisecondes depuis l'époque
        const dateFermetureMs = dateFermeture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        console.log(heureMinMs)
        console.log(heureMaxMs)
        console.log(dateFermetureMs)
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
        console.log(dateFermeture);
        console.log(dateOuverture);
        // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
        const heureMin = new Date('1970-01-02T06:00:00');
        const heureMax = new Date('1970-01-02T23:59:59');

        // Convertissez l'heure de fermeture en millisecondes depuis l'époque
        const dateOuvertureMs = dateOuverture.getTime();
        const dateFermetureMs = dateFermeture.getTime();

        // Convertissez les heures minimales et maximales en millisecondes
        const heureMinMs = heureMin.getTime();
        const heureMaxMs = heureMax.getTime();
        console.log(heureMinMs)
        console.log(heureMaxMs)
        console.log(dateFermetureMs)
        console.log(dateOuvertureMs)

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

  // plageHeureOuverture(): boolean {
  //   if (!this.heureOuverture.value || !/^\d{2}:\d{2}$/.test(this.heureOuverture.value)) {
  //     return true; // Valeur invalide
  //   }
  //   const dateOuverture = new Date('1970-01-02T' + this.heureOuverture.value);
  //   console.log(dateOuverture);
  //   // Les heures doivent être comprises entre 6h (06:00) et minuit (00:00)
  //   const heureMin = new Date('1970-01-02T06:00:00');
  //   const heureMax = new Date('1970-01-02T23:59:59');

  //   // Convertissez l'heure d'ouverture et de fermeture en millisecondes depuis l'époque
  //   const dateOuvertureMs = dateOuverture.getTime();

  //   // Convertissez les heures minimales et maximales en millisecondes
  //   const heureMinMs = heureMin.getTime();
  //   const heureMaxMs = heureMax.getTime();
  //   console.log(heureMinMs)
  //   console.log(heureMaxMs)
  //   console.log(dateOuvertureMs)
  //   // Vérifiez si l'heure d'ouverture et de fermeture se trouve entre 6h et minuit
  //   if (dateOuvertureMs >= heureMinMs && dateOuvertureMs <= heureMaxMs) {
  //       return true;
  //   }
  //   return false;
  // }


  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.visibleUpdateForm = 0;
    this.agenceImmobiliere = new AgenceImmobiliere();
  }

  afficherFormulaireModifier(id: number): void {
    this.detailAgenceImmobiliere(id);
    this.visibleAddForm = 0;
    this.visibleUpdateForm = 1;
  }

  ajouterAgenceImmobiliere(): void {

    this.agenceImmobiliereData.append('logoAgence', this.logoAgence);
    this.agenceImmobiliereData.append('agenceImmobiliereJson', JSON.stringify(this.agenceImmobiliere));

    this.agenceImmobiliereService.addAgenceImmobiliere(this.agenceImmobiliereData).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Votre agence immobilière a été ajouté avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Ajout réussi', detail: this.messageSuccess })
        }
        else {
          this.erreur = true;
          this.messageErreur = "Erreur lors de l'ajout de votre agence immobilière !"
          this.afficherFormulaireAjouter();
          this.agenceImmobiliere.nomAgence = response.nomAgence;
          this.agenceImmobiliere.adresse = response.adresse;
          this.agenceImmobiliere.telephone = response.telephone;
          this.agenceImmobiliere.adresseEmail = response.adresseEmail;
          this.agenceImmobiliere.heureOuverture = response.heureOuverture;
          this.agenceImmobiliere.heureFermeture = response.heureFermeture;
          this.messageService.add({ severity: 'error', summary: "Erreur d'ajout", detail: this.messageErreur });
        }
    },
    (error) => {
      console.log(error)
      if(error.status === 409) {
        this.erreur = true;
        this.messageErreur = "Une agence immobilière avec ce nom existe déjà !";
        this.messageService.add({ severity: 'warn', summary: "Erreur d'ajout", detail: this.messageErreur });
      }
    })
  }

  modifierAgenceImmobiliere(id: number): void {

    this.agenceImmobiliereData.append('logoAgence', this.logoAgence);
    this.agenceImmobiliereData.append('agenceImmobiliereJson', JSON.stringify(this.agenceImmobiliere));

    this.agenceImmobiliereService.updateAgenceImmobiliere(id, this.agenceImmobiliereData).subscribe(
      (response) => {
        if(response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Votre agence immobilière a été modifié avec succès.";
          this.messageService.add({ severity: 'success', summary: 'Modification réussie', detail: this.messageSuccess })
        }
        else {
          this.erreur = true;
          this.messageErreur = "Erreur lors de la modification de votre agence immobilière !";
          this.messageService.add({ severity: 'error', summary: 'Erreur modification', detail: this.messageErreur });
          this.afficherFormulaireModifier(id);
        }
    },
    (error) => {
      console.log(error)
      if(error.status === 409){
        this.erreur = true;
        this.messageErreur = "Une agence immobilière avec ce nom existe déjà !";
        this.messageService.add({ severity: 'warn', summary: 'Modification non réussie', detail: this.messageErreur });
        this.afficherFormulaireModifier(id);
      }
    })
  }

  activerAgence(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette agence immobilière ?',
      header: "Activation d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agenceImmobiliereService.activerAgence(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été activé avec succès !";
          this.messageService.add({ severity: 'success', summary: "Activation de l'agence immobilière confirmée", detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: "Activation de l'agence immobilière rejetée", detail: "Vous avez rejeté l'activation de cette agence immobilière !" });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: "Activation de l'agence immobilière annulée", detail: "Vous avez annulé l'activation de cette agence immobilière !" });
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
        this.agenceImmobiliereService.desactiverAgence(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été désactivé avec succès.";
          this.messageService.add({ severity: 'success', summary: "Désactivaction de l'agence immobilière confirmée", detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: "Désactivation de l'agence immobilière rejetée", detail: 'Vous avez rejeté la désactivation de cette agence immobilière !' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: "Désactivation de l'agence immobilière annulée", detail: 'Vous avez annulé la désactivation de cette agence immobilière !' });
            break;
        }
      }
    });
  }
}
