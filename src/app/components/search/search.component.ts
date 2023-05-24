import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  Observable,
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  delay,
} from 'rxjs';
import { Orders } from 'src/app/model/orders';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  filters: any[] = [
    { label: 'All', value: 'all', icon: 'apps' },
    { label: 'Agent', value: 'salesPersonSearch', icon: 'person' },
    { label: 'Company', value: 'companyNameSearch', icon: 'store' },
    { label: 'Address', value: 'addressSearch', icon: 'alternate_email' },
    { label: 'Phone No.', value: 'phoneNumberSearch', icon: 'phone' },
  ];
  selectedFilter: string = 'all';
  searchControl = new FormControl();
  options: any[] = [];
  isLoadingResults: boolean = false;
  filteredOptions: Observable<any[]>;
  hasResults: boolean = false;
  searchLabel: string = 'Search';

  constructor(
    private orderService: OrdersService,
    private router: Router,
    public dialogRef: MatDialogRef<SearchComponent>
  ) {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
  }
  ngOnInit(): void {
    this.filteredOptions.subscribe((options) => {
      this.hasResults = options.length > 0;
    });
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Delay between user input and API call
      distinctUntilChanged(), // Only trigger API call if the input has changed
      tap(() => {
        this.isLoadingResults = true;
      }),
      switchMap((value) => this.searchBackend(value).pipe(delay(1000))), // Invoke the backend service
      tap(() => {
        this.isLoadingResults = false;
      })
    );
  }
  searchBackend(value: string): Observable<Orders[]> {
    return this.orderService.filterOrders(
      value,
      this.selectedFilter === 'salesPersonSearch',
      this.selectedFilter === 'companyNameSearch',
      this.selectedFilter === 'addressSearch',
      this.selectedFilter === 'phoneNumberSearch'
    );
  }

  filterOptions(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selectedFilter = this.selectedFilter;

    return this.options.filter((option) => {
      if (selectedFilter === 'all') {
        return (
          option.salesPerson.toLowerCase().includes(filterValue) ||
          option.companyName.toLowerCase().includes(filterValue) ||
          option.address.toString().includes(filterValue) ||
          option.phoneNumber.toString().includes(filterValue)
        );
      } else if (selectedFilter === 'salesPersonSearch') {
        return option.salesPerson.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'companyNameSearch') {
        return option.companyName.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'addressSearch') {
        return option.address.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'phoneNumberSearch') {
        return option.phoneNumber.toString().includes(filterValue);
      }
      return false;
    });
  }

  selectFilter(filterValue: any): void {
    this.selectedFilter = filterValue.value;
    this.searchLabel = `Search ${filterValue.label}`;
  }
  highlightMatch(order: any): string {
    const value = `${order.salesPersonName} | ${order.companyName} | ${order.phoneNumber} | ${order.address}, ${order.address2} `;
    const filterValue = this.searchControl.value
      ? this.searchControl.value.toLowerCase()
      : '';
    const regex = new RegExp(filterValue, 'gi');

    if (this.selectedFilter === 'all') {
      return value.replace(regex, (match) => `<mark>${match}</mark>`);
    } else if (this.selectedFilter === 'salesPersonSearch') {
      const nameRegex = new RegExp(filterValue, 'gi');
      const highlightedAgent = order.salesPersonName.replace(
        nameRegex,
        (match: any) => `<mark>${match}</mark>`
      );
      return `${highlightedAgent} | ${order.companyName} | ${order.phoneNumber} | ${order.address}, ${order.address2} `;
    } else if (this.selectedFilter === 'companyNameSearch') {
      const deptRegex = new RegExp(filterValue, 'gi');
      const highlightedCompanyName = order.companyName.replace(
        deptRegex,
        (match: any) => `<mark>${match}</mark>`
      );
      return `${order.salesPersonName} | ${highlightedCompanyName} | ${order.phoneNumber} | ${order.address}, ${order.address2}`;
    } else if (this.selectedFilter === 'addressSearch') {
      const salaryRegex = new RegExp(filterValue, 'gi');
      let highlightedAddress = order.address.replace(
        salaryRegex,
        (match: any) => `<mark>${match}</mark>`
      );
      highlightedAddress +=
        order.address2 != null
          ? order.address2.replace(
              salaryRegex,
              (match: any) => `<mark>${match}</mark>`
            )
          : '';
      return `${order.salesPersonName} | ${order.companyName} | ${order.phoneNumber} | ${highlightedAddress}`;
    } else if (this.selectedFilter === 'phoneNumberSearch') {
      const salaryRegex = new RegExp(filterValue, 'gi');
      const highlightedPhoneNumber = order.phoneNumber
        .toString()
        .replace(salaryRegex, (match: any) => `<mark>${match}</mark>`);
      return `${order.salesPersonName} | ${order.companyName} | ${highlightedPhoneNumber} | ${order.address}, ${order.address2}`;
    }

    return value;
  }
  OptionSelected(value: any) {
    console.log(value);
    this.dialogRef.close();
    this.router.navigateByUrl('/update-order', { state: value });
  }
}
