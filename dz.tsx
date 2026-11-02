import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Calculator,
  Compass,
  Award,
  BookOpen,
  HelpCircle,
  Share2,
  Printer,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Sliders,
  Info,
  Copy,
  Trash2,
  FileText
} from 'lucide-react';

// ==========================================
// 1. DATA & OFFICIAL RULES REPOSITORY (2026/2027)
// ==========================================

export const EDUCATION_STAGES = [
  { id: 'middle', name: 'التعليم المتوسط (BEM)', icon: 'GraduationCap' },
  { id: 'secondary', name: 'التعليم الثانوي (BAC)', icon: 'Award' },
  { id: 'primary', name: 'التعليم الابتدائي', icon: 'BookOpen' },
  { id: 'university', name: 'التعليم العالي (LMD)', icon: 'Compass' }
];

export const MIDDLE_GRADES = [
  { id: '1am', name: 'السنة الأولى متوسط (1AM)' },
  { id: '2am', name: 'السنة الثانية متوسط (2AM)' },
  { id: '3am', name: 'السنة الثالثة متوسط (3AM)' },
  { id: '4am', name: 'السنة الرابعة متوسط (4AM - شهادة BEM)' }
];

export const SECONDARY_STREAMS = [
  { id: '1as_tcst', name: '1 ثانوي - جذع مشترك علوم وتكنولوجيا' },
  { id: '1as_tcl', name: '1 ثانوي - جذع مشترك آداب' },
  { id: '2as_se', name: '2 ثانوي - شعبة علوم تجريبية' },
  { id: '2as_m', name: '2 ثانوي - شعبة رياضيات' },
  { id: '2as_tm', name: '2 ثانوي - شعبة تقني رياضي' },
  { id: '2as_ge', name: '2 ثانوي - شعبة تسيير واقتصاد' },
  { id: '2as_lp', name: '2 ثانوي - شعبة لغات أجنبية' },
  { id: '2as_lph', name: '2 ثانوي - شعبة آداب وفلسفة' },
  { id: '3as_se', name: '3 ثانوي (بكالوريا) - علوم تجريبية' },
  { id: '3as_m', name: '3 ثانوي (بكالوريا) - رياضيات' },
  { id: '3as_lph', name: '3 ثانوي (بكالوريا) - آداب وفلسفة' }
];

// Base subjects config for Middle School (Standard 4AM / Middle)
const DEFAULT_MIDDLE_SUBJECTS = [
  { id: 'ar', name: 'اللغة العربية', coeff: 5, hasContinuous: true, hasTest2: false },
  { id: 'fr', name: 'اللغة الفرنسية', coeff: 3, hasContinuous: true, hasTest2: false },
  { id: 'en', name: 'اللغة الإنجليزية', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'math', name: 'الرياضيات', coeff: 4, hasContinuous: true, hasTest2: false },
  { id: 'sn', name: 'علوم الطبيعة والحياة', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'pc', name: 'العلوم الفيزيائية والتكنولوجيا', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'is', name: 'التربية الإسلامية', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'civ', name: 'التربية المدنية', coeff: 1, hasContinuous: true, hasTest2: false },
  { id: 'hg', name: 'التاريخ والجغرافيا', coeff: 3, hasContinuous: true, hasTest2: false },
  { id: 'eps', name: 'التربية البدنية والرياضية', coeff: 1, hasContinuous: false, hasTest2: false, isExamOnly: true },
  { id: 'art', name: 'التربية الفنية / الموسيقية', coeff: 1, hasContinuous: false, hasTest2: false, isExamOnly: true },
  { id: 'amz', name: 'اللغة الأمازيغية (اختياري)', coeff: 2, hasContinuous: true, hasTest2: false, isOptional: true }
];

// Base subjects config for High School (Scientific 3AS BAC sample)
const DEFAULT_SECONDARY_SUBJECTS = [
  { id: 'math', name: 'الرياضيات', coeff: 5, hasContinuous: true, hasTest2: false },
  { id: 'sn', name: 'علوم الطبيعة والحياة', coeff: 6, hasContinuous: true, hasTest2: false },
  { id: 'pc', name: 'العلوم الفيزيائية', coeff: 5, hasContinuous: true, hasTest2: false },
  { id: 'ar', name: 'اللغة العربية وآدابها', coeff: 3, hasContinuous: true, hasTest2: false },
  { id: 'fr', name: 'اللغة الفرنسية', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'en', name: 'اللغة الإنجليزية', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'phil', name: 'الفلسفة', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'is', name: 'التربية الإسلامية', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'hg', name: 'التاريخ والجغرافيا', coeff: 2, hasContinuous: true, hasTest2: false },
  { id: 'eps', name: 'التربية البدنية والرياضية', coeff: 1, hasContinuous: false, hasTest2: false, isExamOnly: true }
];

// University default semester modules template
const DEFAULT_UNIVERSITY_MODULES = [
  { id: 'm1', name: 'مقياس 1 (محاضرة + أعمال موجهة TD)', coeff: 3, credits: 6, hasTd: true, tdWeight: 0.4 },
  { id: 'm2', name: 'مقياس 2 (محاضرة + أعمال تطبيقية TP)', coeff: 3, credits: 6, hasTd: true, tdWeight: 0.4 },
  { id: 'm3', name: 'مقياس 3 (أساسي)', coeff: 2, credits: 4, hasTd: true, tdWeight: 0.33 },
  { id: 'm4', name: 'مقياس 4 (استكشافي / لغات)', coeff: 1, credits: 2, hasTd: false, tdWeight: 0 },
  { id: 'm5', name: 'مقياس 5 (منهجي)', coeff: 2, credits: 4, hasTd: true, tdWeight: 0.4 }
];

// Official verification repository
const OFFICIAL_RULES_REGISTRY = [
  {
    stage: 'الطور المتوسط',
    rule: 'معدل المادة الفصلي = (التقويم المستمر + الفرض + الاختبار × 2) ÷ 4',
    source: 'المنشور الوزاري رقم 128 / وزراة التربية الوطنية الجزائرية',
    status: 'مؤكدة رسميًا',
    notes: 'يطبق على المواد الأساسية ذات الفرض الواحد. مادة التربية البدنية تعتمد على المراقبة أو الاختبار المباشر.'
  },
  {
    stage: 'الطور المتوسط والثانوي',
    rule: 'قاعدة الاستدراك: احتساب أفضل علامة بين السنوية والاستدراك للمادة',
    source: 'القرار الوزاري المنظم للامتحانات الاستدراكية بالجزائر',
    status: 'مؤكدة رسميًا',
    notes: 'يستفيد التلميذ من العلامة الأعلى في الدورة الاستدراكية وتُعوّض علامة المادة السنوية لإعادة حساب المعدل العام.'
  },
  {
    stage: 'الطور الثانوي',
    rule: 'المعدل الفصلي للمادة = (التقويم المستمر + الفرض + الاختبار × 2) ÷ 4 (أو بحسب المنشور الساري للثانوي)',
    source: 'دليل التقويم البيداغوجي للتعليم الثانوي 2024-2026',
    status: 'مؤكدة رسميًا',
    notes: 'المعاملات تختلف جذريًا حسب الشعبة وسنة الدراسة.'
  },
  {
    stage: 'التعليم العالي LMD',
    rule: 'التعويض السداسي والسنوي: النجاح بمعدل ≥ 10.00/20 مع استيفاء 30 رصيداً لكل سداسي',
    source: 'القرار رقم 712 و 713 لوزارة التعليم العالي والبحث العلمي',
    status: 'مؤكدة رسميًا',
    notes: 'في حال الاستدراك الجامعي (Rattrapage)، تُحتسب العلامة الأعلى بين الامتحان العادي والاستدراكي مع الاحتفاظ بنقطة الأعمال الموجهة TD.'
  }
];

// ==========================================
// 2. MATHEMATICAL CALCULATION ENGINE
// ==========================================

export const CalculationEngine = {
  // Clamp value between min & max safe bounds
  clampMark(val) {
    if (val === '' || val === null || val === undefined) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    if (num < 0) return 0;
    if (num > 20) return 20;
    return num;
  },

  // Calculate subject average for Middle School
  // Formula: ((Continuous || 0) + (Test1 || 0) + (Exam * 2)) / 4
  // If exam-only: directly exam
  calculateMiddleSubjectAvg(continuous, test1, exam, isExamOnly = false) {
    const c = parseFloat(continuous) || 0;
    const t = parseFloat(test1) || 0;
    const e = parseFloat(exam) || 0;

    if (isExamOnly) {
      return parseFloat(e.toFixed(2));
    }
    const total = (c + t + (e * 2)) / 4;
    return parseFloat(total.toFixed(2));
  },

  // University Module Average: Exam * (1 - tdWeight) + TD * tdWeight
  calculateUniModuleAvg(tdMark, examMark, hasTd = true, tdWeight = 0.4) {
    const exam = parseFloat(examMark) || 0;
    if (!hasTd) return parseFloat(exam.toFixed(2));
    const td = parseFloat(tdMark) || 0;
    const finalScore = (exam * (1 - tdWeight)) + (td * tdWeight);
    return parseFloat(finalScore.toFixed(2));
  },

  // Calculate Term / Semester Overall Weighted Average
  calculateTermAverage(subjectsWithAverages) {
    let totalWeighted = 0;
    let totalCoeffs = 0;

    subjectsWithAverages.forEach(sub => {
      if (sub.avg !== null && sub.avg !== undefined && !isNaN(sub.avg)) {
        const coeff = parseFloat(sub.coeff) || 1;
        totalWeighted += sub.avg * coeff;
        totalCoeffs += coeff;
      }
    });

    if (totalCoeffs === 0) return 0;
    return parseFloat((totalWeighted / totalCoeffs).toFixed(2));
  },

  // Resit Engine for Middle/High School:
  // Replaces subject's annual mark with MAX(original, resitMark)
  calculateResitAverage(subjects) {
    let totalWeighted = 0;
    let totalCoeffs = 0;
    let upgradedCount = 0;

    const updatedSubjects = subjects.map(s => {
      const orig = parseFloat(s.origMark) || 0;
      const resit = s.resitMark !== '' && s.resitMark !== undefined ? (parseFloat(s.resitMark) || 0) : null;
      
      let effectiveMark = orig;
      let isUpgraded = false;

      if (resit !== null && resit > orig) {
        effectiveMark = resit;
        isUpgraded = true;
        upgradedCount++;
      }

      const coeff = parseFloat(s.coeff) || 1;
      totalWeighted += effectiveMark * coeff;
      totalCoeffs += coeff;

      return {
        ...s,
        effectiveMark,
        isUpgraded
      };
    });

    const newAvg = totalCoeffs > 0 ? parseFloat((totalWeighted / totalCoeffs).toFixed(2)) : 0;
    return {
      newAverage: newAvg,
      isPassed: newAvg >= 10.00,
      totalWeighted,
      totalCoeffs,
      upgradedCount,
      updatedSubjects
    };
  },

  // Goal Calculator (Inverse solver)
  // Find needed exam score in a subject to reach desired overall term average
  calculateNeededExamScore(subjects, targetSubjectId, desiredTermAvg) {
    let otherWeighted = 0;
    let totalCoeffs = 0;
    let targetSub = null;

    subjects.forEach(sub => {
      const coeff = parseFloat(sub.coeff) || 1;
      totalCoeffs += coeff;

      if (sub.id === targetSubjectId) {
        targetSub = sub;
      } else {
        const avg = parseFloat(sub.avg) || 0;
        otherWeighted += avg * coeff;
      }
    });

    if (!targetSub) return null;

    const targetCoeff = parseFloat(targetSub.coeff) || 1;
    // targetAvg = (otherWeighted + targetSubAvg * targetCoeff) / totalCoeffs
    // targetSubAvg = (desiredTermAvg * totalCoeffs - otherWeighted) / targetCoeff
    const requiredSubjectAvg = (desiredTermAvg * totalCoeffs - otherWeighted) / targetCoeff;

    if (targetSub.isExamOnly) {
      return {
        requiredSubjectAvg: parseFloat(requiredSubjectAvg.toFixed(2)),
        requiredExamScore: parseFloat(requiredSubjectAvg.toFixed(2)),
        isPossible: requiredSubjectAvg >= 0 && requiredSubjectAvg <= 20
      };
    }

    // Since subjectAvg = (Continuous + Test + Exam * 2) / 4
    // Exam * 2 = requiredSubjectAvg * 4 - Continuous - Test
    // Exam = (requiredSubjectAvg * 4 - Continuous - Test) / 2
    const c = parseFloat(targetSub.continuous) || 0;
    const t = parseFloat(targetSub.test1) || 0;
    const neededExam = (requiredSubjectAvg * 4 - c - t) / 2;

    return {
      requiredSubjectAvg: parseFloat(requiredSubjectAvg.toFixed(2)),
      requiredExamScore: parseFloat(neededExam.toFixed(2)),
      isPossible: neededExam >= 0 && neededExam <= 20,
      isExceeded: neededExam > 20,
      isAlreadySecured: neededExam <= 0
    };
  },

  // Honor appreciation generator
  getAppreciation(avg) {
    if (avg >= 18) return { label: 'ممتاز (تهنئة)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (avg >= 16) return { label: 'جيد جداً (لوحة شرف)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (avg >= 14) return { label: 'جيد (تشجيع)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (avg >= 12) return { label: 'قريب من الجيد', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (avg >= 10) return { label: 'مقبول (ناجح)', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (avg >= 9) return { label: 'معني بالاستدراك أو دراسة الحالة', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'راسب / استدراك حتمي', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  }
};

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'term' | 'resit' | 'goal' | 'university' | 'rules'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [savedHistory, setSavedHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('moadel_dz_history');
      if (stored) {
        setSavedHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, []);

  const saveResult = (title, details) => {
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-DZ'),
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      title,
      details
    };
    const updated = [newItem, ...savedHistory.slice(0, 9)];
    setSavedHistory(updated);
    try {
      localStorage.setItem('moadel_dz_history', JSON.stringify(updated));
      setSaveSuccessMsg('تم حفظ الحساب بنجاح في متصفحك!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (e) {
      console.error('Local storage full or disabled', e);
    }
  };

  const removeHistoryItem = (id) => {
    const filtered = savedHistory.filter(item => item.id !== id);
    setSavedHistory(filtered);
    localStorage.setItem('moadel_dz_history', JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between" dir="rtl">
      
      {/* Top Banner / Notice Bar */}
      <div className="bg-emerald-800 text-emerald-50 text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>الموسم الدراسي 2026/2027 — الحساب الرسمي المعتمد والمطابق لمناهج وزارة التربية والتعليم العالي</span>
          </div>
          <span className="font-semibold opacity-90 text-[11px] sm:text-xs bg-emerald-900/60 px-2 py-0.5 rounded">
            مجاني 100% دون تسجيل
          </span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer flex items-center gap-3 transition-transform hover:scale-[1.01]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-blue-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">معدل</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700">DZ</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                  2026/2027
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                احسب معدلك، اعرف فرصتك، واستعد للنجاح
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('resit')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'resit'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>حاسبة الاستدراك</span>
            </button>
            <button
              onClick={() => setActiveTab('term')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'term'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              المعدل الفصلي
            </button>
            <button
              onClick={() => setActiveTab('goal')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'goal'
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              العلامة المطلوبة
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'university'
                  ? 'bg-indigo-700 text-white shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              الجامعي LMD
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              دليل القواعد
            </button>
          </nav>
        </div>
      </header>

      {/* Global Notification Toast */}
      {saveSuccessMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Dynamic View Router */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} savedHistory={savedHistory} onRemoveHistory={removeHistoryItem} />}
        {activeTab === 'resit' && <ResitCalculatorView onSave={saveResult} />}
        {activeTab === 'term' && <TermCalculatorView onSave={saveResult} />}
        {activeTab === 'goal' && <GoalCalculatorView />}
        {activeTab === 'university' && <UniversityCalculatorView onSave={saveResult} />}
        {activeTab === 'rules' && <RulesGuideView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-12 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">
                  DZ
                </div>
                <span className="text-xl font-bold text-white">معدل DZ</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                المنصة الجزائرية المستقلة الأولى لحساب معدلات الفصول والاستدراك للطور الابتدائي، المتوسط، الثانوي والجامعي لموسم 2026/2027. نتائج موثقة ومطابقة لمناشير وزارة التربية الوطنية.
              </p>
              <div className="mt-4 text-xs text-amber-400 flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 max-w-md">
                <Info className="w-4 h-4 shrink-0" />
                <span>ملاحظة: هذا التطبيق أداة حساب تقديرية ودقيقة للمساعدة المدرسية، ولا يُعتبر وثيقة أو شهادة نجاح رسمية.</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">الحاسبات السريعة</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab('resit')} className="hover:text-emerald-400 transition">حاسبة الاستدراك في الجزائر 2026/2027</button></li>
                <li><button onClick={() => setActiveTab('term')} className="hover:text-emerald-400 transition">حساب معدل شهادة التعليم المتوسط BEM</button></li>
                <li><button onClick={() => setActiveTab('term')} className="hover:text-emerald-400 transition">حاسبة معدل البكالوريا BAC</button></li>
                <li><button onClick={() => setActiveTab('university')} className="hover:text-emerald-400 transition">حاسبة الاستدراك الجامعي LMD</button></li>
                <li><button onClick={() => setActiveTab('goal')} className="hover:text-emerald-400 transition">كم أحتاج للنجاح في الامتحان؟</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">الشفافية والقواعد</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab('rules')} className="hover:text-emerald-400 transition">دليل القواعد والمناشير الوزارية</button></li>
                <li className="text-slate-500">سياسة الخصوصية (لا نجمع أي بيانات سرية)</li>
                <li className="text-slate-500">تحديثات المناهج 2026/2027</li>
                <li className="text-emerald-400 font-medium">العمليات الحسابية تتم محلياً 100%</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026/2027 معدل DZ — صُنع بكل فخر للطلبة والتلاميذ في الجزائر</p>
            <p className="text-slate-400">احسب معدلك، اعرف فرصتك، واستعد للنجاح</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 4. SUB-VIEWS IMPLEMENTATIONS
// ==========================================

// --- TAB 1: HOME VIEW ---
function HomeView({ onNavigate, savedHistory, onRemoveHistory }) {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (idx) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'كيف يُحسب معدل الاستدراك في التعليم المتوسط والثانوي؟',
      a: 'في النظام الجزائري، تُجرى الامتحانات الاستدراكية للمواد التي تحصّل فيها التلميذ على معدل سنوي يقل عن 10/20. وفي حال كانت علامة الاستدراك أعلى من المعدل السنوي الأصلي للمادة، يتم استبدالها تلقائياً وإعادة حساب المعدل العام السنوي. إذا كان المعدل الجديد ≥ 10.00 يعتبر التلميذ ناجحاً ومنتقلاً إلى القسم الأعلى.'
    },
    {
      q: 'ما هي الطريقة الرسمية لحساب معدل المادة في المتوسط؟',
      a: 'تعتمد المدارس الجزائرية الرسمية الصيغة: (نقطة التقويم المستمر + نقطة الفرض + علامة الاختبار × 2) مقسومة على 4. بالنسبة للمواد التي تكتفي بالاختبار فقط كـ التربية البدنية أو التشكيلية، تُحتسب علامة الاختبار مباشرة.'
    },
    {
      q: 'هل تطبيق معدل DZ مجاني ولا يحتاج إلى اشتراك؟',
      a: 'نعم، التطبيق مجاني 100% لجميع التلاميذ والطلبة وأولياء الأمور بدون تسجيل، وتتم جميع الحسابات فورياً ودون أي انتظار أو بطء.'
    },
    {
      q: 'كيف يعمل نظام التعويض في الجامعة LMD؟',
      a: 'في النظام الجامعي LMD، يتم تعويض المقاييس داخل نفس الوحدة التعليمية وتُعوّض الوحدات فيما بينها خلال السداسي إذا كان المعدل السداسي العام 10.00/20 على الأقل، مما يمنح الطالب 30 رصيداً كاملاً (Crédits).'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-200 mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>الحاسبة الذكية الأولى لموسم 2026/2027</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            احسب معدلك، اعرف فرصتك، <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-white">
              واستعد للنجاح بكل ثقة
            </span>
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            معدل DZ هي المنصة الرقمية الأكثر دقة لمساعدة التلاميذ في الأطوار المتوسطة، الثانوية والجامعية على محاكاة معدلات الفصول، حساب علامات الاستدراك (Rattrapage)، وتحديد النقاط الضرورية للنجاح.
          </p>

          {/* Quick Level Launcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('resit')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 text-center transition flex flex-col items-center justify-center gap-1.5 group border border-amber-300"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span className="text-sm">حاسبة الاستدراك</span>
              <span className="text-[10px] text-slate-900 font-semibold opacity-90">الأكثر طلباً</span>
            </button>
            <button
              onClick={() => onNavigate('term')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold p-3.5 rounded-2xl border border-white/20 text-center transition flex flex-col items-center justify-center gap-1.5 group"
            >
              <GraduationCap className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm">المعدل الفصلي</span>
              <span className="text-[10px] text-emerald-200">متوسط وثانوي</span>
            </button>
            <button
              onClick={() => onNavigate('goal')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold p-3.5 rounded-2xl border border-white/20 text-center transition flex flex-col items-center justify-center gap-1.5 group"
            >
              <TrendingUp className="w-5 h-5 text-blue-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm">كم أحتاج للنجاح؟</span>
              <span className="text-[10px] text-blue-200">حاسبة الأهداف</span>
            </button>
            <button
              onClick={() => onNavigate('university')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold p-3.5 rounded-2xl border border-white/20 text-center transition flex flex-col items-center justify-center gap-1.5 group"
            >
              <Compass className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" />
              <span className="text-sm">الحاسبة الجامعية</span>
              <span className="text-[10px] text-purple-200">نظام LMD</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </section>

      {/* Featured Promo: The Resit Engine */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              خاص ومميز في معدل DZ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              أداة «خطتي للنجاح في الاستدراك 2026/2027»
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-2xl">
              هل اقترب موعد الامتحان الاستدراكي؟ لا تترك نتيجتك للصدفة! حدد فوراً المواد التي تحتاج لمضاعفة الجهد فيها، واكتشف العلامة الدقيقة في كل مادة لتحقيق معدل 10.00 والانتقال بنجاح.
            </p>
          </div>
          <button
            onClick={() => onNavigate('resit')}
            className="w-full md:w-auto shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-3"
          >
            <span>ابدأ محاكاة الاستدراك الآن</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </section>

      {/* Saved History Quick View (If available) */}
      {savedHistory.length > 0 && (
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800">الحسابات المحفوظة مؤخرًا على جهازك</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">تبقى محفوظة محلياً في متصفحك</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedHistory.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{item.date} - {item.time}</span>
                    <button
                      onClick={() => onRemoveHistory(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Educational & SEO Explanatory Guide */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-3xl mb-6">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-2 inline-block">
            دليل التلميذ الجزائري
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
            كيف يُحتسب المعدل الفصلي والسنوي في المنظومة التربوية الجزائرية؟
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            تعتمد وزارة التربية الوطنية الجزائرية نظام المراقبة المستمرة والاختبارات الفوقية لتقييم كفاءة التلميذ. يتكون المعدل الفصلي للمادة من مزيج متوازن بين أداء التلميذ في القسم (التقويم المستمر)، الفروض المحروسة، والاختبارات الفصلية التي تأخذ النصيب الأكبر (ضعف وزن الفرض).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">التقويم والفروض</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              علامة التقويم تشمل النشاط الصفي، الواجبات والسلوك، مع فرض كتابي رسمي واحد لمعظم المواد، أو فرضين لبعض المواد الأساسية في الثانوي.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">الاختبار الفصلي</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              يُجرى في نهاية كل فصل وتُضرب علامته في 2، ليُحسب معدل المادة بقسمة المجموع على 4 (أو 5 في حال وجود فرضين).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">المعاملات المعتمدة</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              يُضرب معدل كل مادة في معاملها الرسمي الخاص بشعبتك أو مستواك، ثم تُقسم النتيجة على مجموع المعاملات لإخراج المعدل العام.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">الأسئلة الشائعة حول المعدلات والاستدراك</h2>
          <p className="text-xs sm:text-sm text-slate-600">إجابات واضحة وموثوقة استناداً إلى النصوص التنظيمية السارية</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-right p-4 sm:p-5 font-bold text-sm sm:text-base text-slate-800 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === index && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- TAB 2: TERM AVERAGE CALCULATOR (المعدل الفصلي) ---
function TermCalculatorView({ onSave }) {
  const [stage, setStage] = useState('middle');
  const [level, setLevel] = useState('4am');
  const [term, setTerm] = useState('1');
  const [subjects, setSubjects] = useState(() => 
    DEFAULT_MIDDLE_SUBJECTS.map(s => ({
      ...s,
      continuous: '',
      test1: '',
      test2: '',
      exam: ''
    }))
  );

  // Switch subjects when stage changes
  const handleStageChange = (newStage) => {
    setStage(newStage);
    if (newStage === 'middle') {
      setLevel('4am');
      setSubjects(DEFAULT_MIDDLE_SUBJECTS.map(s => ({ ...s, continuous: '', test1: '', test2: '', exam: '' })));
    } else if (newStage === 'secondary') {
      setLevel('3as_se');
      setSubjects(DEFAULT_SECONDARY_SUBJECTS.map(s => ({ ...s, continuous: '', test1: '', test2: '', exam: '' })));
    } else {
      // Primary
      setLevel('5ap');
      setSubjects([
        { id: 'ar', name: 'اللغة العربية', coeff: 2, isExamOnly: true, exam: '' },
        { id: 'math', name: 'الرياضيات', coeff: 2, isExamOnly: true, exam: '' },
        { id: 'fr', name: 'اللغة الفرنسية', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'is', name: 'التربية الإسلامية', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'civ', name: 'التربية المدنية', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'sn', name: 'التربية العلمية والتكنولوجية', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'hg', name: 'التاريخ والجغرافيا', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'art', name: 'التربية الفنية', coeff: 1, isExamOnly: true, exam: '' },
        { id: 'eps', name: 'التربية البدنية', coeff: 1, isExamOnly: true, exam: '' }
      ]);
    }
  };

  const handleMarkChange = (id, field, val) => {
    const clamped = CalculationEngine.clampMark(val);
    setSubjects(prev => prev.map(sub => sub.id === id ? { ...sub, [field]: clamped } : sub));
  };

  const handleCoeffChange = (id, val) => {
    const c = Math.max(1, Math.min(10, parseInt(val) || 1));
    setSubjects(prev => prev.map(sub => sub.id === id ? { ...sub, coeff: c } : sub));
  };

  // Compute calculated subjects
  const subjectsWithCalculations = useMemo(() => {
    return subjects.map(sub => {
      let avg = 0;
      if (sub.isExamOnly) {
        avg = parseFloat(sub.exam) || 0;
      } else {
        avg = CalculationEngine.calculateMiddleSubjectAvg(sub.continuous, sub.test1, sub.exam, false);
      }
      return {
        ...sub,
        avg: parseFloat(avg.toFixed(2))
      };
    });
  }, [subjects]);

  // Overall term average
  const termAverage = useMemo(() => {
    return CalculationEngine.calculateTermAverage(subjectsWithCalculations);
  }, [subjectsWithCalculations]);

  const appreciation = CalculationEngine.getAppreciation(termAverage);

  const resetAllMarks = () => {
    setSubjects(prev => prev.map(s => ({ ...s, continuous: '', test1: '', test2: '', exam: '' })));
  };

  const triggerSave = () => {
    onSave(
      `المعدل الفصلي (${stage === 'middle' ? 'متوسط' : stage === 'secondary' ? 'ثانوي' : 'ابتدائي'}) - الفصل ${term}`,
      `المعدل العام المحسوب: ${termAverage.toFixed(2)}/20 — التقدير: ${appreciation.label}`
    );
  };

  const copyResultToClipboard = () => {
    const text = `معدلي الفصلي عبر معدل DZ (2026/2027): ${termAverage.toFixed(2)}/20 - التقدير: ${appreciation.label}. احسب معدلك الآن بدقة مجاناً.`;
    navigator.clipboard.writeText(text);
    alert('تم نسخ ملخص النتيجة إلى الحافظة!');
  };

  return (
    <div className="space-y-8">
      {/* Title & Stage Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              حاسبة المعدل الفصلي 2026/2027
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              أدخل علاماتك لمشاهدة معدل كل مادة والمعدل الفصلي الإجمالي الموزون بالمعاملات الرسمية.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={resetAllMarks}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تفريغ العلامات</span>
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* Phase selector pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => handleStageChange('middle')}
            className={`p-3.5 rounded-2xl font-bold text-sm text-center border transition ${
              stage === 'middle'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-700/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            الطور المتوسط (BEM)
          </button>
          <button
            onClick={() => handleStageChange('secondary')}
            className={`p-3.5 rounded-2xl font-bold text-sm text-center border transition ${
              stage === 'secondary'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-700/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            الطور الثانوي (BAC)
          </button>
          <button
            onClick={() => handleStageChange('primary')}
            className={`p-3.5 rounded-2xl font-bold text-sm text-center border transition ${
              stage === 'primary'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-700/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            الطور الابتدائي
          </button>
        </div>

        {/* Term and Level Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">المستوى أو الشعبة الدراسية</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {stage === 'middle' && MIDDLE_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              {stage === 'secondary' && SECONDARY_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              {stage === 'primary' && <option value="5ap">السنة الخامسة ابتدائي (5AP)</option>}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">الفصل الدراسي</label>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    term === t
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  الفصل {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Real-time Summary Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
            النتيجة الفورية الحسابية
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              {termAverage.toFixed(2)}
            </span>
            <span className="text-slate-400 text-lg font-bold">/ 20</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${appreciation.color}`}>
              {appreciation.label}
            </span>
            <span className="text-xs text-slate-400">
              (مجموع المعاملات: {subjectsWithCalculations.reduce((acc, s) => acc + (parseFloat(s.coeff) || 1), 0)})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={triggerSave}
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ النتيجة</span>
          </button>
          <button
            onClick={copyResultToClipboard}
            className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700"
          >
            <Copy className="w-4 h-4" />
            <span>نسخ النتيجة</span>
          </button>
        </div>
      </div>

      {/* Marks Input Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-black text-base text-slate-800">جدول المواد وعلامات المراقبة والاختبار</h2>
          <span className="text-xs text-slate-500 font-medium">العلامات المسموحة من 0 إلى 20</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 sm:p-4">المادة</th>
                <th className="p-3.5 sm:p-4 text-center w-24">المعامل</th>
                {!subjects[0]?.isExamOnly && (
                  <>
                    <th className="p-3.5 sm:p-4 text-center w-28">التقويم (20)</th>
                    <th className="p-3.5 sm:p-4 text-center w-28">الفرض (20)</th>
                  </>
                )}
                <th className="p-3.5 sm:p-4 text-center w-28">الاختبار (20)</th>
                <th className="p-3.5 sm:p-4 text-center w-28 bg-emerald-50 text-emerald-900 font-black">معدل المادة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectsWithCalculations.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 sm:p-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span>{sub.name}</span>
                      {sub.isOptional && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">اختياري</span>
                      )}
                    </div>
                  </td>

                  {/* Coeff input */}
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={sub.coeff}
                      onChange={(e) => handleCoeffChange(sub.id, e.target.value)}
                      className="w-14 text-center font-bold bg-slate-100 border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                    />
                  </td>

                  {/* Continuous assessment input */}
                  {!sub.isExamOnly && (
                    <>
                      <td className="p-2 sm:p-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="—"
                          value={sub.continuous}
                          onChange={(e) => handleMarkChange(sub.id, 'continuous', e.target.value)}
                          className="w-20 text-center font-semibold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Test 1 */}
                      <td className="p-2 sm:p-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="—"
                          value={sub.test1}
                          onChange={(e) => handleMarkChange(sub.id, 'test1', e.target.value)}
                          className="w-20 text-center font-semibold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>
                    </>
                  )}

                  {/* Exam mark */}
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={sub.exam}
                      onChange={(e) => handleMarkChange(sub.id, 'exam', e.target.value)}
                      className="w-20 text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    />
                  </td>

                  {/* Calculated subject average */}
                  <td className="p-3.5 sm:p-4 text-center font-black text-sm bg-emerald-50/50">
                    <span className={sub.avg >= 10 ? 'text-emerald-700' : 'text-rose-600'}>
                      {sub.avg > 0 ? sub.avg.toFixed(2) : '0.00'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- TAB 3: RESIT CALCULATOR (حاسبة الاستدراك 2026/2027) ---
function ResitCalculatorView({ onSave }) {
  const [levelType, setLevelType] = useState('middle'); // 'middle' | 'secondary'

  // Preload initial list of subjects with failing/borderline grades to showcase the resit mechanic
  const [subjects, setSubjects] = useState(() => {
    return [
      { id: 'math', name: 'الرياضيات', coeff: 4, origMark: 7.5, resitMark: 12 },
      { id: 'sn', name: 'علوم الطبيعة والحياة', coeff: 2, origMark: 8.0, resitMark: 11 },
      { id: 'pc', name: 'العلوم الفيزيائية والتكنولوجيا', coeff: 2, origMark: 6.5, resitMark: 10 },
      { id: 'fr', name: 'اللغة الفرنسية', coeff: 3, origMark: 8.5, resitMark: 9 },
      { id: 'ar', name: 'اللغة العربية', coeff: 5, origMark: 11.5, resitMark: '' },
      { id: 'hg', name: 'التاريخ والجغرافيا', coeff: 3, origMark: 10.5, resitMark: '' },
      { id: 'is', name: 'التربية الإسلامية', coeff: 2, origMark: 13.0, resitMark: '' },
      { id: 'civ', name: 'التربية المدنية', coeff: 1, origMark: 12.0, resitMark: '' },
      { id: 'eps', name: 'التربية البدنية والرياضية', coeff: 1, origMark: 15.0, resitMark: '' }
    ];
  });

  const handleResitMarkChange = (id, val) => {
    const clamped = CalculationEngine.clampMark(val);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, resitMark: clamped } : s));
  };

  const handleOrigMarkChange = (id, val) => {
    const clamped = CalculationEngine.clampMark(val);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, origMark: clamped } : s));
  };

  // Original annual average (before resit)
  const originalStats = useMemo(() => {
    let totalWeighted = 0;
    let totalCoeffs = 0;
    subjects.forEach(s => {
      const mark = parseFloat(s.origMark) || 0;
      const coeff = parseFloat(s.coeff) || 1;
      totalWeighted += mark * coeff;
      totalCoeffs += coeff;
    });
    const avg = totalCoeffs > 0 ? parseFloat((totalWeighted / totalCoeffs).toFixed(2)) : 0;
    return { avg, totalWeighted, totalCoeffs };
  }, [subjects]);

  // Recalculated state with Resit applied
  const resitResult = useMemo(() => {
    return CalculationEngine.calculateResitAverage(subjects);
  }, [subjects]);

  const difference = (resitResult.newAverage - originalStats.avg).toFixed(2);

  const triggerSave = () => {
    onSave(
      `حساب الاستدراك 2026/2027 (${levelType === 'middle' ? 'الطور المتوسط' : 'الطور الثانوي'})`,
      `المعدل السنوي الأصلي: ${originalStats.avg.toFixed(2)} ⬅ المعدل بعد الاستدراك: ${resitResult.newAverage.toFixed(2)}/20 (${resitResult.isPassed ? 'ناجح' : 'لم يستوف شرط 10/20'})`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>النظام المعتمد للاستدراك المدرسي في الجزائر 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3">
            حاسبة معدل الاستدراك في الجزائر
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            وفق المنشور الوزاري: في الامتحان الاستدراكي، تُحتسب تلقائياً أفضل علامة بين السنوية والاستدراكية لكل مادة معنية (<span className="font-mono font-bold bg-amber-900/40 px-1 rounded">MAX(العلامة الأصلية, علامة الاستدراك)</span>)، ويُعاد احتساب المعدل العام. إذا بلغ 10.00/20 تنتقل إلى القسم الأعلى رسمياً!
          </p>
        </div>
      </div>

      {/* Stage Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">الطور الدراسي:</span>
          <button
            onClick={() => setLevelType('middle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              levelType === 'middle' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الطور المتوسط
          </button>
          <button
            onClick={() => setLevelType('secondary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              levelType === 'secondary' ? 'bg-amber-600 text-white shadow' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الطور الثانوي
          </button>
        </div>

        <button
          onClick={triggerSave}
          className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>حفظ التقرير</span>
        </button>
      </div>

      {/* Comparison Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Original */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">المعدل السنوي الأصلي (قبل الاستدراك)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-700">{originalStats.avg.toFixed(2)}</span>
            <span className="text-slate-400 text-sm font-bold">/ 20</span>
          </div>
          <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>أقل من 10/20 (معني بالدورة الاستدراكية)</span>
          </div>
        </div>

        {/* New Resit Average */}
        <div className={`rounded-3xl p-5 border shadow-sm ${
          resitResult.isPassed 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <span className="text-xs font-bold opacity-80 block mb-1">المعدل الجديد المتوقع بعد الاستدراك</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black">{resitResult.newAverage.toFixed(2)}</span>
            <span className="opacity-70 text-sm font-bold">/ 20</span>
          </div>
          <div className="mt-2 text-xs font-bold flex items-center gap-1">
            {resitResult.isPassed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-black">مبروك! النتيجة تحقق شرط الانتقال والنجاح</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-amber-800">تحتاج إلى تحسين علامات المواد المعنية للوصول إلى 10.00</span>
              </>
            )}
          </div>
        </div>

        {/* Progress Boost */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">الزيادة في المعدل (فارق النقاط)</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl sm:text-4xl font-black ${parseFloat(difference) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {parseFloat(difference) > 0 ? `+${difference}` : '0.00'}
              </span>
              <span className="text-slate-400 text-xs font-bold">نقطة كاملة</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            تمت ترقية علامة {resitResult.upgradedCount} مواد استدراكية بنجاح.
          </p>
        </div>
      </div>

      {/* Interactive Resit Planner: "خطتي للنجاح في الاستدراك" */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <h2 className="font-black text-lg text-slate-900">أداة «محاكاة علامات الاستدراك المباشرة»</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              غيّر علامة الاستدراك المتوقعة وشاهد الأثر الفوري على المعدل العام لحظياً دون إعادة تحميل الصفحة.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 self-start sm:self-auto">
            تحديث تفاعلي فوري
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {subjects.map((sub) => {
            const isFailing = parseFloat(sub.origMark) < 10;
            const resitNum = parseFloat(sub.resitMark);
            const isImproved = !isNaN(resitNum) && resitNum > parseFloat(sub.origMark);

            return (
              <div key={sub.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Subject info */}
                <div className="w-full md:w-56 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{sub.name}</span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      معامل {sub.coeff}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <span>العلامة الأصلية:</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      value={sub.origMark}
                      onChange={(e) => handleOrigMarkChange(sub.id, e.target.value)}
                      className="w-16 font-bold text-center border border-slate-300 rounded px-1.5 py-0.5 text-xs bg-white"
                    />
                    {isFailing ? (
                      <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1 rounded">معنية بالاستدراك</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">فوق 10</span>
                    )}
                  </div>
                </div>

                {/* Slider / Quick simulation */}
                <div className="flex-1 max-w-md w-full">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>محاكاة علامة الاستدراك عبر شريط التمرير:</span>
                    <span className="font-black text-amber-700 font-mono text-sm">
                      {sub.resitMark !== '' ? sub.resitMark : '—'} / 20
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    disabled={!isFailing && sub.origMark >= 10}
                    value={sub.resitMark !== '' ? sub.resitMark : sub.origMark}
                    onChange={(e) => handleResitMarkChange(sub.id, e.target.value)}
                    className="w-full accent-amber-600 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>0</span>
                    <span>10 (عتبة النجاح)</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Direct Numeric Input & Impact Status */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">إدخال رقمي:</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={sub.resitMark}
                      onChange={(e) => handleResitMarkChange(sub.id, e.target.value)}
                      className="w-20 text-center font-bold bg-slate-50 border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>

                  <div className="w-28 text-left">
                    <span className="block text-[11px] text-slate-500 mb-1">الحالة:</span>
                    {isImproved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <TrendingUp className="w-3 h-3" />
                        <span>تحسّنت (+{(resitNum - parseFloat(sub.origMark)).toFixed(1)})</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">بدون تحسين</span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- TAB 4: GOAL / REVERSE CALCULATOR (العلامة المطلوبة للنجاح) ---
function GoalCalculatorView() {
  const [targetAvg, setTargetAvg] = useState(10.0);
  const [selectedSubjectId, setSelectedSubjectId] = useState('math');
  const [subjects, setSubjects] = useState(() => [
    { id: 'math', name: 'الرياضيات', coeff: 4, continuous: 9, test1: 8, exam: '', isExamOnly: false, avg: 0 },
    { id: 'ar', name: 'اللغة العربية', coeff: 5, continuous: 12, test1: 11, exam: 10, isExamOnly: false, avg: 10.75 },
    { id: 'fr', name: 'اللغة الفرنسية', coeff: 3, continuous: 10, test1: 9, exam: 8, isExamOnly: false, avg: 8.75 },
    { id: 'sn', name: 'العلوم الطبيعية', coeff: 2, continuous: 11, test1: 10, exam: 10, isExamOnly: false, avg: 10.25 },
    { id: 'pc', name: 'الفيزياء والتكنولوجيا', coeff: 2, continuous: 10, test1: 9, exam: 9, isExamOnly: false, avg: 9.25 },
    { id: 'hg', name: 'التاريخ والجغرافيا', coeff: 3, continuous: 13, test1: 12, exam: 11, isExamOnly: false, avg: 11.75 }
  ]);

  // Goal calculation logic
  const goalResult = useMemo(() => {
    return CalculationEngine.calculateNeededExamScore(subjects, selectedSubjectId, parseFloat(targetAvg) || 10.0);
  }, [subjects, selectedSubjectId, targetAvg]);

  const targetSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-md border border-blue-200 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>الحاسبة العكسية الذكية للأهداف</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            ما هي العلامة التي أحتاجها للنجاح؟
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            حدد معدلك المستهدف (مثل 10.00 للنجاح أو 15.00 للحصول على شهادة تقدير)، واختر المادة، وسيقوم المحرك الرياضي بحساب النقطة الدقيقة الواجب تحصيلها في الاختبار أو الاستدراك.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              المعدل العام المستهدف تحقيقه:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="9"
                max="20"
                value={targetAvg}
                onChange={(e) => setTargetAvg(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-slate-500">/ 20</span>
            </div>
            <div className="flex gap-2 mt-2">
              {[10.0, 12.0, 14.0, 16.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setTargetAvg(val)}
                  className="text-xs bg-white hover:bg-slate-200 border border-slate-300 font-bold px-2 py-1 rounded-lg text-slate-700 transition"
                >
                  {val}.00
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر المادة المراد حساب العلامة المطلوبة فيها:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} (معامل {s.coeff})</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-2">
              يعتمد الحساب على قاعدة: (تقويم + فرض + اختبار × 2) ÷ 4 الموزونة بالمعامل.
            </p>
          </div>
        </div>

        {/* Goal Result Output Banner */}
        {goalResult && (
          <div className="mt-6">
            {goalResult.isPossible ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    الهدف ممكن تحقيقه حسابياً!
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    تحتاج إلى علامة اختبار لا تقل عن:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    في مادة <strong className="text-slate-800">{targetSubject?.name}</strong> للوصول إلى معدل عام <strong className="text-emerald-700">{targetAvg}/20</strong>.
                  </p>
                </div>
                
                <div className="text-center bg-white px-6 py-4 rounded-2xl border border-emerald-200 shadow-sm shrink-0">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-700">
                    {goalResult.requiredExamScore.toFixed(2)}
                  </span>
                  <span className="text-xs block font-bold text-slate-500 mt-1">من 20 في الاختبار</span>
                </div>
              </div>
            ) : goalResult.isExceeded ? (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
                <XCircle className="w-8 h-8 text-rose-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-black text-rose-900 mb-1">
                    الهدف مستحيل حسابياً بالاعتماد على هذه المادة وحدها!
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
                    العلامة المطلوبة نظرياً هي <strong className="font-mono font-bold text-base">{goalResult.requiredExamScore.toFixed(2)} / 20</strong> وهي تتجاوز الحد الأقصى للنقاط (20/20).
                    للنجاح بهذا المعدل، يجب عليك أيضاً تحسين علامات المواد الأخرى ذات المعاملات المرتفعة.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-teal-50 border-2 border-teal-300 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-black text-teal-900 mb-1">
                    أنت بالفعل ضمن دائرة النجاح المستهدفة!
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-700 leading-relaxed">
                    حتى لو تحصّلت على علامة صفرية في هذا الاختبار، فإن مجموع درجاتك الحالية كافٍ لتجاوز معدل {targetAvg}/20. واصل جهودك للحصول على أعلى رتبة شرف ممكنة!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- TAB 5: UNIVERSITY CALCULATOR (الحاسبة الجامعية LMD) ---
function UniversityCalculatorView({ onSave }) {
  const [modules, setModules] = useState(DEFAULT_UNIVERSITY_MODULES);
  const [semester, setSemester] = useState('s1');

  const handleModuleChange = (id, field, val) => {
    const clamped = (field === 'exam' || field === 'td') ? CalculationEngine.clampMark(val) : val;
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: clamped } : m));
  };

  const addModule = () => {
    const newId = `m_${Date.now()}`;
    setModules(prev => [
      ...prev,
      { id: newId, name: `مقياس جديد ${prev.length + 1}`, coeff: 2, credits: 4, hasTd: true, tdWeight: 0.4, td: '', exam: '' }
    ]);
  };

  const removeModule = (id) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  // Calculate each module average and overall semester weighted avg
  const calculatedModules = useMemo(() => {
    return modules.map(m => {
      const avg = CalculationEngine.calculateUniModuleAvg(m.td, m.exam, m.hasTd, m.tdWeight || 0.4);
      return {
        ...m,
        avg
      };
    });
  }, [modules]);

  const semesterAverage = useMemo(() => {
    let totalWeighted = 0;
    let totalCoeffs = 0;
    calculatedModules.forEach(m => {
      const coeff = parseFloat(m.coeff) || 1;
      totalWeighted += m.avg * coeff;
      totalCoeffs += coeff;
    });
    return totalCoeffs > 0 ? parseFloat((totalWeighted / totalCoeffs).toFixed(2)) : 0;
  }, [calculatedModules]);

  // ECTS Credits calculated: If semester avg >= 10, all 30 credits acquired by compensation!
  const acquiredCredits = useMemo(() => {
    if (semesterAverage >= 10.00) {
      return 30; // Compensation rule
    }
    // Else only modules >= 10
    return calculatedModules.reduce((acc, m) => acc + (m.avg >= 10 ? (parseInt(m.credits) || 0) : 0), 0);
  }, [semesterAverage, calculatedModules]);

  const triggerSave = () => {
    onSave(
      `حساب السداسي الجامعي LMD (${semester.toUpperCase()})`,
      `المعدل السداسي: ${semesterAverage.toFixed(2)}/20 — الأرصدة المحققة: ${acquiredCredits}/30 (${semesterAverage >= 10 ? 'نجاح بالتعويض' : 'استدراك'})`
    );
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-md border border-indigo-200 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>نظام التعليم العالي الجزائري ليسانس / ماستر LMD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            حاسبة المعدل والأرصدة الجامعية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            حساب معدل المقاييس، تطبيق نسب الأعمال الموجهة TD والامتحان، والتحقق من شروط التعويض السداسي (Compensations).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addModule}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span>+ إضافة مقياس</span>
          </button>
          <button
            onClick={triggerSave}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* University Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">المعدل السداسي العام (Moyenne Semestrielle)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-indigo-900">{semesterAverage.toFixed(2)}</span>
            <span className="text-slate-400 text-sm font-bold">/ 20</span>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            {semesterAverage >= 10 ? 'ناجح ومستوفٍ للسداسي بموجب التعويض' : 'معني بامتحانات الدورة الاستدراكية (Rattrapage)'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">الأرصدة المكتسبة (Crédits ECTS)</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black ${acquiredCredits >= 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {acquiredCredits}
            </span>
            <span className="text-slate-400 text-sm font-bold">/ 30 رصيد</span>
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            {acquiredCredits >= 30 ? 'تم تحصيل كامل أرصدة السداسي (30/30)' : 'أرصدة المقاييس المحصلة فقط'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 block mb-1">قرار الانتقال والاستدراك</span>
          <div className="mt-1">
            {semesterAverage >= 10.00 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>السداسي مكتسب بالتعويض (Admis)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>دورة استدراكية للمقاييس غير المستوفاة</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">وفق القرارات 712 و 713 المنظمة لطور LMD.</p>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">اسم المقياس</th>
                <th className="p-4 text-center w-20">المعامل</th>
                <th className="p-4 text-center w-20">الأرصدة</th>
                <th className="p-4 text-center w-28">علامة TD/TP</th>
                <th className="p-4 text-center w-28">علامة الامتحان</th>
                <th className="p-4 text-center w-28 bg-indigo-50/60 text-indigo-900 font-black">معدل المقياس</th>
                <th className="p-4 text-center w-16">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculatedModules.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3 sm:p-4">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleModuleChange(m.id, 'name', e.target.value)}
                      className="w-full font-bold bg-transparent border-0 focus:ring-0 text-slate-900 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={m.coeff}
                      onChange={(e) => handleModuleChange(m.id, 'coeff', parseInt(e.target.value) || 1)}
                      className="w-14 text-center font-bold bg-slate-100 border border-slate-200 rounded-lg py-1 text-xs"
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={m.credits}
                      onChange={(e) => handleModuleChange(m.id, 'credits', parseInt(e.target.value) || 1)}
                      className="w-14 text-center font-bold bg-slate-100 border border-slate-200 rounded-lg py-1 text-xs"
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={m.td || ''}
                      onChange={(e) => handleModuleChange(m.id, 'td', e.target.value)}
                      className="w-20 text-center font-semibold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      placeholder="—"
                      value={m.exam || ''}
                      onChange={(e) => handleModuleChange(m.id, 'exam', e.target.value)}
                      className="w-20 text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-3 sm:p-4 text-center font-black bg-indigo-50/40">
                    <span className={m.avg >= 10 ? 'text-emerald-700' : 'text-rose-600'}>
                      {m.avg > 0 ? m.avg.toFixed(2) : '0.00'}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <button
                      onClick={() => removeModule(m.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="حذف المقياس"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- TAB 6: RULES & OFFICIAL VERIFICATION GUIDE ---
function RulesGuideView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md border border-slate-300 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>الشفافية والمصادر الرسمية 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            سجل القواعد والقرارات الوزارية المعتمدة
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            في «معدل DZ» لا نعتمد على حسابات عشوائية أو تخمينية. جميع المعادلات والمعاملات مستندة مباشرة إلى النصوص التنظيمية لوزارة التربية الوطنية ووزارة التعليم العالي الجزائرية.
          </p>
        </div>

        <div className="space-y-4">
          {OFFICIAL_RULES_REGISTRY.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black text-sm text-slate-900">{item.stage}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.status}</span>
                </span>
              </div>
              <p className="font-mono font-bold text-xs sm:text-sm text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                {item.rule}
              </p>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <p><strong>المصدر الرسمي:</strong> {item.source}</p>
                <p className="text-slate-500"><strong>ملاحظات التطبيق:</strong> {item.notes}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong>تنويه قانوني وتربوي:</strong> نتائج هذا الموقع مخصصة للمحاكاة والمتابعة الذاتية للتلاميذ وأوليائهم. القرار النهائي الخاص بالانتقال الرسمي أو التوجيه المدرسي يعود حصرياً لمجالس الأقسام وإدارات المؤسسات التعليمية الجزائرية وفق كشوف النقاط الرسمية المسلّمة.
          </div>
        </div>
      </div>
    </div>
  );
}