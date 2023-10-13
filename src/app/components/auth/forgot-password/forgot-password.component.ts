import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  emailNonTrouve: boolean = false;
  loading: boolean = false;
  cacherFormulaire: boolean = false;
  message: string = '';
  rechercheCompteForm: any;
  messageLoading: string | null = null;

  constructor(
    private personneService: PersonneService
  ) {}

  ngOnInit(): void {
    this.initRechercheCompte()
  }

  initRechercheCompte(): void{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.rechercheCompteForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
    })
  }

  get email(){
    return this.rechercheCompteForm.get('email');
  }

  rechercherEmail(){
    const emailData = new FormData();
    emailData.append('email', this.rechercheCompteForm.get('email')?.value)

    this.loading = true;
    this.messageLoading = "Recherche de votre compte en cours..."

    this.personneService.requestResetPassword(emailData)
    .subscribe(
      (response) => {
        console.log(response);
        this.cacherFormulaire = true;

        this.loading = false;
        this.messageLoading = null;
      },
      (error) => {
        console.log(error)
        if(error.status === 400){
          this.loading = false;
          this.messageLoading = null;

          this.emailNonTrouve = true;
          this.message = "L'adresse e-mail saisie est introuvable! Veuillez entrer une adresse e-mail valide."
          setTimeout(() => {
            this.emailNonTrouve = false;
            this.message = '';
          }, 3000);
        }
      }
    );
  }

}
