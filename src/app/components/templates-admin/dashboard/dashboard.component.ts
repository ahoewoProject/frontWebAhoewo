import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  user: any;

  constructor(private personneService: PersonneService,
    private cookieService: CookieService) {
    const userCookie = this.cookieService.get('user');
    this.user = JSON.parse(userCookie);
  }

  ngOnInit(): void {
    this.detailUser();
  }

  detailUser(): void {
    console.log(this.user.id)
    this.personneService.findById(this.user.id)
    .subscribe(response=>{
      this.user = response;
      console.log(response);
    })
  }
}
