import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  showUploadIcon: boolean = false;
  @Output() navBarToggleFlag = new EventEmitter<{ flag: boolean }>();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  toggleNavBar(): void {
    this.navBarToggleFlag.emit({ flag: true });
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getName(): string {
    return this.authService.extractName();
  }
}
