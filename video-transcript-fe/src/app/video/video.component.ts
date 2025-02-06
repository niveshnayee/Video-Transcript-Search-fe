import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Video, VideoSearchResponse, VideoSearchResult } from '../../type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


interface ChatMessage {
  text: string;
  sender: 'user' | 'bot'; // 'user' (right side), 'bot' (left side)
  timestamp?: number;

}

@Component({
  selector: 'app-video',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  standalone: true,
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})

export class VideoComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;



  video: Video;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  chatHeight: number = 500; // Default chatbox height

  // errorMessage: string | null = null; // To show error popup


  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  )
  {
    const navigation = this.router.getCurrentNavigation();
    this.video = navigation?.extras?.state?.['video'];

    if (!this.video) {
      // Redirect to home if no video is passed
      const videoId = this.route.snapshot.paramMap.get('id');
      // this.router.navigate(['/']);
      this.fetchVideoDetails(videoId); // Fetch video details via API
    }
  }

  fetchVideoDetails(videoId: string | null): void {
    if (!videoId) {
      this.router.navigate(['/']);
      return;
    }
    // Replace with your service's API call
    // this.productsService.getVideoById(videoId).subscribe(
    //   (response) => {
    //     if (response.success) {
    //       this.video = response.data.video;
    //     } else {
    //       console.error(response.message);
    //       this.router.navigate(['/']);
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching video details:', error);
    //     this.router.navigate(['/']);
    //   }
    // );
  }

  // Send message in the chatbot
  async sendMessage() {
    if (!this.newMessage.trim()) return;

    
    const userMessage: ChatMessage = { text: this.newMessage.trim(), sender: 'user' };
    this.messages.push(userMessage);

    const query = this.newMessage.trim();
    this.newMessage = '';

    // Add logic here for chatbot interaction (e.g., API call)
    await this.productsService.searchVideoMessages(this.video.video_id, query)
    .subscribe((response : VideoSearchResponse) => {
      if (response.success && response.data.results.length > 0) {
        response.data.results.forEach((result: VideoSearchResult) => {
          this.messages.push({
            text: result.text,
            sender: 'bot',
            timestamp: result.seconds
            // videoLink: result.video_link
          });
        });
      } else {
        this.messages.push({ text: "No relevant results found.", sender: 'bot' });
        this.showError('Failed to retrieve results. Try again.');
      }
    }, error => {
      this.showError('Failed to retrieve results. Try again.');
      console.error('Error fetching search results:', error);
      this.messages.push({ text: "Failed to retrieve results. Try again.", sender: 'bot' });
    } );

    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-content');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }


  // Jump to video timestamp
  seekToTimestamp(timestamp: number) {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.currentTime = timestamp;
      this.videoPlayer.nativeElement.play();
    } else {
      this.snackBar.open('Video player not found.', 'Close', { duration: 3000 });
    }
  }

  // Adjust chat height dynamically based on window size
  @HostListener('window:resize')
  adjustChatHeight() {
    if (this.chatContainer) {
      this.chatHeight = window.innerHeight * 0.5; // Set height to 50% of screen height
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
