import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, startWith, map } from 'rxjs';

interface Order {
  salesPerson: string;
  companyName: string;
  address: string;
  gstin: string;
  phoneNumber: number;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  ngOnInit(): void {
    this.filteredOptions.subscribe((options) => {
      this.hasResults = options.length > 0;
    });
  }
  filters: any[] = [
    { label: 'All', value: 'all' },
    { label: 'Agent', value: 'salesPersonSearch' },
    { label: 'Company', value: 'companyNameSearch' },
    { label: 'Address', value: 'addressSearch' },
    { label: 'GST No.', value: 'gstinSearch' },
    { label: 'Phone No.', value: 'phoneNumberSearch' },
  ];
  selectedFilter: string = 'all';
  searchControl = new FormControl();
  options: Order[] = [
    {
      salesPerson: 'Dilip',
      companyName: 'Google',
      address: 'California, USA',
      gstin: 'ASSDSD3432D',
      phoneNumber: 9160690173,
    },
    {
      salesPerson: 'Swathi',
      companyName: 'IBM',
      address: 'Ohio, USA',
      gstin: 'AS78YD3432D',
      phoneNumber: 9703874786,
    },
  ];
  isLoadingResults: boolean = false;
  filteredOptions: Observable<Order[]>;
  hasResults: boolean = true;

  constructor() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
  }

  filterOptions(value: string): Order[] {
    const filterValue = value.toLowerCase();
    const selectedFilter = this.selectedFilter;

    return this.options.filter((option) => {
      if (selectedFilter === 'all') {
        return (
          option.salesPerson.toLowerCase().includes(filterValue) ||
          option.companyName.toLowerCase().includes(filterValue) ||
          option.address.toString().includes(filterValue) ||
          option.gstin.toString().includes(filterValue) ||
          option.phoneNumber.toString().includes(filterValue)
        );
      } else if (selectedFilter === 'salesPersonSearch') {
        return option.salesPerson.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'companyNameSearch') {
        return option.companyName.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'addressSearch') {
        return option.address.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'gstinSearch') {
        return option.gstin.toLowerCase().includes(filterValue);
      } else if (selectedFilter === 'phoneNumberSearch') {
        return option.phoneNumber.toString().includes(filterValue);
      }
      return false;
    });
  }

  selectFilter(filterValue: string): void {
    this.selectedFilter = filterValue;
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
  }
  highlightMatch(order: Order): string {
    const value = `${order.salesPerson} | ${order.companyName} | ${order.phoneNumber} | ${order.gstin} | ${order.address} `;
    const filterValue = this.searchControl.value
      ? this.searchControl.value.toLowerCase()
      : '';
    const regex = new RegExp(filterValue, 'gi');

    if (this.selectedFilter === 'all') {
      return value.replace(regex, (match) => `<mark>${match}</mark>`);
    } else if (this.selectedFilter === 'salesPersonSearch') {
      const nameRegex = new RegExp(filterValue, 'gi');
      const highlightedAgent = order.salesPerson.replace(
        nameRegex,
        (match) => `<mark>${match}</mark>`
      );
      return `${highlightedAgent} | ${order.companyName} | ${order.phoneNumber} | ${order.gstin} | ${order.address}`;
    } else if (this.selectedFilter === 'companyNameSearch') {
      const deptRegex = new RegExp(filterValue, 'gi');
      const highlightedCompanyName = order.companyName.replace(
        deptRegex,
        (match) => `<mark>${match}</mark>`
      );
      return `${order.salesPerson} | ${highlightedCompanyName} | ${order.phoneNumber} | ${order.gstin} | ${order.address}`;
    } else if (this.selectedFilter === 'addressSearch') {
      const salaryRegex = new RegExp(filterValue, 'gi');
      const highlightedAddress = order.address.replace(
        salaryRegex,
        (match) => `<mark>${match}</mark>`
      );
      return `${order.salesPerson} | ${order.companyName} | ${order.phoneNumber} | ${order.gstin} | ${highlightedAddress}`;
    } else if (this.selectedFilter === 'gstinSearch') {
      const salaryRegex = new RegExp(filterValue, 'gi');
      const highlightedGstin = order.gstin.replace(
        salaryRegex,
        (match) => `<mark>${match}</mark>`
      );
      return `${order.salesPerson} | ${order.companyName} | ${order.phoneNumber} | ${highlightedGstin} | ${order.address}`;
    } else if (this.selectedFilter === 'phoneNumberSearch') {
      const salaryRegex = new RegExp(filterValue, 'gi');
      const highlightedPhoneNumber = order.phoneNumber
        .toString()
        .replace(salaryRegex, (match) => `<mark>${match}</mark>`);
      return `${order.salesPerson} | ${order.companyName} | ${highlightedPhoneNumber} | ${order.gstin} | ${order.address}`;
    }

    return value;
  }
}