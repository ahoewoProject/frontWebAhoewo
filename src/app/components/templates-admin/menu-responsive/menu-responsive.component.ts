import { Component, OnInit } from '@angular/core';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-menu-responsive',
  templateUrl: './menu-responsive.component.html',
  styleUrls: ['./menu-responsive.component.css']
})
export class MenuResponsiveComponent implements OnInit{

  constructor(private personneService: PersonneService)
  {

  }

  ngOnInit(): void {

  }

  seDeconnecter(): void{
    this.personneService.logout();
  }
}
