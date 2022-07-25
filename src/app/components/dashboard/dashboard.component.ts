import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Orders } from 'src/app/model/orders';
import { OrdersService } from 'src/services/orders.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'orderId',
    'salesPersonName',
    'invoiceDate',
    'companyName',
  ];
  public orderList = new Array<Orders>();
  dataSource = new MatTableDataSource<Orders>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.orderService.getOrders(0, 50).subscribe((result) => {
      this.orderList = result.map((orders: Orders) =>
        new Orders().deserialize(orders)
      );
      this.dataSource.data = this.orderList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
