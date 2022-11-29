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
import { OrdersService } from 'src/app/services/orders.service';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUtilsService } from 'src/app/services/file-utils.service';
import { FileSaverService } from 'ngx-filesaver';

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
    'editOrder',
    'downloadOrder',
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
  public fileName: string | undefined;

  constructor(
    private orderService: OrdersService,
    private fileService: FileUtilsService,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private _FileSaverService: FileSaverService
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

  createFileURL(result: Blob, type: string): Blob {
    var newBlob = new Blob([result], { type: type });
    return newBlob;
  }

  downloadInvoice(orderId: number) {
    const fileName = `Invoice_${orderId}.pdf`;
    const fileType = this._FileSaverService.genType(fileName);
    this.fileService.getFileContent(orderId).subscribe((result) => {
      this._FileSaverService.save(
        this.createFileURL(result, fileType),
        fileName
      );
    });
  }
}
