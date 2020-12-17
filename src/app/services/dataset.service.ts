import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, from } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Storage } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private url  = 'https://4jkso1e7i7.execute-api.eu-west-2.amazonaws.com/beta';  // URL to web api
  private endpoints = {
    'datasets': true,
    'others': true
  }

  constructor(private http: HttpClient) {}

  // GENERAL METHODS

  /** POST: files to the server */
  batchFileUpload(content: { endpoint: string, metadata: {}, file: any }[]): Observable<string[]> {
    return forkJoin(content.filter(element => this.endpoints[element.endpoint]).map(element => {
      console.log(element);
      return this.http.post<any>(this.url + '/' + element.endpoint, element.metadata).pipe(
        switchMap(async response => {
          console.log("posting", element.file.name, response.datasetId);
          try {
            const result = await Storage.put(response.datasetId, element.file);
            console.log("put", result);
            return response.datasetId;
          }
          catch (err) {
            return console.log(err);
          }
        }),
        catchError(this.handleError<string>('batchFileUpload'))
      )
      }));
  }

  /** GET: file from server */
  // TODO: Handle error
  getFile(id: string): Observable<any> {
    console.log("inside service", id);
    return from(Storage.get(id, { download: true }).then((result: any) => {return result.Body.text()}));
  }

  /** download file from server */
  // TODO: Handle error
  downloadFile(id: string, name: string): void {
    this.getFile(id).subscribe(result => this.download(result, name));
  }

  /** download file from input */
  download(file: any, name: string): void {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
    element.setAttribute('download', name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /** DELETE: delete user */
  deleteUser(): Observable<any> {
    const url = this.url + "/users";
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteUser'))
    );
  }

  // METHODS METHODS

  /** GET: get a method description from the server */
  getMethod(method: string): Observable<any> {
    const url = this.url + "/methods/" + method;
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getMethod'))
    );
  }

  /** GET: get list of methods from the server */
  getMethods(): Observable<any> {
    const url = this.url + "/methods";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getMethods'))
    );
  }

  /** POST: add a new request to the server */
  postRequest(method: string, data: any): Observable<string> {
    const url = this.url + "/methods/" + method;
    return this.http.post<any>(url, data).pipe(
        tap(console.log),
        map(response => response["body"]),
        catchError(this.handleError<string>('postRequest'))
    );
  }

  // RESULTS METHODS

  /** GET: get a result from the server */
  getResult(requestId: string): Observable<any> {
    const url = this.url + "/results/" + requestId;
    return this.http.get<any>(url).pipe(
        tap(response => console.log("statusCode", response["statusCode"])),
        map(response => response["statusCode"] == 200
        ? JSON.parse(response["body"])
        : response["statusCode"]),
        catchError(this.handleError<string>('getResult'))
    );
  }

  /** GET: get list of results from the server */
  getResults(): Observable<any> {
    const url = this.url + "/results";
    return this.http.get<any>(url).pipe(
        catchError(this.handleError<string>('getResults'))
    );
  }

  /** DELETE: delete result from the server */
  deleteResult(requestId: string): Observable<any> {
    const url = this.url + "/results/" + requestId;
    // console.log(url)
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteResult'))
    );
  }

  // EXAMPLES METHODS

  /** GET: get an example from the server */
  getExample(exampleId: string): Observable<any> {
    const url = this.url + "/examples/" + exampleId;
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        map(r => r.file),
        catchError(this.handleError<string>('getExample'))
    );
  }

  /** GET: get list of examples from the server */
  getExamples(): Observable<any> {
    const url = this.url + "/examples";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getExamples'))
    );
  }
  
  
  
  // DATASETS METHODS

  /** GET: get list of datasets from the server */
  getDatasets(): Observable<any> {
    const url = this.url + "/datasets";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getDatasets'))
    );
  }

  /** GET: get a dataset from the server */
  getDataset(datasetId: string): Observable<any> {
    console.log("getting", datasetId)
    const url = this.url + "/datasets/" + datasetId;
    return this.http.get<any>(url).pipe(
        tap(r => console.log("getDataset reply", r)),
        switchMap(async r => {
          if(!r.datasetId) return undefined;
          try {
            const result = await Storage.get(r.datasetId, { download: true });
            r.dataset = result["Body"];
            r.final = false;
            return r;
          }
          catch (err) {
            return console.log(err);
          }
        }),
        catchError(this.handleError<string>('getDataset')),
    );
  }

  /** POST: add a new dataset to the server */
  postDataset(fileData: any, file: any): Observable<string> {
    const url = this.url + "/datasets";
    return this.http.post<any>(url, fileData).pipe(
        switchMap(async response => {
          console.log("posting", file.name, response.datasetId);
          try {
            const result = await Storage.put(response.datasetId, file);
            console.log("put", result);
            return response.datasetId;
          }
          catch (err) {
            return console.log(err);
          }
        }),
        catchError(this.handleError<string>('postDataset'))
    );
  }

  /** DELETE: delete dataset from the server */
  deleteDataset(datasetId: string): Observable<any> {
    const url = this.url + "/datasets/" + datasetId;
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteDataset'))
    );
  }

  // NETWORKS METHODS

  /** GET: get a network from the server */
  getNetwork(networkId: string): Observable<any> {
    const url = this.url + "/networks/" + networkId;
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        map(response => response["statusCode"] == 200
        ? JSON.parse(response["body"])
        : null),
        catchError(this.handleError<string>('getNetwork'))
    );
  }

  /** GET: get list of networks from the server */
  getNetworks(): Observable<any> {
    const url = this.url + "/networks";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getNetworks'))
    );
  }

  /** DELETE: delete network from the server */
  deleteNetwork(requestId: string): Observable<any> {
    const url = this.url + "/networks/" + requestId;
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteNetwork'))
    );
  }


  // OTHERS METHODS

  /** GET: get list of other files from the server */
  getOthers(): Observable<any> {
    const url = this.url + "/others";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getOthers'))
    );
  }

  /** DELETE: delete other file from the server */
  deleteOther(otherId: string): Observable<any> {
    const url = this.url + "/others/" + otherId;
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteOther'))
    );
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
      console.log("ERROR", operation);

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
