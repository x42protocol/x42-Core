import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { WalletInfo } from '../../../../shared/models/wallet-info';

import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-generate-addresses',
  templateUrl: './generate-addresses.component.html',
  styleUrls: ['./generate-addresses.component.css']
})
export class GenerateAddressesComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private globalService: GlobalService,
    private fb: UntypedFormBuilder,
  ) {
    this.buildGenerateAddressesForm();
  }

  public generateAddressesForm: UntypedFormGroup;
  public addresses: string[];
  public pageNumber = 1;
  public copyType: SelectItem[];

  formErrors = {
    generateAddresses: ''
  };

  validationMessages = {
    generateAddresses: {
      required: 'Please enter an amount to generate.',
      pattern: 'Please enter a number between 1 and 10.',
      min: 'Please generate at least one address.',
      max: 'You can only generate 1000 addresses at once.'
    }
  };

  ngOnInit() {
    this.copyType = [
      { label: 'Copy', value: 'Copy', icon: 'pi pi-copy' }
    ];
  }

  private buildGenerateAddressesForm() {
    this.generateAddressesForm = this.fb.group({
      generateAddresses: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(1000)])]
    });

    this.generateAddressesForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.generateAddressesForm) { return; }
    const form = this.generateAddressesForm;

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];

        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  public onGenerateClicked() {
    const walletInfo = new WalletInfo(this.globalService.getWalletName());
    this.apiService.getUnusedReceiveAddresses(walletInfo, this.generateAddressesForm.get('generateAddresses').value)
      .subscribe(
        response => {
          this.addresses = response;
        }
      );
  }

  public saveToFile(){
    const textExport = document.createElement('a');
    textExport.href = 'data:attachment/text,' + encodeURI(this.addresses.join('\n'));
    textExport.target = '_blank';
    textExport.download = 'addresses.txt';
    textExport.click();
  }
  public onBackClicked() {
    this.addresses = [''];
  }
}
