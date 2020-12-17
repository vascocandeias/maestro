import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, from, throwError } from 'rxjs';
import { catchError, map, tap, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const URL = environment.api;

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  
  private endpoints = {
    'datasets': true,
    'others': true
  }

  constructor(private http: HttpClient) {}

  // GENERAL METHODS

  /** POST: files to the server */
  batchFileUpload(content: { endpoint: string, metadata: {}, file: any }[]): Observable<string[]> {
    console.log("content", content)
    return forkJoin(content
      .filter(element => this.endpoints[element.endpoint])
      .map(element => {
        console.log("forkJoin", element);
        let formData = new FormData();
        formData.append("file", element.file);
        formData.append("metadata", JSON.stringify(element.metadata))
        return this.http.post<any>(URL + '/' + element.endpoint, formData).pipe(
          tap(console.log),
          take(1),
          map(response => response.datasetId),
          catchError(this.handleError<string>('batchFileUpload'))
        )
      })
    ).pipe(
      tap(console.log)
    );
  }

  /** GET: file from server */
  // TODO: Handle error
  getFile(id: string): Observable<any> {
    console.log("inside service", id);
    const url = URL + "/files/" + id;
    return this.http.get(url, {responseType: 'text'}).pipe(
      catchError(this.handleError<string>('getDatasetFile')),
    );
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
    const url = URL + "/users/me";
    return this.http.delete<any>(url).pipe(
      tap(console.log),
      catchError(this.handleError<string>('deleteUser'))
    );
  }

  // METHODS METHODS

  /** GET: get a method description from the server */
  getMethod(method: string): Observable<any> {
    const url = URL + "/methods/" + method;
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getMethod'))
    );
  }

  /** GET: get list of methods from the server */
  getMethods(): Observable<any> {
    const url = URL + "/methods";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getMethods'))
    );
  }

  /** POST: add a new request to the server */
  postRequest(method: string, data: any): Observable<string> {
    const url = URL + "/methods/" + method;
    return this.http.post<any>(url, data).pipe(
      tap(console.log),
      map(response => response["body"]),
      catchError(this.handleError<string>('postRequest'))
    );
  }
    
  // RESULTS METHODS
  /** GET: get a result from the server */
  getResult(requestId: string): Observable<any> {
    const url = URL + "/results/" + requestId;
    return this.http.get<any>(url).pipe(
        catchError(err => {
          if(err.status == 404) return of(404)
          return throwError(err);
        }),
        catchError(this.handleError<string>('getResult'))
    );
  }

  /** GET: get list of results from the server */
  getResults(): Observable<any> {
    const url = URL + "/results";
    return this.http.get<any>(url).pipe(
        catchError(this.handleError<string>('getResults'))
    );
  }

  /** DELETE: delete result from the server */
  deleteResult(requestId: string): Observable<any> {
    const url = URL + "/results/" + requestId;
    // console.log(url)
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteResult'))
    );
  }

  // EXAMPLES METHODS

  /** GET: get an example from the server */
  getExample(exampleId: string): Observable<any> {
    const url = URL + "/examples/" + exampleId;
    return this.http.get(url, {responseType: "text"}).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getExample'))
    );
  }

  /** GET: get list of examples from the server */
  getExamples(): Observable<any> {
    const url = URL + "/examples";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getExamples'))
    );
  }
  
  
  
  // DATASETS METHODS

  /** GET: get list of datasets from the server */
  getDatasets(): Observable<any> {
    const url = URL + "/datasets";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getDatasets'))
    );
  }

  /** GET: get a dataset from the server */
  getDataset(datasetId: string): Observable<any> {
    const url = URL + "/datasets/" + datasetId;
    return this.http.get<any>(url).pipe(
      switchMap(r => {
        return this.getFile(r.datasetId).pipe(
          map(ans => {
            r.dataset = ans
            r.final = false;
            return r;
          }),
          catchError(this.handleError<string>('getDatasetFile')),
        )
      }),
      catchError(err => {
        if(err.status == 404) return of(undefined)
        return throwError(err);
      }),
      catchError(this.handleError<string>('getDataset')),
    )
  }

  /** POST: add a new dataset to the server */
  postDataset(fileData: any, file: any): Observable<string> {
    const url = URL + "/datasets";
    let formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(fileData))

    return this.http.post<any>(url, formData).pipe(
      map(r => r.datasetId),
      catchError(this.handleError<string>('postDataset'))
    );
  }

  /** DELETE: delete dataset from the server */
  deleteDataset(datasetId: string): Observable<any> {
    const url = URL + "/datasets/" + datasetId;
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteDataset'))
    );
  }

  // NETWORKS METHODS

  /** GET: get a network from the server */
  getNetwork(networkId: string): Observable<any> {
    const url = URL + "/networks/" + networkId;
    return this.http.get<any>(url).pipe(
        catchError(err => {
          if(err.status == 404) return of(404)
          return throwError(err);
        }),
        catchError(this.handleError<string>('getNetwork'))
    );
  }

  /** GET: get list of networks from the server */
  getNetworks(): Observable<any> {
    const url = URL + "/networks";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getNetworks'))
    );
  }

  /** DELETE: delete network from the server */
  deleteNetwork(requestId: string): Observable<any> {
    const url = URL + "/networks/" + requestId;
    return this.http.delete<any>(url).pipe(
        catchError(this.handleError<string>('deleteNetwork'))
    );
  }


  // OTHERS METHODS

  /** GET: get list of other files from the server */
  getOthers(): Observable<any> {
    const url = URL + "/others";
    return this.http.get<any>(url).pipe(
        tap(r => console.log(r)),
        catchError(this.handleError<string>('getOthers'))
    );
  }

  /** DELETE: delete other file from the server */
  deleteOther(otherId: string): Observable<any> {
    const url = URL + "/others/" + otherId;
    // console.log(url)
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

      return of(result as T);
    };
  }
}
