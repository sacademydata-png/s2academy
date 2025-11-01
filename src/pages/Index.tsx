import { useState, useEffect } from "react";
import Header from "@/components/Header";
import YearSidebar from "@/components/YearSidebar";
import StudentCard from "@/components/StudentCard";
import LoginDialog from "@/components/LoginDialog";
import AddDataDialog from "@/components/AddDataDialog";
import RemoveDataDialog from "@/components/RemoveDataDialog";
import { Button } from "@/components/ui/button";
import { supabase, type Student } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [removeDataOpen, setRemoveDataOpen] = useState(false);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('year', selectedYear)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch students",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedYear]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleDataChange = () => {
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      {isLoggedIn && (
        <div className="bg-card border-b border-border py-3 px-4">
          <div className="container mx-auto flex gap-2 justify-center">
            <Button onClick={() => setAddDataOpen(true)} variant="default" size="sm">
              Add Data
            </Button>
            <Button onClick={() => setRemoveDataOpen(true)} variant="outline" size="sm">
              Remove Data
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1">
        <YearSidebar
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          years={YEARS}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">
                NEET {selectedYear} Results
              </h1>
              <p className="text-muted-foreground">
                Celebrating our students' outstanding achievements in medical entrance exams
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found for NEET {selectedYear}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={handleLogin}
      />

      <AddDataDialog
        open={addDataOpen}
        onOpenChange={setAddDataOpen}
        onSuccess={handleDataChange}
        years={YEARS}
      />

      <RemoveDataDialog
        open={removeDataOpen}
        onOpenChange={setRemoveDataOpen}
        onSuccess={handleDataChange}
        years={YEARS}
      />
    </div>
  );
};

export default Index;
