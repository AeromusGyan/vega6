import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  baseUrl = 'http://localhost:2002/api';

  constructor(private http: HttpClient) {
  }

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/token`, data);
  }

  saveLogin(response: any) {
    localStorage.setItem('token', JSON.stringify(response.token));
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  getBlogs() {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get(`${this.baseUrl}/blogs`, {headers});
  }

  getBlog(slug: string) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get(`${this.baseUrl}/blogs/slug/${slug}`, {headers});
  }

  createBlog(data: any) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post(`${this.baseUrl}/blogs`, data, {headers});
  }

  updateBlog(data: any, id: string) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.put(`${this.baseUrl}/blogs/${id}`, data, {headers});
  }

  deleteBlog(id: number) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete(`${this.baseUrl}/blogs/${id}`, {headers});
  }

  addReply(data: any) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post(`${this.baseUrl}/blogs/replies`, data, {headers});
  }



  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
