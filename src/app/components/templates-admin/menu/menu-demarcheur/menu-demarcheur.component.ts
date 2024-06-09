import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-demarcheur',
  templateUrl: './menu-demarcheur.component.html',
  styleUrls: ['./menu-demarcheur.component.css']
})
export class MenuDemarcheurComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(route: string[]): boolean {
    return route.some(r => this.router.url.includes(r));
  }
}
