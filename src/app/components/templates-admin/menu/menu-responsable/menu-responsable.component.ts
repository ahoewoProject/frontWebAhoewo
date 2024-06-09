import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-responsable',
  templateUrl: './menu-responsable.component.html',
  styleUrls: ['./menu-responsable.component.css']
})
export class MenuResponsableComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  isActive(routes: string[]): boolean {
    const currentRoute = this.router.url.split('?')[0];
    return routes.some(route => {
      const routeRegex = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$');
      return routeRegex.test(currentRoute);
    });
  }
}
