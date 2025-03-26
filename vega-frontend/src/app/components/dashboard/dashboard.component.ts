import {Component, inject} from '@angular/core';
import {DatePipe, NgFor, NgIf, SlicePipe} from "@angular/common";
import {ServicesService} from "../../services.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe, NgFor, NgIf, RouterLink, SlicePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user: any;
  blogs: any;

  service = inject(ServicesService);
  router = inject(Router);

  ngOnInit(): void {
    this.service.getBlogs().subscribe((res: any) => {
      this.blogs = res;
      console.log(this.blogs);
    });
  }

  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user);
  }

  viewBlog(blog: any) {
    this.router.navigate(['/post/', blog.slug]);
    localStorage.setItem('blog', JSON.stringify(blog));
  }

  editBlog(blog: any) {
    this.router.navigate(['/edit/', blog.id]);
    localStorage.setItem('blog', JSON.stringify(blog));
  }

  deleteBlog(blogId: number) {
    // Implement delete functionality
    this.service.deleteBlog(blogId).subscribe((res: any) => {
      this.blogs = this.blogs.filter((blog: { id: number; }) => blog.id !== blogId);
    });
  }

  logout() {
    this.service.logout();
    window.location.reload();
  }
}
