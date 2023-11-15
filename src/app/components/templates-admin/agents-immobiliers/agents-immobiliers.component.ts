import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-agents-immobiliers',
  templateUrl: './agents-immobiliers.component.html',
  styleUrls: ['./agents-immobiliers.component.css']
})
export class AgentsImmobiliersComponent implements OnInit{

  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  voirMotDePasse: boolean = false;


  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  agentImmobilier = new AgentImmobilier();
  agentImmobiliers : AgentImmobilier[] = [];
  messageErreur: string = "";
  messageSuccess: string | null = null;

  user: any;
  agentImmobilierForm: any;
  roleAgentImmobilier: Role = {
    id: 3,
    code: 'ROLE_AGENTIMMOBILIER',
    libelle: 'Agent immobilier',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(
    private agentImmobilierService: AgentImmobilierService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    if(this.user.role.code == 'ROLE_RESPONSABLE_AGENCEIMMOBILIERE' ) {
      this.listeAgentImmobiliersParResponsableAgenceImmobiliere();
      this.initAgentImmobilierForm();
    } else {
      this.listeAgentImmobiliers();
    }
  }

  listeAgentImmobiliersParResponsableAgenceImmobiliere(): void {
    this.agentImmobilierService.findAgentsImmobiliersByResponsable().subscribe(
      (response) => {
        this.agentImmobiliers = response;
      }
    );
  }

  listeAgentImmobiliers(): void {
    this.agentImmobilierService.getAll().subscribe(
      (response) => {
        this.agentImmobiliers = response;
      }
    );
  }

  initAgentImmobilierForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.agentImmobilierForm = new FormGroup({
      nom: new FormControl(this.agentImmobilier.nom, [Validators.required]),
      prenom: new FormControl(this.agentImmobilier.prenom, [Validators.required]),
      username: new FormControl(this.agentImmobilier.username, [Validators.required]),
      email: new FormControl(this.agentImmobilier.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      motDePasse: new FormControl(this.agentImmobilier.motDePasse, [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      telephone: new FormControl(this.agentImmobilier.telephone, [Validators.required]),
    })
  }

  // Récupération des agents immobiliers de la page courante
  get agentsImmobiliersParPage(): any[] {
    return this.agentImmobiliers.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    this.listeAgentImmobiliers()
  }

  voirListe(): void {
    this.listeAgentImmobiliers();
    this.agentImmobilierForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
  }

  detailAgentImmobilier(id: number): void {
    console.log(id)
    this.agentImmobilierService.findById(id).subscribe(
      (response) => {
        this.agentImmobilier = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailAgentImmobilier(id);
    this.affichage = 2;
  }

  afficherFormulaireAjouter(): void {
    this.visibleAddForm = 1;
    this.agentImmobilier = new AgentImmobilier();
  }

  get nom() {
    return this.agentImmobilierForm.get('nom');
  }

  get prenom() {
    return this.agentImmobilierForm.get('prenom');
  }

  get username() {
    return this.agentImmobilierForm.get('username');
  }

  get email() {
    return this.agentImmobilierForm.get('email');
  }

  get motDePasse() {
    return this.agentImmobilierForm.get('motDePasse');
  }

  get telephone() {
    return this.agentImmobilierForm.get('telephone');
  }

  ajouterAgentImmobilier(): void {
    this.agentImmobilier.role = this.roleAgentImmobilier;

    this.agentImmobilierService.addAgentImmobilier(this.agentImmobilier).subscribe(
      (response) => {
        console.log(response);
        if (response.id > 0) {
          this.agentImmobiliers.push({
            id: response.id,
            nom: response.nom,
            prenom: response.prenom,
            username: response.username,
            email: response.email,
            motDePasse: response.motDePasse,
            telephone: response.telephone,
            etatCompte: response.etatCompte,
            role: response.role,
            creerLe: response.creerLe,
            creerPar: response.creerPar,
            modifierLe: response.modifierLe,
            modifierPar: response.modifierPar,
            statut: response.statut,
            estCertifie: false,
            resetToken: ''
          });
          this.voirListe();
          this.messageSuccess = "L'agent immobilier a été ajouté avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Ajout réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de l'agent immobilier !"
          this.afficherFormulaireAjouter();
          this.agentImmobilier.nom = response.nom;
          this.agentImmobilier.prenom = response.prenom;
          this.agentImmobilier.username = response.username;
          this.agentImmobilier.email = response.email;
          this.agentImmobilier.telephone = response.telephone;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      console.log(error)
      if (error.error.status === 409) {
        this.messageErreur = "Un agent immobilier avec ce nom d'utilisateur existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  supprimerAgentImmobilier(id: number): void{
    this.agentImmobilierService.deleteById(id).subscribe(
      (response) => {
        console.log(response);
        this.voirListe();
        this.messageSuccess = "L'agent immobilier a été supprimé avec succès.";
        this.messageService.add({
          severity: 'success',
          summary: 'Suppression réussie',
          detail: this.messageSuccess
        });
      }
    );
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de compte rejetée',
              detail: "Vous avez rejeté l'activation de ce compte !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de compte annulée',
              detail: "Vous avez annulé l'activation de ce compte !"
            });
            break;
        }
      }
    });
  }

  desactiverCompte(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
          console.log(response);
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de compte rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
            });
            break;
        }
      }
    });
  }
}
