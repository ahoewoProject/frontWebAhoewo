import { EntiteDeBase } from "../EntiteDeBase";
import { Client } from "../gestionDesComptes/Client";
import { Publication } from "../gestionDesPublications/Publication";

export class Demande extends EntiteDeBase {

  id: number;
  codeDemande!: string;
  client!: Client;
  publication!: Publication;
  dateDemande!: Date;
  etatDemande!: number;

  constructor() {
    super();
    this.id = 0;
  }
}
