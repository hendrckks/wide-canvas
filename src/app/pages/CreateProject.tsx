import { useState } from "react";
import { Button } from "../../../.components/ui/button";
import { Input } from "../../../.components/ui/input";
import { Textarea } from "../../../.components/ui/textarea";
import { migrateProjectOrders } from "../../scripts/migrateProjectOrders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../.components/ui/select";
import { createProject } from "../../lib/firebase/firestore";
import { Project, ProjectCategory, ProjectType } from "../../lib/types/project";
import { motion } from "framer-motion";

export default function CreateProject() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    category: ProjectCategory.CONCEPTUAL,
    projectType: ProjectType.COMMERCIAL,
    camera: [],
    lenses: [],
    otherDevices: [],
    location: "",
    client: "",
    time: new Date(),
    images: [],
    slug: "",
  });

  const [newCamera, setNewCamera] = useState("");
  const [newLens, setNewLens] = useState("");
  const [newDevice, setNewDevice] = useState("");

  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string; isPrimary: boolean }[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: selectedImages.length === 0,
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: selectedImages.length === 0,
    }));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const handleSetPrimary = (index: number) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.time ||
      !formData.category ||
      !formData.projectType ||
      !formData.camera?.length ||
      !formData.lenses?.length ||
      !formData.location ||
      selectedImages.length === 0
    ) {
      alert("Please fill in all required fields and add at least one image");
      return;
    }

    try {
      setIsSubmitting(true);
      const projectData = {
        ...formData,
        images: selectedImages.map((img) => ({
          url: img.preview,
          isPrimary: img.isPrimary,
        })),
      } as Project;
      await createProject(projectData);
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: ProjectCategory.CONCEPTUAL,
        projectType: ProjectType.COMMERCIAL,
        camera: [],
        lenses: [],
        otherDevices: [],
        location: "",
        client: "",
        time: new Date(),
        images: [],
        slug: "",
      });
      setDate(new Date());
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        time: selectedDate,
      }));
    }
  };

  const handleAddCamera = () => {
    if (newCamera.trim()) {
      setFormData((prev) => ({
        ...prev,
        camera: [...(prev.camera || []), newCamera.trim()],
      }));
      setNewCamera("");
    }
  };

  const handleAddLens = () => {
    if (newLens.trim()) {
      setFormData((prev) => ({
        ...prev,
        lenses: [...(prev.lenses || []), newLens.trim()],
      }));
      setNewLens("");
    }
  };

  const handleAddDevice = () => {
    if (newDevice.trim()) {
      setFormData((prev) => ({
        ...prev,
        otherDevices: [...(prev.otherDevices || []), newDevice.trim()],
      }));
      setNewDevice("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 p-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-white">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <label htmlFor="name" className="text-sm font-medium text-white">
                Project Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter project name"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 mt-4"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <label
                htmlFor="description"
                className="text-sm font-medium text-white"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter project description"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px] mt-4"
              />
            </motion.div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-4">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  {Object.values(ProjectCategory).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-white/10"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white">
                Project Type
              </label>
              <Select
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, projectType: value }))
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-4">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  {Object.values(ProjectType).map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-white hover:bg-white/10"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white">Cameras</label>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newCamera}
                  onChange={(e) => setNewCamera(e.target.value)}
                  placeholder="Add camera"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  onClick={handleAddCamera}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.camera && formData.camera.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.camera.map((cam, index) => (
                    <div
                      key={index}
                      className="bg-white/10 px-3 py-1 rounded-full text-white"
                    >
                      {cam}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white">Lenses</label>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newLens}
                  onChange={(e) => setNewLens(e.target.value)}
                  placeholder="Add lens"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  onClick={handleAddLens}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.lenses && formData.lenses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.lenses.map((lens, index) => (
                    <div
                      key={index}
                      className="bg-white/10 px-3 py-1 rounded-full text-white"
                    >
                      {lens}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-white">
                Other Devices (Optional)
              </label>
              <div className="flex gap-2 mt-5">
                <Input
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  placeholder="Add device"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  onClick={handleAddDevice}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Add
                </Button>
              </div>
              {formData.otherDevices && formData.otherDevices.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.otherDevices.map((device, index) => (
                    <div
                      key={index}
                      className="bg-white/10 px-3 py-1 rounded-full text-white"
                    >
                      {device}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-2"
            >
              <label
                htmlFor="location"
                className="text-sm font-medium text-white"
              >
                Location
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter project location"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 mt-5"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-2"
            >
              <label
                htmlFor="client"
                className="text-sm font-medium text-white"
              >
                Client (Optional)
              </label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client: e.target.value }))
                }
                placeholder="Enter client name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 mt-5"
              />
            </motion.div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Project Date
              </label>
              <Input
                type="date"
                value={date?.toISOString().split('T')[0]}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  handleDateSelect(selectedDate);
                }}
                className="bg-white/5 border-white/10 text-white mt-5 [color-scheme:dark]"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-white">Project Images</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-white/10 mt-5 rounded-lg p-10 text-center hover:border-white/20 transition-colors"
            >
              <input
                type="file"
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-white/60 hover:text-white transition-colors"
              >
                <p>Drag and drop images here or click to select files</p>
              </label>
            </div>
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className={`w-full aspect-square object-cover rounded-lg ${img.isPrimary ? 'ring-2 ring-[#ff6017]' : ''}`}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={`p-2 ${img.isPrimary ? 'bg-[#ff6017]' : 'bg-white/10'} hover:bg-white/20 text-white text-xs rounded-full`}
                      >
                        Primary
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 bg-white/10 hover:bg-red-500/20 text-white text-xs rounded-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#ff6017] hover:bg-[#ff6017]/80 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </form>

      <Button
        onClick={async () => {
          try {
            const success = await migrateProjectOrders();
            if (success) {
              alert('Successfully migrated project orders');
            } else {
              alert('Failed to migrate project orders');
            }
          } catch (error) {
            console.error('Error during migration:', error);
            alert('Error during migration');
          }
        }}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4"
      >
        Migrate Project Orders
      </Button>
    </div>
  );
}
