import { Demande } from "./Demande";

export class DemandeLocation extends Demande {

  prixDeLocation!: number;
  avance!: number;
  caution!: number;

  constructor() {
    super();
  }
}
