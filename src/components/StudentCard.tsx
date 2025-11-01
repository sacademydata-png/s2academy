import { GraduationCap, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Student } from "@/lib/supabase";

interface StudentCardProps {
  student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {student.image_url ? (
            <img 
              src={student.image_url} 
              alt={student.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border-4 border-accent"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-muted flex items-center justify-center">
              <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{student.name}</h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <p className="text-sm md:text-base">{student.college}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
