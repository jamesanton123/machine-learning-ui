import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  
  private wekaRestBaseUrl = 'http://localhost:8080';
  private feederBaseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getModels(): Observable<any[]> {
    return this.http.get<any[]>(this.feederBaseUrl + '/models');
  }

  createModel(name: string): Observable<any> {
    return this.http.post<any>(this.feederBaseUrl + '/model', {
      "name": name
    });
  }

  getProviders(): Observable<any[]> {
    return this.http.get<any[]>(this.feederBaseUrl + '/providers');
  }

  getProviderDetails(providerId: string) : Observable<any> {
    return this.http.get<any>(this.feederBaseUrl + '/provider/' + providerId);
  }

  getParamEnums() : Observable<any> {
    return this.http.get<any[]>(this.feederBaseUrl + '/paramEnums'); 
  } 

  // addProviderToModel(modelId: string, dataProviderParamId: string, argValue: string) : Observable<any> {
  //   return this.http.post<any>(this.feederBaseUrl + 'model/' + modelId + '/provider', {
  //     "dataProviderParamId": dataProviderParamId,
  //     "argValue": argValue
  //   });
  // }

  addProviderToModel(modelId: string, providerId: string, params: { dataProviderParamId: string; argValue: string }[]): Observable<any> {
    var url = this.feederBaseUrl + '/model/' + modelId + '/provider/' + providerId;
    return this.http.post<any>(url, params);
  }

  getProvidersForModel(modelId: string): Observable<any> {
    // model/{modelId}/providers
    var url = this.feederBaseUrl + '/model/' + modelId + '/providers';
    return this.http.get<any>(url);
  }

  initiateProviderRetrieval(modelId: string): Observable<any> {
    // model/{modelId}/providers
    var url = this.feederBaseUrl + '/model/' + modelId + '/startRetrieval';
    return this.http.post<any>(url, {});
  }

  loadProviderData(modelId: string): Observable<any> {
    // model/{modelId}/providers
    var url = this.feederBaseUrl + '/model/' + modelId + '/providerData';
    return this.http.get<any>(url);
  }

  testAndTrain(modelId: string) {
    var url = this.feederBaseUrl + '/model/' + modelId + '/testAndTrainModel';
    return this.http.post<any>(url, {});
  }

  classify(modelId: string, params: { modelProviderId: string; value: string }[]) {
    var url = this.feederBaseUrl + '/model/' + modelId + '/classify';
    return this.http.post<any>(url, params);
  }

  getClassificationParams(modelId: string): Observable<any> {
    var url = this.feederBaseUrl + '/model/' + modelId + '/classificationParams';
    return this.http.get<any>(url);
  }

}