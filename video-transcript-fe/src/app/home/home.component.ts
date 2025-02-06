import { Component } from '@angular/core';
import { Video, VideoResponse } from '../../type';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import Plyr from 'plyr'; 



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  constructor(private productsService: ProductsService, private router: Router) {}

  videos: any[] = []; // To store video data
  errorMessage: string | null = null; // For error handling

  isLoading = true;
  searchQuery = '';

  ngOnInit(){
    this.loadVideos()
  }

  async loadVideos() {
    try {
      this.productsService
    .getVideos('http://0.0.0.0:8000/videos')
    .subscribe(
      (videoRes : VideoResponse) => 
      {
        if (videoRes.success) {
          // this.videos = videoRes.data.videos; // Save the video data
          // // Initialize Plyr players
          // this.videos.forEach(video => {
          //   const player = new Plyr('#player-' + video.video_id); 
          // });
          this.videos = videoRes.data.videos.map((video) => ({
            ...video,
            showOptions: false, // Add a property to control options visibility
          }));
          console.log(this.videos);
        } else {
          this.errorMessage = videoRes.message;
          console.error(this.errorMessage);
        }
      },
      (error) => {
        this.errorMessage = `Error fetching videos: ${error.message}`;
        console.error(this.errorMessage);
      }
    );

    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      this.isLoading = false;
    }
  }


  onVideoClick(video: Video): void {
    this.router.navigate(['/video', video.video_id], { state: { video } });
  }
  

  // Toggle the visibility of options for a specific video
  toggleOptions(videoId: string): void {
    this.videos = this.videos.map((video) =>
      video.video_id === videoId
        ? { ...video, showOptions: !video.showOptions }
        : { ...video, showOptions: false }
    );
  }

  stopEvent(event: Event): void {
    event.stopPropagation(); // Prevent event from propagating to parent elements
  }
  

  // Handle the delete action
  deleteVideo(videoId: string): void {
    if (confirm('Are you sure you want to delete this video?')) {
      const url =`http://0.0.0.0:8000/delete_video/${videoId}`
      this.productsService.deleteVideo(url).subscribe(
        (response) => {
          if (response.success) {
            this.videos = this.videos.filter((video) => video.video_id !== videoId);
          } else {
            console.error(response.message);
          }
        },
        (error) => {
          console.error('Error deleting video:', error);
        }
      );
    }
  }

  // Placeholder for edit functionality
  editVideo(videoId: string): void {
    alert('Edit functionality will be implemented here.');
  }
}
