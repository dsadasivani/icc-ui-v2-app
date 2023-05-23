import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @HostListener('document:keydown.control.f', ['$event'])
  onSearchShortcut(event: KeyboardEvent) {
    if (!this.isSearchDialogOpen) {
      event.preventDefault();
      this.openSearchDialog();
    }
  }

  menuIconName = 'menu';
  innerWidth: any;
  mobileHeader: boolean = false;
  isSearchDialogOpen: boolean = false;
  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
          this.mobileHeader = true;
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
          this.mobileHeader = false;
        }
      });
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
  openSearchDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { top: '0' };
    const dialogRef = this.dialog.open(SearchComponent, {
      panelClass: 'blur-background', // Apply the CSS class for the blurred background
      width: '600px', // Adjust the width of the dialog according to your needs
      position: { top: '100px' },
    });

    dialogRef.afterOpened().subscribe(() => {
      this.isSearchDialogOpen = true; // Set the property to true when the dialog is opened
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isSearchDialogOpen = false; // Set the property to false when the dialog is closed
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  toggleFlag(eventData: { flag: boolean }): void {
    if (this.innerWidth < 800) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }
  }
}
