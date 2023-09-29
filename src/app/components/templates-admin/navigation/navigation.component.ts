import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
    private cookieService: CookieService,
    private demandeCertificationService: DemandeCertificationService
  ){
    const userCookie = this.cookieService.get('user');
    this.user = JSON.parse(userCookie)
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
    this.personneService.logout();
  }
}
