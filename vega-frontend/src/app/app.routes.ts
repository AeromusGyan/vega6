import {Routes} from '@angular/router';
import {SignupComponent} from "./components/signup/signup.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {EditComponent} from "./components/blog/edit/edit.component";
import {CreateComponent} from "./components/blog/create/create.component";
import {BlogsComponent} from "./components/blog/blogs/blogs.component";
import {PostComponent} from "./components/blog/post/post.component";
import {gaurdGuard} from "./gaurd.guard";

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [gaurdGuard]
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    canActivate: [gaurdGuard]
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [gaurdGuard]
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    canActivate: [gaurdGuard]
  },
  {
    path: 'post/:slug',
    component: PostComponent,
    canActivate: [gaurdGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
