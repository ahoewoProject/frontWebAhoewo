import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  erreur: boolean = false;
  message: string = '';
  recupererMotDePasseForm: any;

  constructor(
    private personneService: PersonneService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
    localStorage.setItem('token', token);
    this.initRecupererMotDePasseForm();
  }


  initRecupererMotDePasseForm(): void{
    this.recupererMotDePasseForm = new FormGroup({
      motDePasse: new FormControl('', [Validators.required]),
      motDePasseConfirmer: new FormControl('', [Validators.required])
    })
  }

  get motDePasse(){
    return this.recupererMotDePasseForm.get('motDePasse')
  }

  get motDePasseConfirmer(){
    return this.recupererMotDePasseForm.get('motDePasseConfirmer')
  }

  reinitialiserMotDePasse(): void{
    const motDePasse = this.recupererMotDePasseForm.get('motDePasse')?.value;
    const motDePasseConfirmer = this.recupererMotDePasseForm.get('motDePasseConfirmer')?.value;

    if(motDePasse != motDePasseConfirmer){
        this.erreur = true;
        this.message = "Les mots de passes ne sont pas conformes!";
        setTimeout(() => {
          this.erreur = false;
          this.message = '';
        }, 3000);
    }

    const token = localStorage.getItem('token') || '';

    const resetPasswordData = new FormData();
    resetPasswordData.append('token', token)
    resetPasswordData.append('newPassword', motDePasse)
    this.personneService.resetPassword(resetPasswordData).subscribe(
      (response) => {
        console.log(response);
        localStorage.removeItem('token')
        this.router.navigate(['/login'], { queryParams: { passwordResetSuccess: true } });
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
