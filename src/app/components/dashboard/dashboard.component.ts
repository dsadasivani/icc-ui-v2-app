import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Orders } from 'src/app/model/orders';
import { OrdersService } from 'src/services/orders.service';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'orderId',
    'salesPersonName',
    'invoiceDate',
    'companyName',
  ];
  loadingMessage: string = '';
  isLoading: boolean = true;
  loadMore: boolean = false;
  public orderList = new Array<Orders>();
  dataSource = new MatTableDataSource<Orders>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild('scroller')
  scroller!: CdkVirtualScrollViewport;

  noOfRecords: number = 50;
  offset: number = 0;
  fullDataLoaded: boolean = false;

  constructor(
    private orderService: OrdersService,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }
  ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.loadMore = true;
          this.offset++;
          this.fetchOrders();
        });
      });
  }
  private fetchOrders() {
    if (!this.fullDataLoaded) {
      this.orderService.getOrders(this.offset, this.noOfRecords).subscribe({
        next: (result) => {
          this.orderList = result.map((orders: Orders) =>
            new Orders().deserialize(orders)
          );
          if (
            this.orderList.length == 0 ||
            this.orderList.length < this.noOfRecords
          ) {
            this.fullDataLoaded = true;
          }
          this.isLoading = false;
          this.loadMore = false;
          this.dataSource.data.push(...this.orderList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => {
          this.loadingMessage = '*Unable to get orders....';
          this.isLoading = false;
          this.loadMore = false;
          let snackBarRef = this._snackBar.open(
            'Unable to get Orders !!',
            'Try again',
            {
              panelClass: 'error-snackbar',
            }
          );
          snackBarRef.onAction().subscribe(() => {
            window.location.reload();
          });
          console.log('Error occurred:::', error);
        },
      });
    } else {
      this.loadMore = false;
      this._snackBar.open('All orders fetched...!!', 'Dismiss', {
        duration: 3000,
        panelClass: 'good-snackbar',
      });
    }
  }
}
