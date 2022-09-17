import { Component } from '@angular/core';
import { AuthenticationService } from './core/services/authent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authentService: AuthenticationService) {
    authentService.refreshAuthStatus(true);
  }
}