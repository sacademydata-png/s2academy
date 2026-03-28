import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Student } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface StudentCardProps {
  student: Student;
  isLoggedIn?: boolean;
  onUpdateSuccess?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const StudentCard = ({ 
  student, 
  isLoggedIn, 
  onUpdateSuccess, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}: StudentCardProps) => {
  const { toast } = useToast();
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {student.image_url ? (
            <div className="overflow-hidden rounded-lg">
              <img 
                src={student.image_url} 
                alt={student.name}
                className="w-40 h-40 md:w-48 md:h-48 rounded-lg object-cover border-4 border-accent transition-transform duration-300 hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2 transition-colors duration-200 hover:text-accent">{student.name}</h3>
            <p className="text-sm md:text-base text-muted-foreground">{student.college}</p>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-3 pt-4 mt-2 border-t w-full justify-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Position</span>
              <div className="flex bg-muted rounded-md p-1 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMoveUp}
                  disabled={isFirst}
                  className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMoveDown}
                  disabled={isLast}
                  className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
