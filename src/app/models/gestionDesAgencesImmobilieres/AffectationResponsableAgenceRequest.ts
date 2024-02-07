import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ResponsableAgenceImmobiliere } from '../gestionDesComptes/ResponsableAgenceImmobiliere';

export class AffectationResponsableAgenceRequest {

  id: number;
  matricule!: string;
  agenceImmobiliere!: AgenceImmobiliere;
  responsable!: ResponsableAgenceImmobiliere;

  constructor(){
    this.id = 0;
  }
}
