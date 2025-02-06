import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isUploadModalOpen = false;
  video_name = '';
  video_category = '';
  video_description = '';
  selectedFile: File | null = null;
  isUploading = false;  // Track upload status
  uploadError: string | null = null;  // Track error message
  uploadSuccess: boolean = false;  // Track successful upload

  constructor(private productsService: ProductsService) {}

  openUploadModal() {
    this.isUploadModalOpen = true;
  }

  closeUploadModal() {
    this.isUploadModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.video_name = '';
    this.video_category = '';
    this.video_description = '';
    this.selectedFile = null;
    this.uploadError = null;
    this.uploadSuccess = false;
  }


  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onUploadSubmit() {

    if (!this.video_name || !this.video_category || !this.selectedFile) {
      this.uploadError = 'Please fill all required fields and select a video file.';
      return;
    }

    this.isUploading = true;
    this.uploadError = null;
    this.uploadSuccess = false;

    try {
      // Step 1: Get signed URL
      const response = await this.productsService.getSignedUrl(this.video_name).toPromise();
      const uploadUrl = response.upload_url;
      const fileId = response.file_id;

      // Step 2: Upload video to GCS
      await this.productsService.uploadToGCS(uploadUrl, this.selectedFile).toPromise();

      const formData = new FormData();
      formData.append('video_name', this.video_name);
      formData.append('video_category', this.video_category);
      formData.append('video_description', this.video_description);
      formData.append('fileId', fileId);

      // Step 3: Notify the backend
      this.productsService
        .notifyBackend('http://0.0.0.0:8000/upload_video', formData)
        .subscribe(
          () => {
            this.isUploading = false;
            this.uploadSuccess = true;
            setTimeout(() => this.closeUploadModal(), 2000);
            // console.log('Video uploaded successfully:', response);
            // Provide UI feedback
          },
          (error) => {
            this.isUploading = false;
            this.uploadError = 'Error uploading video. Please try again.';
            console.error('Error uploading video:', error);
          }
        );
    } catch (error) {
      this.isUploading = false;
      this.uploadError = 'Upload failed. Please check your internet connection and try again.';
      console.error('Error in upload process:', error);
    }
  }
}
