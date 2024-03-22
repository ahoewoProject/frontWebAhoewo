import { Client } from "../gestionDesComptes/Client";
import { Publication } from "../gestionDesPublications/Publication";

export class DemandeRequest {

  typeDeDemande!: string;
  client!: Client;
  publication!: Publication;
  dateHeureVisite!: Date;
  prixDeLocation!: number;
  avance!: number;
  caution!: number;
  prixAchat!: number;
  nombreDeTranche!: number;

  constructor() {

  }
}
