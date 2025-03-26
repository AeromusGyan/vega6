import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ServicesService} from "../../../services.service";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  blogForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  statusOptions = ['Draft', 'Published', 'Archived'];

  router = inject(Router);
  blog: any;

  constructor(private fb: FormBuilder, private service: ServicesService) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      status: ['Draft', [Validators.required]],
      image: [null, [Validators.required]]
    });

    // Auto-generate slug from title
    this.blogForm.get('title')?.valueChanges.subscribe(title => {
      if (title && this.blogForm.get('slug')?.pristine) {
        const slug = title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        this.blogForm.get('slug')?.setValue(slug);
      }
    });

    this.blog = JSON.parse(localStorage.getItem("blog")!);
    this.blogForm.patchValue({
      title: this.blog.title,
      slug: this.blog.slug,
      description: this.blog.description,
      status: this.blog.status
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.blogForm.patchValue({image: file});

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      const formData = new FormData();

      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('slug', this.blogForm.get('slug')?.value);
      formData.append('description', this.blogForm.get('description')?.value);
      formData.append('status', this.blogForm.get('status')?.value);
      formData.append('thumbnail_id', this.blog.thumbnail_id);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.service.updateBlog(formData, this.blog.id).subscribe({
        next: (response) => {
          console.log('Blog updated successfully', response);
          this.blogForm.reset({
            status: 'Draft'
          });
          this.previewUrl = null;
          this.selectedFile = null;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating blog', error);
        }
      });

    } else {
      this.blogForm.markAllAsTouched();
    }
  }
}
