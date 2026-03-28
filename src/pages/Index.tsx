import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import YearSidebar from "@/components/YearSidebar";
import StudentCard from "@/components/StudentCard";
import LoginDialog from "@/components/LoginDialog";
import AddDataDialog from "@/components/AddDataDialog";
import RemoveDataDialog from "@/components/RemoveDataDialog";
import { Button } from "@/components/ui/button";
import { supabase, type Student } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Persist login across refreshes via Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const examType = (searchParams.get("type") as 'neet' | 'jee') || 'neet';
  const selectedYear = Number(searchParams.get("year")) || 2025;

  const [years, setYears] = useState<number[]>(DEFAULT_YEARS);
  const [jeeHasYears, setJeeHasYears] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [removeDataOpen, setRemoveDataOpen] = useState(false);
  // Persist sort preferences per exam type across page reloads
  const getSortStorageKey = (exam: string) => `s2academy_sort_${exam}`;

  const loadSortFromStorage = (exam: string): Record<number, 'created_at' | 'position'> => {
    try {
      const raw = localStorage.getItem(getSortStorageKey(exam));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const [sortByYear, setSortByYear] = useState<Record<number, 'created_at' | 'position'>>(
    () => loadSortFromStorage(examType)
  );
  const { toast } = useToast();
  // Ref to suppress the auto-fetch triggered by setSortFor inside moveStudent
  const skipNextFetchRef = useRef(false);

  // Reload sort preferences when exam type changes
  useEffect(() => {
    setSortByYear(loadSortFromStorage(examType));
  }, [examType]);

  const setExamType = (type: 'neet' | 'jee') => {
    setSearchParams(prev => {
      prev.set("type", type);
      return prev;
    });
  };

  const setSelectedYear = (year: number) => {
    setSearchParams(prev => {
      prev.set("year", year.toString());
      return prev;
    });
  };

  const getSortFor = (year: number) => sortByYear[year] ?? 'created_at';
  const setSortFor = (year: number, sort: 'created_at' | 'position') => {
    setSortByYear(prev => {
      const updated = { ...prev, [year]: sort };
      // Persist to localStorage so it survives page reloads
      try {
        localStorage.setItem(getSortStorageKey(examType), JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const fetchStudents = async (sortOverride?: 'created_at' | 'position') => {
    const currentSort = sortOverride ?? getSortFor(selectedYear);
    const tableName = examType === 'neet' ? 'students' : 'jee_students';
    try {
      setLoading(true);
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('year', selectedYear);

      if (currentSort === 'position') {
        query = query
          .order('position', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

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
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    fetchStudents();
  }, [selectedYear, sortByYear, examType]);

  // Load years from dedicated exam_years table
  useEffect(() => {
    const loadYearsFromSupabase = async () => {
      const { data, error } = await supabase
        .from('exam_years')
        .select('year')
        .eq('exam_type', examType)
        .order('year', { ascending: false });

      if (!error && data) {
        const loaded = data.map(d => d.year);
        setYears(loaded);
        // Maintain current selected year if it's in the list of available years for this exam type
        if (loaded.length > 0 && !loaded.includes(selectedYear)) {
          setSelectedYear(loaded[0]);
        }
      }
    };
    loadYearsFromSupabase();
  }, [examType]);

  // Check once on mount whether JEE has any years (to control tab visibility for guests)
  useEffect(() => {
    const checkJeeYears = async () => {
      const { data } = await supabase
        .from('exam_years')
        .select('year')
        .eq('exam_type', 'jee')
        .limit(1);
      setJeeHasYears(!!(data && data.length > 0));
    };
    checkJeeYears();
  }, []);

  const handleLogin = () => {
    // Session is handled by onAuthStateChange above
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleDataChange = () => {
    fetchStudents();
  };

  const handleAddYear = async (yearValue: number) => {
    // Add locally for speed
    const updated = [yearValue, ...years].filter((y, i, arr) => arr.indexOf(y) === i).sort((a, b) => b - a);
    setYears(updated);
    setSelectedYear(yearValue);
    if (examType === 'jee') setJeeHasYears(true);

    // Save to dedicated table
    await supabase.from('exam_years').insert({ year: yearValue, exam_type: examType });
  };

  const handleDeleteYear = async (yearValue: number) => {
    // Remove locally for speed
    const updated = years.filter(y => y !== yearValue);
    setYears(updated);
    if (examType === 'jee' && updated.length === 0) setJeeHasYears(false);
    if (yearValue === selectedYear && updated.length > 0) {
      setSelectedYear(updated[0]);
    }
    
    // Remove from dedicated table
    await supabase.from('exam_years').delete().match({ year: yearValue, exam_type: examType });
  };

  const moveStudent = async (studentId: string, direction: 'up' | 'down') => {
    const currentIndex = students.findIndex(s => s.id === studentId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= students.length) return;

    // Swap in local array
    const newStudents = [...students];
    const temp = newStudents[currentIndex];
    newStudents[currentIndex] = newStudents[targetIndex];
    newStudents[targetIndex] = temp;

    // If we need to switch to position sort mode, suppress the auto-fetch
    // it would trigger — we already have the correct optimistic state.
    if (getSortFor(selectedYear) !== 'position') {
      skipNextFetchRef.current = true;
      setSortFor(selectedYear, 'position');
    }

    // Optimistic update immediately (no flicker)
    setStudents(newStudents);

    const tableName = examType === 'neet' ? 'students' : 'jee_students';

    // Reassign ALL students sequential positions (1, 2, 3...) based on new order.
    // This completely avoids null/duplicate position bugs — every student always
    // gets a clean, unique position number after every move.
    const updates = newStudents.map((student, index) =>
      supabase
        .from(tableName)
        .update({ position: index + 1 })
        .eq('id', student.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);

    if (failed?.error) {
      toast({
        variant: "destructive",
        title: "Error moving student",
        description: failed.error.message,
      });
      // Rollback to server state on error
      skipNextFetchRef.current = false;
      await fetchStudents();
    }
    // No re-fetch on success — our optimistic state IS the correct state.
    // The DB now matches. The next natural navigation will load fresh data.
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Show tab bar: always show NEET. Only show JEE tab if logged in OR jee has years */}
      {(isLoggedIn || jeeHasYears) && (
        <div className="bg-card border-b border-border">
            <div className="container mx-auto px-4 flex justify-center">
              <div className="flex bg-muted/50 p-1 rounded-lg my-3">
                <button
                  onClick={() => setExamType('neet')}
                  className={`px-8 py-2 text-sm font-semibold rounded-md transition-all ${
                    examType === 'neet'
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  NEET
                </button>
                {(isLoggedIn || jeeHasYears) && (
                  <button
                    onClick={() => setExamType('jee')}
                    className={`px-8 py-2 text-sm font-semibold rounded-md transition-all ${
                      examType === 'jee'
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    JEE
                  </button>
                )}
              </div>
            </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="bg-card border-b border-border py-3 px-4">
          <div className="container mx-auto flex gap-2 justify-center">
            <Button onClick={() => setAddDataOpen(true)} variant="default" size="sm">
              Add Data
            </Button>
            <Button onClick={() => setRemoveDataOpen(true)} variant="outline" size="sm">
              Remove Data
            </Button>
            <div className="flex items-center gap-2 border-l pl-2 ml-2">
              <span className="text-xs font-semibold">Sort:</span>
              <Button 
                onClick={() => setSortFor(selectedYear, 'created_at')} 
                variant={getSortFor(selectedYear) === 'created_at' ? "default" : "outline"} 
                size="sm"
              >
                Date
              </Button>
              <Button 
                onClick={() => setSortFor(selectedYear, 'position')} 
                variant={getSortFor(selectedYear) === 'position' ? "default" : "outline"} 
                size="sm"
              >
                Position
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1">
        <YearSidebar
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          years={years}
          isLoggedIn={isLoggedIn}
          onAddYear={handleAddYear}
          onDeleteYear={handleDeleteYear}
          examType={examType}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">
                {examType.toUpperCase()} {selectedYear} Results
              </h1>
              <p className="text-muted-foreground">
                Celebrating our students' outstanding achievements in {examType === 'neet' ? 'medical' : 'engineering'} entrance exams
              </p>
            </div>

            {years.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground italic">No years added for {examType.toUpperCase()} yet. Click "+ Add Year" in the sidebar to create your first folder!</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found for {examType.toUpperCase()} {selectedYear}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {students.map((student, index) => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    isLoggedIn={isLoggedIn}
                    onUpdateSuccess={handleDataChange}
                    onMoveUp={() => moveStudent(student.id, 'up')}
                    onMoveDown={() => moveStudent(student.id, 'down')}
                    isFirst={index === 0}
                    isLast={index === students.length - 1}
                  />
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
        years={years}
        examType={examType}
      />

      <RemoveDataDialog
        open={removeDataOpen}
        onOpenChange={setRemoveDataOpen}
        onSuccess={handleDataChange}
        years={years}
        examType={examType}
      />
    </div>
  );
};

export default Index;
