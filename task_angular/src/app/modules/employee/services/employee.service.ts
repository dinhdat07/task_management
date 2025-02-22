import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  public getTasksByEmployeeId(): Observable<any> {
    return this.http.get(BASIC_URL + '/api/employee/tasks', {
      headers: this.createAuthorizationHeader()
    })
  }

  public searchTasks(title: string): Observable<any> {
    return this.http.get(BASIC_URL + '/api/employee/tasks/search?title=' + title, {
      headers: this.createAuthorizationHeader()
    })
  }

  
  public updateTaskStatus(id: number, status: string): Observable<any> {
    return this.http.put(BASIC_URL + `/api/employee/task/${id}/${status}` , {}, {
      headers: this.createAuthorizationHeader()
    })
  }

  getTask(id: number): Observable<any>{
    return this.http.get(BASIC_URL + '/api/employee/task/' + id, {
      headers: this.createAuthorizationHeader()
    })
  }

  postComment(taskId: number, content: string): Observable<any>{
    const params = {
      content: content
    }
    return this.http.post(BASIC_URL + '/api/employee/task/comment/' + taskId, params, {
      params: params,
      headers: this.createAuthorizationHeader()
    })
  }
  
  getComments(taskId: number): Observable<any>{
    return this.http.get(BASIC_URL + '/api/employee/task/comments/' + taskId, {
      headers: this.createAuthorizationHeader()
    })
  }
  
  
  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + StorageService.getToken()
    )
  };
  



}
