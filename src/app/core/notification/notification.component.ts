import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.css'],
})
export class NotificationComponent {

  constructor(private snackBar: MatSnackBar, private notificationService: NotificationService) {
    this.notificationService.events().subscribe(message => this.showMessage(message));
  }

  private showMessage(message: string): void {
    if(!message) {
      return;
    }
    this.snackBar.open(message, 'Fermer', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000
    });
  }
}