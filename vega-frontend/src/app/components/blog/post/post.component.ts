import {Component, inject} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ServicesService} from "../../../services.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  post: any;

  route = inject(ActivatedRoute);
  service = inject(ServicesService);
  slug: any;
  replies: any[] = []; 
  replyForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.replyForm = this.fb.group({
      text: ['', [Validators.required]]
    });
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.service.getBlog(this.slug).subscribe((post: any) => {
        this.post = post;
      });
    });
  }

  onSubmit(): void {
    if (this.replyForm.invalid) {
      return;
    }

    const newReply = {
      text: this.replyForm.value.text,
      blogId: this.post.id
    };

    this.service.addReply(newReply).subscribe(
      (response) => {
        this.replies.push(response);
        this.replyForm.reset();
      },
      (error) => {
        console.error('Error adding reply:', error);
      }
    );
  }
}
