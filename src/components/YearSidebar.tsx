import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSidebarProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  years: number[];
}

const YearSidebar = ({ selectedYear, onYearChange, years }: YearSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-card border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
              <Search className="w-6 h-6" />
              <h2>RESULT</h2>
            </div>
            <div className="space-y-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedYear === year 
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
                      : ""
                  }`}
                  onClick={() => onYearChange(year)}
                >
                  NEET {year}
                </Button>
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
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  NEET {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default YearSidebar;
