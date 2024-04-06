import { EntiteDeBase } from "../EntiteDeBase";
import { AgenceImmobiliere } from "../gestionDesAgencesImmobilieres/AgenceImmobiliere";
import { BienImmobilier } from "../gestionDesBiensImmobiliers/BienImmobilier";
import { Client } from "../gestionDesComptes/Client";
import { Demarcheur } from "../gestionDesComptes/Demarcheur";
import { Gerant } from "../gestionDesComptes/Gerant";
import { Proprietaire } from "../gestionDesComptes/Proprietaire";

export class Contrat extends EntiteDeBase {

    id: number;
    codeContrat!: string;
    client!: Client;
    proprietaire!: Proprietaire;
    demarcheur!: Demarcheur;
    gerant!: Gerant;
    agenceImmobiliere!: AgenceImmobiliere;
    bienImmobilier!: BienImmobilier;
    commission!: number;
    fraisDeVisite!: number;
    dateSignature!: Date;
    etatContrat!: string;

    constructor() {
      super();
      this.id = 0;
    }
}
