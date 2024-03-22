import { Demande } from "./Demande";

export class DemandeAchat extends Demande {

  prixAchat!: number;
  nombreDeTranche!: number;

  constructor() {
    super();
  }
}
