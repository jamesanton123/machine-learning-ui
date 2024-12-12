import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelsService } from '../../model.service';
import { CommonModule } from '@angular/common';

interface TableRow {
  [key: string]: string;
}

@Component({
  selector: 'app-provider-data',
  imports: [CommonModule],
  template: `
    <p>
      provider data
    </p>
    <br/>
    <div>
      <table border="1">
        <thead>
          <tr>
            <th *ngFor="let columnName of payload!!.columnNames">{{ columnName }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of tableData" [ngClass]="{ 'highlight': hasEmptyField(row) }">
            <td *ngFor="let columnName of payload!!.columnNames">{{ row[columnName] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f4f4f4;
    }
    
    td {
      border: 1px solid #ddd;
    }

    .highlight {
      background-color: #ffcccc; /* Light red */
    }
  `
})
export class ProviderDataComponent {
  modelId: string | null = null;
  payload: {
    columnNames: string[];
    columnValues: string[][];
  } | null = null;
  
  columnNames: string[] = [];
  tableData: TableRow[] = [];

  constructor(private route: ActivatedRoute, private modelsService: ModelsService){
    
  }
  
  ngOnInit(): void {
    // Retrieve the 'id' parameter from the route
    this.modelId = this.route.snapshot.paramMap.get('id');
    this.loadProviderData(this.modelId!!);
  }

  loadProviderData(modelId: string) {
    console.log('loading provider data for model:' + modelId);
    this.modelsService.loadProviderData(modelId).subscribe({
      next: (data) => {
        console.log('provider data found: ' + data);
        this.payload = data;
        this.columnNames = this.payload!!.columnNames;
        this.tableData = this.payload!!.columnValues.map(values => {
          const row: any = {};
          this.columnNames.forEach((col, index) => {
            row[col] = values[index];
          });
          return row;
        });
        // var modelProviders: { dataProviderParamId: string; argValue: string; }[] = data;
        // console.log("model providers: " + modelProviders);
        // this.formattedModelProviders = this.getFormattedModelProviders(this.providers, modelProviders);
      },
      error: (err) => {
        // this.errorMessage = 'Failed to load the model\'s providers.';
        console.error(err);
      },
    })
  }

  hasEmptyField(row: TableRow): boolean {
    return this.columnNames.some(column => !row[column]);
  }
}
