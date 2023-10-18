import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    this.recupererMotDePasseForm = new FormGroup({
      motDePasse: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)]),
      motDePasseConfirmer: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(8), Validators.pattern(passwordRegex)])
    }, [ this.passwordMatch("motDePasse", "motDePasseConfirmer") ])
  }

  get motDePasse(){
    return this.recupererMotDePasseForm.get('motDePasse')
  }

  get motDePasseConfirmer(){
    return this.recupererMotDePasseForm.get('motDePasseConfirmer')
  }

  reinitialiserMotDePasse(): void{
    const motDePasse = this.recupererMotDePasseForm.get('motDePasse')?.value;
    // const motDePasseConfirmer = this.recupererMotDePasseForm.get('motDePasseConfirmer')?.value;

    // if(motDePasse != motDePasseConfirmer){
    //     this.erreur = true;
    //     this.message = "Les mots de passes ne sont pas conformes!";
    //     setTimeout(() => {
    //       this.erreur = false;
    //       this.message = '';
    //     }, 3000);
    // }

    const token = localStorage.getItem('token') || '';

    const resetPasswordData = new FormData();
    resetPasswordData.append('token', token)
    resetPasswordData.append('newPassword', motDePasse)
    this.personneService.reinitialiserMotDePasse(resetPasswordData).subscribe(
      (response) => {
        console.log(response);
        localStorage.removeItem('token')
        this.router.navigate(['/connexion'], { queryParams: { passwordResetSuccess: true } });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  passwordMatch(motDePasse: string, motDePasseConfirmer: string) {
    return function (form: AbstractControl) {
      const passwordValue = form.get(motDePasse)?.value;
      const confirmPasswordValue = form.get(motDePasseConfirmer)?.value;
      if (passwordValue === confirmPasswordValue) {
        return null;
      }
      return { passwordMismatchError: true };
    };
  }

  showPasswordErrors(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (
      (motDePasseErrors?.['minlength'] || motDePasseErrors?.['maxlength'] && motDePasseErrors?.['pattern'] && this.motDePasse?.touched) ||
      (motDePasseConfirmerErrors?.['minlength'] || motDePasseConfirmerErrors?.['maxlength'] && motDePasseConfirmerErrors?.['pattern'] && this.motDePasseConfirmer?.touched)
    );
  }

  showMinLengthError(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (
      (motDePasseErrors?.['minlength'] || motDePasseErrors?.['maxlength'] && this.motDePasse?.touched) ||
      (motDePasseConfirmerErrors?.['minlength'] || motDePasseConfirmerErrors?.['maxlength'] && this.motDePasseConfirmer?.touched)
    );
  }

  showPatternError(): boolean {
    const motDePasseErrors = this.motDePasse?.errors;
    const motDePasseConfirmerErrors = this.motDePasseConfirmer?.errors;
    return (motDePasseErrors?.['pattern'] || motDePasseConfirmerErrors?.['pattern']);
  }
  
}
