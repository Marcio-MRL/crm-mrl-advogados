
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
  parents: string[];
}

export interface DocumentMetadata {
  id: string;
  drive_file_id: string;
  name: string;
  description?: string;
  category: string;
  client_id?: string;
  process_id?: string;
  user_id: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface UploadMetadata {
  name: string;
  description?: string;
  category: string;
  client_id?: string;
  process_id?: string;
  parent_folder_id?: string;
}
