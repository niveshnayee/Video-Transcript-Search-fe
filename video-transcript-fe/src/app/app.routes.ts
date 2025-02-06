import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { VideoComponent } from './video/video.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'video/:id', component: VideoComponent }, // Route for individual video

];
