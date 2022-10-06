import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() navBarToggleFlag = new EventEmitter<{ flag: boolean }>();
  constructor() {}

  ngOnInit(): void {}

  toggleNavBar(): void {
    this.navBarToggleFlag.emit({ flag: true });
  }
}
