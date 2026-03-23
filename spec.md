# AKF Fabrications

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Professional fabrication company website for AKF FABRICATIONS
- Hero section with company name, tagline, and bold industrial branding
- About / Services section highlighting fabrication capabilities
- Social-style media feed (posts with images and/or videos) - like a Facebook feed
- Admin login so the owner can create, edit, and delete posts
- Each post: caption text, optional image(s), optional video, timestamp
- Public visitors can view all posts without logging in
- Unique heavy-industry aesthetic

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Post data model (id, caption, mediaUrls[], mediaTypes[], timestamp, authorId). CRUD operations for posts. Authorization for admin role. Blob storage for media uploads.
2. Frontend: Landing hero section, navigation bar, services section, media feed with post cards, admin panel to create/manage posts, file upload (images & videos) via blob-storage.
