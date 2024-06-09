import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-demarcheur',
  templateUrl: './menu-demarcheur.component.html',
  styleUrls: ['./menu-demarcheur.component.css']
})
export class MenuDemarcheurComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(routes: string[]): boolean {
    const currentRoute = this.router.url.split('?')[0];
    return routes.some(route => {
      const routeRegex = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$');
      return routeRegex.test(currentRoute);
    });
  }
}
