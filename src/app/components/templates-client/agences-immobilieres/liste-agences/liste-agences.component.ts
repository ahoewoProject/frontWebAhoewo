import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { QuartierService } from 'src/app/services/gestionDesBiensImmobiliers/quartier.service';
import { RegionService } from 'src/app/services/gestionDesBiensImmobiliers/region.service';
import { VilleService } from 'src/app/services/gestionDesBiensImmobiliers/ville.service';
import { environment } from 'src/environments/environment';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-liste-agences',
  templateUrl: './liste-agences.component.html',
  styleUrls: ['./liste-agences.component.css']
})
export class ListeAgencesComponent implements OnInit {

  numeroDeLaPage = 0;
  elementsParPage = 6;
  regions: Region[] = [];
  villes: Ville[] = [];
  quartiers: Quartier[] = [];
  agencesImmobilieresFiltrees: any[] = [];
  agencesImmobilieres!: Page<AgenceImmobiliere>;
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();
  APIEndpoint: string;
  nomAgence: any;

  constructor(private regionService: RegionService, private villeService: VilleService,
    private quartierService: QuartierService, private agenceImmobilierService: AgenceImmobiliereService,
    private datePipe: DatePipe, private filterService: FilterService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.listeAgencesActives(this.numeroDeLaPage, this.elementsParPage);
  }

  filtreAgenceImmobiliere(event: AutoCompleteCompleteEvent) {
    let filtres: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.agencesImmobilieres.content as any[]).length; i++) {
        let agence = (this.agencesImmobilieres.content as any[])[i];
        if (agence.nomAgence.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtres.push(agence);
        }
    }
    this.agencesImmobilieresFiltrees = filtres;
  }

  //Fonction pour recupérer la liste des régions actives
  listeRegionsActives(): void {
    this.regionService.getRegionsActives().subscribe(
      (response) => {
        this.regions = response;
      }
    );
  }

  //Fonction pour recupérer la liste des villes actives
  listeVillesActives(): void {
    this.villeService.getVillesActives().subscribe(
      (response) => {
        this.villes = response;
      }
    );
  }

  //Fonction pour recupérer la liste des quartiers actifs
  listeQuartiersActifs(): void {
    this.quartierService.getQuartiersActifs().subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
  }

  //Fonction pour sélectionner une région
  regionChoisie(event: any) {
    this.regionSelectionnee = event.value;
    this.villeService.getVillesByRegionId(this.regionSelectionnee.id).subscribe(
      (response) => {
        this.villes = response;
      }
    );
    this.agenceImmobilierService.getAgencesActivesByRegionId(this.regionSelectionnee.id, this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Fonction pour sélectionner une ville
  villeChoisie(event: any) {
    this.villeSelectionnee = event.value;
    this.quartierService.getQuartiersByVilleId(this.villeSelectionnee.id).subscribe(
      (response) => {
        this.quartiers = response;
      }
    );
    this.agenceImmobilierService.getAgencesActivesByVilleId(this.villeSelectionnee.id, this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Fonction pour sélectionner un quartier
  quartierChoisi(event: any) {
    this.quartierSelectionne = event.value;
    this.agenceImmobilierService.getAgencesActivesByQuartierId(this.quartierSelectionne.id, this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  listeAgencesActives(numeroDeLaPage: number, elementsParPage: number): void {
    this.agenceImmobilierService.getAgencesActives(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    )
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeAgencesActives(this.numeroDeLaPage, this.elementsParPage);
  }

  public fermetureOrOuvertureAgence(heureOuverture: string, heureFermeture: string): boolean {
    const now: Date = new Date();
    const formattedHeureOuverture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureOuverture;
    const formattedHeureFermeture: string = this.datePipe.transform(now, 'yyyy-MM-dd') + ' ' + heureFermeture;

    const _heureOuverture: Date = new Date(formattedHeureOuverture);
    const _heureFermeture: Date = new Date(formattedHeureFermeture);

    if (now >= _heureOuverture && now <= _heureFermeture) {
      return true;
    } else {
      return false;
    }
  }

  rafraichir(): void {
    this.listeRegionsActives();
    this.listeVillesActives();
    this.listeQuartiersActifs();
    this.listeAgencesActives(this.numeroDeLaPage, this.elementsParPage);
    this.regionSelectionnee = new Region();
    this.villeSelectionnee = new Ville();
    this.quartierSelectionne = new Quartier();
  }

}
