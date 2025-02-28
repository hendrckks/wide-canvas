import React, { useState, useEffect } from "react";
import {
  uploadVideo,
  getAllVideos,
  deleteVideo,
  updateVideoMetadata,
  VideoData,
} from "../../lib/firebase/videoServices";
import { Trash2, Edit, FilmIcon, Upload, RefreshCw } from "lucide-react";

const VideoManager: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [overlayPosition, setOverlayPosition] = useState(1);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await getAllVideos();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch videos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "intro" | "trailer" | "overlay" | "other"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      setUploading(true);
      // Simulate upload progress (in a real app, you'd use Firebase's upload progress)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload the video
      const uploadedVideo = await uploadVideo(
        file,
        type,
        type === "overlay" ? overlayPosition : undefined
      );

      // Clear interval and set progress to 100%
      clearInterval(interval);
      setUploadProgress(100);

      // Update the videos list
      setVideos((prev) => [uploadedVideo, ...prev]);

      // Reset after a second
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to upload video");
      console.error(err);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) {
      setError("Failed to delete video");
      console.error(err);
    }
  };

  const startEditing = (video: VideoData) => {
    setEditingVideo(video);
    setEditForm({
      name: video.name,
      description: video.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditForm({ name: "", description: "" });
  };

  const saveEdits = async () => {
    if (!editingVideo || !editingVideo.id) return;

    try {
      await updateVideoMetadata(editingVideo.id, {
        name: editForm.name,
        description: editForm.description,
      });

      // Update the videos list
      setVideos((prev) =>
        prev.map((video) =>
          video.id === editingVideo.id
            ? {
                ...video,
                name: editForm.name,
                description: editForm.description,
              }
            : video
        )
      );

      cancelEditing();
    } catch (err) {
      setError("Failed to update video");
      console.error(err);
    }
  };

  const updateOverlayPosition = async (videoId: string, position: number) => {
    if (!videoId) return;

    try {
      await updateVideoMetadata(videoId, { overlayPosition: position });

      // Update the videos list
      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, overlayPosition: position } : video
        )
      );
    } catch (err) {
      setError("Failed to update overlay position");
      console.error(err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getVideoTypeLabel = (type: string) => {
    switch (type) {
      case "intro":
        return "Intro Video";
      case "trailer":
        return "Trailer";
      case "overlay":
        return "Overlay";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Video Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Intro Video</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This video will be shown in the hero section and should be a short
            loop.
          </p>
          <label className="block w-full">
            <div className="relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={(e) => handleFileUpload(e, "intro")}
                disabled={uploading}
                className="sr-only"
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() =>
                  (
                    document.querySelectorAll(
                      'input[type="file"]'
                    )[0] as HTMLInputElement
                  ).click()
                }
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading ? "Uploading..." : "Select & Upload Intro Video"}
              </button>
              {uploading && (
                <div className="mt-2 h-2 w-full bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Trailer Video</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This video will be shown when the user clicks "Watch Trailer" in
            fullscreen mode.
          </p>
          <label className="block w-full">
            <div className="relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={(e) => handleFileUpload(e, "trailer")}
                disabled={uploading}
                className="sr-only"
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() =>
                  (
                    document.querySelectorAll(
                      'input[type="file"]'
                    )[1] as HTMLInputElement
                  ).click()
                }
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading ? "Uploading..." : "Select & Upload Trailer Video"}
              </button>
            </div>
          </label>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Overlay Video</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            These videos will be shown in the "What You Get" section. Select a
            position (1-4).
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Overlay Position
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setOverlayPosition(pos)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md 
                    ${
                      overlayPosition === pos
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
          <label className="block w-full">
            <div className="relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={(e) => handleFileUpload(e, "overlay")}
                disabled={uploading}
                className="sr-only"
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() =>
                  (
                    document.querySelectorAll(
                      'input[type="file"]'
                    )[2] as HTMLInputElement
                  ).click()
                }
                disabled={uploading}
              >
                <Upload size={18} />
                {uploading
                  ? "Uploading..."
                  : `Upload Overlay Video (Position ${overlayPosition})`}
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Uploaded Videos</h2>
        <button
          onClick={fetchVideos}
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <FilmIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            No videos uploaded yet
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {videos.map((video) => (
                <tr
                  key={video.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVideo?.id === video.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Video name"
                        />
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Description (optional)"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-9 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          <video
                            src={video.url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {video.name}
                          </div>
                          {video.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {video.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        video.type === "intro"
                          ? "bg-green-100 text-green-800"
                          : video.type === "trailer"
                          ? "bg-blue-100 text-blue-800"
                          : video.type === "overlay"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getVideoTypeLabel(video.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {video.type === "overlay" ? (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4].map((pos) => (
                          <button
                            key={pos}
                            onClick={() =>
                              video.id && updateOverlayPosition(video.id, pos)
                            }
                            className={`w-6 h-6 flex items-center justify-center rounded-md text-xs
                              ${
                                video.overlayPosition === pos
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(video.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingVideo?.id === video.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={saveEdits}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => startEditing(video)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => video.id && handleDelete(video.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
