import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  menuIconName = 'menu';
  innerWidth: any;
  mobileHeader: boolean = false;
  constructor(private observer: BreakpointObserver, private router: Router) {}

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
