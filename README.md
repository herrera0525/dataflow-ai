# DataFlow AI

Intelligent document processing and automation platform powered by AI.

## Features

- **Document Processing**: Upload and process PDFs, images, Excel files, and CSV documents
- **AI-Powered Automations**: Extract text with OCR, process invoices, classify documents, and convert data formats
- **Smart Assistant**: AI-powered chat interface for document queries and insights
- **Team Collaboration**: Multi-user workspace with role-based permissions
- **Real-time Activity Tracking**: Monitor automation progress and document processing status

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/herrera0525/dataflow-ai.git
   cd dataflow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase with the following tables:
- `companies` - Enterprise accounts and subscription plans
- `profiles` - Extended user information
- `documents` - Uploaded documents for processing
- `automations` - Automation tasks and history
- `activities` - System activity log

All tables have Row Level Security (RLS) enabled for data protection.

## Security

This application implements:
- Strong password requirements (8+ characters, mixed case, numbers)
- Row Level Security on all database tables
- Sanitized error messages
- Input validation and sanitization
- Development-only console logging

## License

MIT