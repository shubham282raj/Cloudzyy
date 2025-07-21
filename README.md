# Cloudzyy

## 📋 Overview

Cloudzyy is a modern cloud storage platform that leverages GitHub repositories as storage backends. Store, access, upload, and download files seamlessly through a clean web interface—similar to traditional cloud services like Google Drive—while using GitHub's reliable infrastructure.

## ✨ Features

- **GitHub-Powered Storage**: Store files in both public and private repositories
- **File Management**:
  - Upload and download files of any size
  - Automatic file chunking for large files (>25MB)
  - Organize content with folders and subfolders
  - Smart file naming and retrieval system
- **Security**: Secure access using Personal Access Tokens (PATs)
- **User Experience**:
  - Intuitive web interface
  - Real-time progress tracking for uploads and downloads
  - Responsive design for mobile and desktop

## 🚀 Getting Started

### Prerequisites

- GitHub account
- Web browser (Chrome, Firefox, Safari, Edge recommended)

### Quick Setup

#### 1. Create a GitHub Repository

1. Go to [GitHub New Repository](https://github.com/new)
2. Enter a repository name
3. Choose visibility (Public or Private)
4. **Important**: Do NOT initialize with README or any other files
5. Click "Create repository"

#### 2. Generate a Personal Access Token (PAT)

1. Navigate to [Fine-grained Personal Access Tokens](https://github.com/settings/personal-access-tokens/new)
2. Configure your token:
   - Name: `Cloudzyy Access` (or any name you prefer)
   - Expiration: Select an appropriate timeframe
   - Repository access: Select "Only select repositories"
   - Choose the repository you created
   - Permissions: Set "Contents" to "Read and write"
3. Click "Generate token"
4. **Important**: Copy and save the token immediately; it won't be shown again

#### 3. Register on Cloudzyy

1. Visit the [Cloudzyy Registration Page](https://cloudzyy.web.app/register)
2. Complete the registration form:
   - Name (can be any identifier)
   - Email address
   - GitHub repository name
   - GitHub username (or organization name if applicable)
   - GitHub PAT (from step 2)
   - Password (use a strong, unique password)
3. Submit the form

#### 4. Start Using Cloudzyy

After registration, you'll be redirected to your personal dashboard where you can:

- Upload files
- Create folders
- Manage your stored content

## ⚠️ Limitations

- GitHub repository size limit: 5GB
- Single-threaded operations (no concurrent requests supported)
- API rate limits may apply based on GitHub's policies

## 🔒 Security Considerations

- Your PAT grants access to the specified repository, keep it secure
- Consider setting appropriate expiration dates for your PATs
- No sensitive data is stored on Cloudzyy servers; all operations happen via GitHub's API

## 🛠️ Troubleshooting

### Common Issues

1. **Upload Failures**

   - Check your internet connection
   - Verify your PAT hasn't expired
   - Ensure repository permissions are correctly set

2. **Repository Access Issues**
   - Confirm your GitHub username and repository name are correct
   - Verify PAT permissions include "Contents" with "Read and write" access
