import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DemandeCertification } from 'src/app/models/gestionDesComptes/DemandeCertification';
import { DemandeCertificationService } from 'src/app/services/gestionDesComptes/demande-certification.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  nbreDemandeCertification: number = 0;

  demandeCertifications : DemandeCertification[] = [];
  user: any;
  connexionReussie: any;

  constructor(private personneService: PersonneService,
    private demandeCertificationService: DemandeCertificationService,
    private activatedRoute: ActivatedRoute, private messageService: MessageService,
  )
  {
    this.demandeCertificationService.findByUser().subscribe(
      (response) => {
        this.demandeCertifications = response;
      }
    )
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.connexionReussie = this.activatedRoute.snapshot.queryParamMap.get('connexionReussie') || '';
    this.detailUser();
  }

  nombreDemandeCertification(): void {
    this.demandeCertificationService.countDemandeCertifications().subscribe(
      (response) => {
        this.nbreDemandeCertification = response;
      }
    );
  }

  detailUser(): void {
    this.personneService.findById(this.user.id).subscribe(
      (response) => {
        this.user = response;
        this.messageService.add({ severity: 'success', summary: 'Authentification réussie', detail: 'Vous êtes bel et bien connecté(e).' });
      }
    );
  }

  ngOnDestroy(): void {

  }
}

