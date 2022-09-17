import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authent.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html', 
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  user: User | null = null;

  constructor(private auth: AuthenticationService, private api: ApiService, private notif: NotificationService) {
    auth.events().subscribe(user => this.user = user);
  }

  public logout(): void {
    this.auth.logout();
  }

  public init(): void {
    this.api.post("init").subscribe(success => this.notif.show("Initialisation de la base de données terminée"));
  }
}