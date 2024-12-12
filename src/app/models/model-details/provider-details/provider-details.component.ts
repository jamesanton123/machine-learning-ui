import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModelsService } from '../../model.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-provider-details',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="provider-details">
    <h2>Provider Details</h2>
    <div class="details-container">
      <p><strong>Name:</strong> {{ provider?.name }}</p>
      <p><strong>Description:</strong> {{ provider?.fullDescription }}</p>
    </div>
    <br/>
    <form #providerForm="ngForm" (ngSubmit)="onAddToModel()">
      <div *ngFor="let param of provider?.params" class="form-group">
        <ng-container *ngIf="param.paramType !== 'provided'">
          <label [for]="param.id">{{ param.paramName }}</label>
          
          <!-- String Input -->
          <input
            *ngIf="param.fullyQualifiedType === 'java.lang.String'"
            id="{{ param.id }}"
            name="{{ param.id }}"
            type="text"
            [(ngModel)]="formData[param.id]"
            required
          />

          <!-- Date Picker -->
          <input
            *ngIf="param.fullyQualifiedType === 'java.util.Date'"
            id="{{ param.id }}"
            name="{{ param.id }}"
            type="date"
            [(ngModel)]="formData[param.id]"
            required
          />

          <!-- Integer Input -->
          <input
            *ngIf="param.fullyQualifiedType === 'java.lang.Integer'"
            id="{{ param.id }}"
            name="{{ param.id }}"
            type="number"
            [(ngModel)]="formData[param.id]"
            required
          />

          <select
            *ngIf="param.paramType === 'enum'"
            id="{{ param.id }}"
            name="{{ param.id }}"
            [(ngModel)]="formData[param.id]"
            required
          >
            <option *ngFor="let value of resolveParamDropDownValues(param.fullyQualifiedType)" [value]="value">
              {{ value }}
            </option>
          </select>
        </ng-container>
      </div>

      <button type="submit">Add to Model</button>
    </form>



    <button (click)="onCancel()">Cancel</button>
  </div>
  `,
  styles: ``
})
export class ProviderDetailsComponent {
  modelId: string | null = null;
  providerId: string | null = null;
  formData: { [key: string]: any } = {};
  errorMessage: string = '';
  provider: { id: string; name: string; shortDescription: string; fullDescription: string; params: any[] } | null = null;
  paramEnums: any;

  constructor(
    private route: ActivatedRoute, 
    private modelsService: ModelsService, 
    private location: Location){}

  ngOnInit() {
    this.modelId = this.route.snapshot.paramMap.get('id');
    this.providerId = this.route.snapshot.paramMap.get('providerId');
    this.loadProviderDetails(this.providerId!!);
    // // Initialize formData with default values
    // this.provider.args.forEach((arg: any) => {
    //   this.formData[arg.name] = '';
    // });
  }

  loadProviderDetails(providerId: string): void {
    // TODO: Wait for param enum to complete before calling other endpoint
    this.modelsService.getParamEnums().subscribe({
      next: (data) => {
        this.paramEnums = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load provider details.';
        console.error(err);
      },
    });
    
    this.modelsService.getProviderDetails(providerId).subscribe({
      next: (data) => {
        this.provider = data;
        if(this.provider != null) {
          this.provider.params.forEach((param: any) => {
            if(param.paramType !== 'provided') {
              this.formData[param.id] = '';
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load provider details.';
        console.error(err);
      },
    });
  }

  resolveParamDropDownValues(fullyQualifiedType: string) {
    return this.paramEnums[fullyQualifiedType];
  }

  onAddToModel() {
    console.log(this.formData);
    var params: { dataProviderParamId: string; argValue: string }[] = [];;
    for (let key in this.formData) {
      if (this.formData.hasOwnProperty(key) && this.formData[key] !== '') {
          params.push({
              dataProviderParamId: key,
              argValue: this.formData[key].toString()
          });
      }
    }
    this.modelsService.addProviderToModel(this.modelId!!, this.providerId!!, params).subscribe({
      next: () => {
        this.goBack();
      },
      error: (err) => {
        this.errorMessage = 'Unable to add provider to model.';
        console.error(err);
      },
    });
  }

  goBack(): void {
      this.location.back();
  }

  onCancel() {
    this.goBack();
  }

  
}
