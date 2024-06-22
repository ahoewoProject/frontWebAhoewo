import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BienImmAssocieService } from 'src/app/services/gestionDesBiensImmobiliers/bien-imm-associe.service';
import { BienImmobilierService } from 'src/app/services/gestionDesBiensImmobiliers/bien-immobilier.service';
import { DelegationGestionService } from 'src/app/services/gestionDesBiensImmobiliers/delegation-gestion.service';
import { TypeDeBienService } from 'src/app/services/gestionDesBiensImmobiliers/type-de-bien.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-gestion-des-biens-immobiliers',
  templateUrl: './gestion-des-biens-immobiliers.component.html',
  styleUrls: ['./gestion-des-biens-immobiliers.component.css']
})
export class GestionDesBiensImmobiliersComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  nbreTypeDeBien: number = 0;
  nbreTypeDeBienActif: number = 0;
  nbreTypeDeBienInactif: number = 0;
  nbreBiensSupports: number = 0;
  nbreBiensAssocies: number = 0;
  nbreBiensDelegues: number = 0;
  nbreDelegationsAttentes: number = 0;
  nbreDelegationsAcceptees: number = 0;
  nbreDelegationsRefusees: number = 0;
  nbreDelegationsActives: number = 0;
  nbreDelegationsDesactives: number = 0;
  user: any;
  dataBien: any;
  optionsBien: any;
  dataDelegation: any;
  optionsDelegation: any;
  nbreBiensDisponibles: number = 0;
  nbreBiensLoues: number = 0;
  nbreBiensVendus: number = 0;

  constructor(private typeDeBienService: TypeDeBienService, private personneService: PersonneService,
    private bienImmobilierService: BienImmobilierService, private bienImmAssocieService: BienImmAssocieService,
    private delegationGestionService: DelegationGestionService, private pageVisibilityService: PageVisibilityService,
    private userInactivityService: UserInactivityService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.loadData();
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.nombreTypeDeBiens();
    this.nombreTypeDeBiensActifs();
    this.nombreTypeDeBiensInactifs();

    this.nombreBiensSupports();
    this.nombreBiensAssocies();

    this.nombreDelegationsGestions();

    this.nombreBiensImmobiliers();

    this.initChartBienJs();

    this.initChartDelegationJs();
  }

  nombreTypeDeBiens(): void {
    this.typeDeBienService.getAll().subscribe(
      (data) => {
        this.nbreTypeDeBien = data.length;
      }
    )
  }

  nombreTypeDeBiensActifs(): void {
    this.typeDeBienService.getAll().subscribe(
      (data) => {
        this.nbreTypeDeBienActif = data.filter(t => t.etat === true).length;
      }
    )
  }

  nombreTypeDeBiensInactifs(): void {
    this.typeDeBienService.getAll().subscribe(
      (data) => {
        this.nbreTypeDeBienInactif = data.filter(t => t.etat === false).length;
      }
    )
  }

  nombreBiensSupports(): void {
    this.bienImmobilierService.getBiensSupports().subscribe(
      (data) => {
        this.nbreBiensSupports = data.length;
      }
    )
  }

  nombreBiensAssocies(): void {
    this.bienImmAssocieService.getBiensAssocies().subscribe(
      (data) => {
        this.nbreBiensAssocies = data.length;
      }
    )
  }

  nombreBiensImmobiliers(): void {
    this.bienImmobilierService.getBiensImmobiliers().subscribe(
      (data) => {
        this.nbreBiensDisponibles = data.filter(b =>  b.statutBien === 'Disponible').length;
        this.nbreBiensVendus = data.filter(b =>  b.statutBien === 'Vendu').length;
        this.nbreBiensLoues = data.filter(b =>  b.statutBien === 'Loué').length;

        this.initChartBienJs();
      }
    )
  }

  nombreDelegationsGestions(): void {
    this.delegationGestionService.getDelegationsGestionsList().subscribe(
      (data) => {
        this.nbreBiensDelegues =  data.length;
        this.nbreDelegationsActives = data.filter(d => d.etatDelegation === true).length;
        this.nbreDelegationsDesactives = data.filter(d => d.etatDelegation === false).length;

        this.nbreDelegationsAttentes = data.filter(d => d.statutDelegation === 0).length;
        this.nbreDelegationsAcceptees = data.filter(d => d.statutDelegation === 1).length;
        this.nbreDelegationsRefusees = data.filter(d => d.statutDelegation === 2).length;

        if (this.personneService.estAgentImmobilier(this.user.role.code) || this.personneService.estResponsable(this.user.role.code) ||
            this.personneService.estDemarcheur(this.user.role.code)) {
              this.nbreBiensDisponibles = (this.nbreBiensDisponibles || 0) + data.filter(d => d.bienImmobilier.statutBien === 'Disponible').length;
              this.nbreBiensLoues = (this.nbreBiensLoues || 0) + data.filter(d => d.bienImmobilier.statutBien === 'Loué').length;
              this.nbreBiensVendus = (this.nbreBiensVendus || 0) + data.filter(d => d.bienImmobilier.statutBien === 'Vendu').length;
            } else if (this.personneService.estGerant(this.user.role.code)) {
              this.nbreBiensDisponibles = data.filter(d => d.bienImmobilier.statutBien === 'Disponible').length;
              this.nbreBiensLoues = data.filter(d => d.bienImmobilier.statutBien === 'Loué').length;
              this.nbreBiensVendus = data.filter(d => d.bienImmobilier.statutBien === 'Vendu').length;
            }


        this.initChartDelegationJs();
        this.initChartBienJs();
      }
    )
  }

  initChartBienJs(): void {
    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.dataBien = {
            labels: ['Biens disponibles', 'Biens vendus', 'Biens loués'],
            datasets: [
                {
                    data: [this.nbreBiensDisponibles, this.nbreBiensVendus, this.nbreBiensLoues],
                    backgroundColor: [documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-400')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-400')]
                }
            ]
        };


        this.optionsBien = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
  }

  initChartDelegationJs(): void {
    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.dataDelegation = {
            labels: ['Délégations activées', 'Délégations désactivées'],
            datasets: [
                {
                    data: [this.nbreDelegationsActives, this.nbreDelegationsDesactives],
                    backgroundColor: [documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--red-600')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--red-600')]
                }
            ]
        };


        this.optionsDelegation = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
  }

  ngOnDestroy(): void {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }

  }
}
