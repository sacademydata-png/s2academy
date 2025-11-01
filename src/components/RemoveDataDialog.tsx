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

interface RemoveDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  years: number[];
}

const RemoveDataDialog = ({ open, onOpenChange, onSuccess, years }: RemoveDataDialogProps) => {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('students')
        .delete()
        .match({
          name,
          college,
          year: parseInt(year),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student record deleted successfully",
      });

      setName("");
      setCollege("");
      setYear("");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete student record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Student Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="remove-name">Student Name</Label>
            <Input
              id="remove-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remove-college">College Name</Label>
            <Input
              id="remove-college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter college name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remove-year">Year</Label>
            <Select value={year} onValueChange={setYear} required>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    NEET {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
            {loading ? "Removing..." : "Remove Student"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveDataDialog;
