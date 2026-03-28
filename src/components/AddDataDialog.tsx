import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AddDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  years: number[];
  examType: 'neet' | 'jee';
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const AddDataDialog = ({ open, onOpenChange, onSuccess, years, examType }: AddDataDialogProps) => {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        if (imageFile.size > MAX_IMAGE_SIZE) {
          throw new Error("Image size must be less than 2MB");
        }
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('student-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('student-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert student record
      const tableName = examType === 'neet' ? 'students' : 'jee_students';
      const { error } = await supabase
        .from(tableName)
        .insert([
          {
            name,
            college,
            year: parseInt(year),
            image_url: imageUrl,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student record added successfully",
      });

      setName("");
      setCollege("");
      setYear("");
      setImageFile(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add student record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College Name</Label>
            <Input
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter college name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={year} onValueChange={setYear} required>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {examType.toUpperCase()} {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Student Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > MAX_IMAGE_SIZE) {
                  toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Image must be less than 2MB. Please choose a smaller file.",
                  });
                  e.target.value = "";
                  setImageFile(null);
                } else {
                  setImageFile(file);
                }
              }}
            />
            {imageFile && (
              <p className="text-xs text-muted-foreground">
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB / 2 MB max
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataDialog;
