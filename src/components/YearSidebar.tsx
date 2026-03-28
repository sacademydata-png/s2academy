import { Search, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface YearSidebarProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  years: number[];
  isLoggedIn?: boolean;
  onAddYear?: (year: number) => void;
  onDeleteYear?: (year: number) => void;
  examType?: 'neet' | 'jee';
}

const YearSidebar = ({
  selectedYear,
  onYearChange,
  years,
  isLoggedIn,
  onAddYear,
  onDeleteYear,
  examType = 'neet',
}: YearSidebarProps) => {
  const [addOpen, setAddOpen] = useState(false);
  const [newYear, setNewYear] = useState("");

  const handleAddYear = () => {
    const year = parseInt(newYear);
    if (!year || year < 2000 || year > 2099) return;
    if (years.includes(year)) return;
    onAddYear?.(year);
    setNewYear("");
    setAddOpen(false);
  };

  const YearButton = ({ year }: { year: number }) => (
    <div className="flex items-center gap-1 group">
      <Button
        key={year}
        variant={selectedYear === year ? "default" : "ghost"}
        className={`flex-1 justify-start ${
          selectedYear === year
            ? "bg-accent hover:bg-accent/90 text-accent-foreground"
            : ""
        }`}
        onClick={() => onYearChange(year)}
      >
        {examType.toUpperCase()} {year}
      </Button>
      {isLoggedIn && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDeleteYear?.(year)}
          title="Remove year from list"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-card border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
              <Search className="w-6 h-6" />
              <h2>{examType.toUpperCase()} RESULT</h2>
            </div>
            <div className="space-y-2">
              {isLoggedIn && (
                <Button
                  variant="outline"
                  className="w-full justify-start border-dashed text-muted-foreground hover:text-foreground mb-2"
                  onClick={() => setAddOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Year
                </Button>
              )}
              {years.map((year) => (
                <YearButton key={year} year={year} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile/Tablet Dropdown */}
      <div className="lg:hidden bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {examType.toUpperCase()} {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoggedIn && (
            <Button variant="outline" size="icon" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Add Year Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Year</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-year">Year</Label>
              <Input
                id="new-year"
                type="number"
                placeholder="e.g. 2026"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddYear()}
                min={2000}
                max={2099}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddYear}>Add Year</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YearSidebar;
