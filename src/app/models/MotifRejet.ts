import { EntiteDeBase } from "./EntiteDeBase";

export class MotifRejet extends EntiteDeBase {

  id: number;
  code!: string;
  libelle!: string;
  motif!: string;

  constructor() {
    super();
    this.id = 0;
  }
}
