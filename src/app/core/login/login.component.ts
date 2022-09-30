import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authent.service';

@Component({
  selector: 'my-login-form',
  templateUrl: 'login.component.html', 
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  error: string | null = null;

  agreed: boolean = true;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private api: ApiService, private authentService: AuthenticationService) { }

  ngOnInit(): void {
    if(history.state.logout) {
      this.authentService.logout();
    }
  }

  public submitLoginForm() {
    this.error = null;
    if (this.form.valid) {
      var formData: FormData = new FormData();
      formData.append('username', this.form.get('username')?.value);
      formData.append('password', this.form.get('password')?.value);
      this.api.post<User>("login", formData, { disableErrorHandler: true }).subscribe({
        next: (user) => this.authentService.setAuthentication(user),
        error: (error) => this.error = (error.status == 0) ? 'Le serveur d\'authentification est hors ligne' : error.error
      });
    }
  }
}
