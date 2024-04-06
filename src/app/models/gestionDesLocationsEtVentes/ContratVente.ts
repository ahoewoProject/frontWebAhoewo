import { Contrat } from "./Contrat";
import { DemandeAchat } from "./DemandeAchat";

export class ContratVente extends Contrat {

  demandeAchat!: DemandeAchat;
  prixVente!: number;
  nombreDeTranche!: number;
  nomPrenomTemoin1Vendeur!: string;
  contactTemoin1Vendeur!: string;
  nomPrenomTemoin2Vendeur!: string;
  contactTemoin2Vendeur!: string;
  nomPrenomTemoin3Vendeur!: string;
  contactTemoin3Vendeur!: string;
  nomPrenomTemoin1Acheteur!: string;
  contactTemoin1Acheteur!: string;
  nomPrenomTemoin2Acheteur!: string;
  contactTemoin2Acheteur!: string;
  nomPrenomTemoin3Acheteur!: string;
  contactTemoin3Acheteur!: string;

  constructor() {
    super();
  }
}
