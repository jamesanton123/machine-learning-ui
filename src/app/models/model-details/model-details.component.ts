import { Component } from '@angular/core';
import { ModelsService } from '../model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface DataItem {
  displayName: string;
  paramValues: { [key: string]: any };
}

@Component({
  selector: 'app-model-details',
  imports: [CommonModule],
  template: `
    <div class="details-container">
      <h1>Item Details</h1>
      <p><strong>Model ID:</strong> {{ modelId }}</p>
    </div>
    <div class="container">
      <div class="left-side">
        <h2>Data provider library</h2>
        <ul class="details-list">
          <li *ngFor="let provider of providers" class="details-item">
            <h4>{{ provider.name }}</h4>
            <p>{{ provider.shortDescription }}</p>
            <button class="hover-button" (click)="addItemToModel(provider.id)">Add to Model</button>
          </li>
        </ul>
      </div>

      <div class="right-side">
        <img src="assets/model.png" alt="Model Image" class="model-image" />
        <br/>
        <button (click)="retrieveDataForModel()">Retrieve data from providers</button>
        <br/>
        <button (click)="viewProviderData()">View provider data</button>
        <br/>
        <button (click)="testAndTrain()">TestAndTrain</button>
        <br/>
        <button (click)="classify()">Classify</button>
        <br/>
        <div *ngFor="let item of testTrainResult" style="text-align: left;">
          {{ item }}
        </div>
        <br/>


        <div *ngFor="let item of modelProviderMetadata" style="text-align: left;">
          <h3>{{ item.displayName }}</h3>
          <div *ngIf="item.paramValues">
            <ul>
              <li *ngFor="let key of objectKeys(item.paramValues)">
              {{ key }}: {{ item.paramValues[key] }}
              </li>
            </ul>
          </div>
          <!-- <div *ngIf="item.paramValues | json === '{}'">
            <em>No parameters available</em>
          </div>-->
        </div>


        <!--<div *ngFor="let providerKey of formattedModelProvidersKeys">
          <h3>{{ formattedModelProviders!!.get(providerKey)!!.providerName }}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th class="left-align">Param Name</th>
                <th class="left-align">Arg Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of formattedModelProviders.get(providerKey)!!.argData">
                <td class="left-align">{{ item.paramName }}</td>
                <td class="left-align">{{ item.argValue }}</td>
              </tr>
            </tbody>
          </table>
        </div>-->



      </div>
    </div>
  `,
  styles: `
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
  
    .left-side {
      border-right: none;
      padding-right: 0;
      margin-bottom: 20px;
    }
  }

  .container {
    display: flex;
    padding: 20px;
    gap: 20px;
  }
  
  /* Left side styles */
  .left-side {
    flex: 1;
    border-right: 1px solid #ccc;
    padding-right: 20px;
  }
  
  .details-list {
    list-style: none;
    padding: 0;
  }
  
  .details-item {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    position: relative; /* Ensure button is positioned inside this item */
  }
  
  .details-item h4 {
    margin: 0 0 5px;
    color: #333;
  }
  
  .details-item p {
    margin: 0;
    color: #666;
  }
  
  /* Right side styles */
  .right-side {
    flex: 0.8;
    text-align: center;
  }
  
  .model-image {
    width:200px;
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-top: 20px;
  }

  /* Hover button styling */
  .hover-button {
    display: none; /* Hidden by default */
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    padding: 5px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .hover-button:hover {
    background-color: #218838;
  }

  /* Show button on hover */
  .details-item:hover .hover-button {
    display: inline-block;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th, 
  .data-table td {
    padding: 8px 12px;
    text-align: left;
  }
  
  .data-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .data-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }


  `
})
export class ModelDetailsComponent {
  modelId: string | null = null;
  // All of the providers available
  providers: { id: string; name: string; shortDescription: string; longDescription: string; params: any[] }[] = [];
  
  modelProviderMetadata: DataItem[] = [];
  // providers that have been added to the model
  formattedModelProviders: Map<string, {providerName: string; argData: { paramName: string; dataProviderParamId: string; argValue: string; }[]}> = new Map();
  errorMessage: string = '';
  providerRetrievalCompleted: boolean = false;
  testTrainResult: string[] = [];

  constructor(private route: ActivatedRoute, private modelsService: ModelsService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the 'id' parameter from the route
    this.modelId = this.route.snapshot.paramMap.get('id');
    this.loadAllProviders();
  }

  loadAllProviders(): void {
    this.modelsService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;

        // TODO: refactor this to not use nested
        this.modelsService.getProvidersForModel(this.modelId!!).subscribe({
          next: (data) => {
            this.modelProviderMetadata = data;
            console.log(data);
          },
          error: (err) => {
            this.errorMessage = 'Failed to load the model\'s providers.';
            console.error(err);
          },
        })
      },
      error: (err) => {
        this.errorMessage = 'Failed to load providers.';
        console.error(err);
      },
    });
  }

  addItemToModel(id: string) {
    console.log("adding id: " + id);
    // this.rightItems = this.rightItems.filter((i) => i !== item);
    // this.leftItems.push(item);
    this.router.navigate(['/models/' + this.modelId + '/provider-details/' + id]);
  }

  get formattedModelProvidersKeys() {
    return Array.from(this.formattedModelProviders.keys());
  }

  retrieveDataForModel() {
    this.modelsService.initiateProviderRetrieval(this.modelId!!).subscribe({
      next: (data) => {
        console.log('done initiating provider retrieval for model');
        this.providerRetrievalCompleted = true;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load provider details.';
        console.error(err);
      },
    });
  }

  viewProviderData() {
    console.log('navigating to provider data');
    this.router.navigate(['/models/' + this.modelId + '/provider-data']);
  }

  testAndTrain() {
    this.testTrainResult = [];
    this.modelsService.testAndTrain(this.modelId!!).subscribe({
      next: (data) => {
        this.testTrainResult = data.result;
        console.log('done testing and training');
      },
      error: (err) => {
        this.errorMessage = 'Failed testing and training.';
        console.error(err);
      },
    });
  }
  
  classify() {
    this.router.navigate(['/models/' + this.modelId + '/classify']);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
