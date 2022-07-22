import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  menuIconName = 'menu_open';
  constructor() {}
  flipMenuIcon(): void {
    this.menuIconName === 'menu'
      ? (this.menuIconName = 'menu_open')
      : (this.menuIconName = 'menu');
  }

  ngOnInit(): void {}
}
