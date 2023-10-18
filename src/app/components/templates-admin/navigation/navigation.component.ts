import { Component, OnInit } from '@angular/core';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

  user: any;
  demandeCertifications : DemandeCertification[] = [];

  constructor(
    private personneService: PersonneService,
    private demandeCertificationService: DemandeCertificationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte)
  }

  ngOnInit(): void {
    this.listeDemandeCertificationParUtilisateur();
  }

  listeDemandeCertificationParUtilisateur(){
    this.demandeCertificationService.getAll().subscribe(
      (response) => {
        this.demandeCertifications = response;
      }
    )
  }

  seDeconnecter(): void {
    this.personneService.deconnexion();
  }
}
