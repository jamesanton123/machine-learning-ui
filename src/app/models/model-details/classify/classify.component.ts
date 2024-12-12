import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelsService } from '../../model.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classify',
  imports: [FormsModule, CommonModule],
  template: `
  <form (ngSubmit)="submit()">
    <div *ngFor="let field of fields">
      <label>{{ field.providerName }}</label>
      <input
        *ngIf="field.type === 'numeric'"
        type="text"
        [(ngModel)]="formData[field.providerId]"
        name="{{ field.providerId }}"
        placeholder="Enter value"
        pattern="^\d+(\.\d+)?$"
        required
      />
    </div>

    <button type="submit">Classify</button>
  </form>
  <br/>
  <p>{{ result }}</p>
  `,
  styles: ``
})
export class ClassifyComponent {
  result: string = "";
  modelId: string | null = null;
  fields: any[] = [];
  formData: { [key: number]: any } = {};
  
  constructor(private route: ActivatedRoute, private modelsService: ModelsService, private fb: FormBuilder){
    
  }

  ngOnInit(): void {
    // Retrieve the 'id' parameter from the route
    this.modelId = this.route.snapshot.paramMap.get('id');
    this.loadParams(this.modelId!!);
  }

  loadParams(modelId: string): void {
    this.modelsService.getClassificationParams(modelId).subscribe({
      next: (data) => {
        this.fields = data;
        console.log("classification fields response: " + data);
      },
      error: (err) => {
        // this.errorMessage = 'Failed to load classification params.';
        console.error(err);
      },
    });
  }

  submit() {
    this.result = "";
    const payload = this.fields.map(field => ({
      providerId: field.providerId,
      value: this.formData[field.providerId] || null,
    }));
    this.modelsService.classify(this.modelId!!, payload).subscribe({
      next: (data) => {
        this.result = data.result;
        console.log("classification response: " + data);
      },
      error: (err) => {
        console.error(err);
      },
    });
    console.log('Submitted:', payload);
  }

}
