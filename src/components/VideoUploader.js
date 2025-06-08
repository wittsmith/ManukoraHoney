import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Text, Button } from '@tremor/react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const VideoUploader = ({ onUploadComplete, initialVideoUrl = null, beekeeperName = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Generate filename using beekeeper name and original file extension
      const fileExt = file.name.split('.').pop();
      const sanitizedName = beekeeperName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      // Add timestamp to prevent conflicts
      const timestamp = Date.now();
      const fileName = `${sanitizedName}-${timestamp}.${fileExt}`;
      const filePath = `${fileName}`;

      // If there's an existing video, delete it first
      if (videoUrl) {
        const oldFilePath = videoUrl.split('/').pop();
        await supabase.storage
          .from('beekeeper-videos')
          .remove([oldFilePath]);
      }

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('beekeeper-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false, // Changed to false to prevent policy issues
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          },
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('beekeeper-videos')
        .getPublicUrl(filePath);

      setVideoUrl(publicUrl);
      onUploadComplete(publicUrl);
      setUploading(false);
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };

  const handleRemoveVideo = async () => {
    if (!videoUrl) return;

    try {
      // Extract the file path from the URL
      const filePath = videoUrl.split('/').pop();
      
      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('beekeeper-videos')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      setVideoUrl(null);
      onUploadComplete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text className="font-medium">Video Upload</Text>
          {videoUrl && (
            <Button
              size="xs"
              variant="secondary"
              icon={XMarkIcon}
              onClick={handleRemoveVideo}
              className="text-red-500"
            >
              Remove Video
            </Button>
          )}
        </div>

        {!videoUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="secondary"
              icon={CloudArrowUpIcon}
              onClick={handleButtonClick}
              disabled={uploading}
              className="w-full"
              type="button"
            >
              {uploading ? 'Uploading...' : 'Select Video'}
            </Button>
            {uploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <Text className="text-sm text-gray-500 mt-1">
                  {Math.round(uploadProgress)}% uploaded
                </Text>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Text className="text-green-600">✓ Video uploaded successfully</Text>
          </div>
        )}

        {error && (
          <Text className="text-red-500 text-sm">{error}</Text>
        )}
      </div>
    </Card>
  );
};

export default VideoUploader; 