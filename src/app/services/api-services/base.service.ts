import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected readonly _http = inject(HttpClient);

  private readonly baseUrl: string = environment.baseurl;

  get<ResponseType>(url: string, headers?: any, params?: any) {
    return this._http.get<ResponseType>(this.baseUrl + url, {
      headers,
      params,
    });
  }

  getBlob(url: string, headers?: any, params?: any) {
    return this._http.get(this.baseUrl + url, {
      headers,
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  post<ResponseType, RequestBodyType>(
    url: string,
    body: RequestBodyType,
    headers?: any,
    params?: any
  ) {
    return this._http.post<ResponseType>(this.baseUrl + url, body, {
      headers,
      params,
    });
  }

  postFormData<ResponseType>(
    url: string,
    formData: FormData,
    headers?: any,
    params?: any
  ) {
    return this._http.post<ResponseType>(this.baseUrl + url, formData, {
      headers,
      params,
    });
  }

  put<ResponseType, RequestBodyType>(
    url: string,
    body: RequestBodyType,
    headers?: any,
    params?: any
  ) {
    return this._http.put<ResponseType>(this.baseUrl + url, body, {
      headers,
      params,
    });
  }

  delete<ResponseType>(url: string, headers?: any, params?: any) {
    return this._http.delete<ResponseType>(this.baseUrl + url, {
      headers,
      params,
    });
  }
}
