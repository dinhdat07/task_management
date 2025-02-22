import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/users', {
      headers: this.createAuthorizationHeader()
    })
  }

  postTask(taskDTO: any): Observable<any>{
    return this.http.post(BASIC_URL + '/api/admin/task', taskDTO, {
      headers: this.createAuthorizationHeader()
    })
  }

  getAllTasks(): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/tasks', {
      headers: this.createAuthorizationHeader()
    })
  }

  getTask(id: number): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/task/' + id, {
      headers: this.createAuthorizationHeader()
    })
  }

  deleteTask(id: number): Observable<any>{
    return this.http.delete(BASIC_URL + '/api/admin/task/' + id, {
      headers: this.createAuthorizationHeader()
    })
  }

  updateTask(id: number, taskDTO: any): Observable<any>{
    return this.http.put(BASIC_URL + '/api/admin/task/' + id, taskDTO, {
      headers: this.createAuthorizationHeader()
    })
  }

  searchTasks(title: string): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/tasks/search?title=' + title, {
      headers: this.createAuthorizationHeader()
    })
  }

  postComment(taskId: number, content: string): Observable<any>{
    const params = {
      content: content
    }
    return this.http.post(BASIC_URL + '/api/admin/task/comment/' + taskId, params, {
      params: params,
      headers: this.createAuthorizationHeader()
    })
  }
  
  getComments(taskId: number): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/task/comments/' + taskId, {
      headers: this.createAuthorizationHeader()
    })
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization','Bearer ' + StorageService.getToken()
    )
  }


}
