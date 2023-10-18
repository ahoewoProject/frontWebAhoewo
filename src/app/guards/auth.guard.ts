import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonneService } from '../services/gestionDesComptes/personne.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private personneService: PersonneService
  ){}

  canActivate(): boolean {

    if(this.personneService.estConnecte()){
      return true
    }else {
      this.router.navigate(['/connexion']);
      return false
    }
  }

}
