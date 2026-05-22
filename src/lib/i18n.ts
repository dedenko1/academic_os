// ============================================
// Academic OS — i18n Translation System
// Supports: English (en) & Bahasa Indonesia (id)
// ============================================

export type Locale = 'en' | 'id';

const translations = {
  // ─── App Shell / Navigation ───
  appName: { en: 'Academic OS', id: 'Academic OS' },
  tabFocus: { en: 'Focus', id: 'Fokus' },
  tabTasks: { en: 'Tasks', id: 'Tugas' },
  tabWellness: { en: 'Wellness', id: 'Kesehatan' },
  burnoutBadge: { en: 'Burnout', id: 'Burnout' },

  // ─── Home Page ───
  greetingMorning: { en: 'Good morning', id: 'Selamat pagi' },
  greetingAfternoon: { en: 'Good afternoon', id: 'Selamat siang' },
  greetingEvening: { en: 'Good evening', id: 'Selamat sore' },
  greetingLateNight: { en: 'Late night', id: 'Sudah larut' },

  timeCtxLateNight: {
    en: "It's late. Consider light tasks only or getting some rest.",
    id: 'Sudah larut malam. Pilih tugas ringan saja atau istirahat.',
  },
  timeCtxEarlyMorning: {
    en: 'Fresh morning energy. Great time for challenging work.',
    id: 'Energi pagi yang segar. Waktu tepat untuk tugas berat.',
  },
  timeCtxPeakFocus: {
    en: 'Peak focus hours. Tackle your hardest task.',
    id: 'Jam fokus tertinggi. Kerjakan tugas tersulit kamu.',
  },
  timeCtxPostLunch: {
    en: 'Post-lunch dip ahead. Start wrapping up deep work.',
    id: 'Sebentar lagi ngantuk setelah makan siang. Selesaikan pekerjaan berat.',
  },
  timeCtxAfternoon: {
    en: 'Afternoon focus window. Good for steady progress.',
    id: 'Waktu fokus sore. Bagus untuk progres stabil.',
  },
  timeCtxEvening: {
    en: 'Evening study block. Balance difficulty with energy.',
    id: 'Sesi belajar malam. Seimbangkan kesulitan dengan energi.',
  },
  timeCtxWindDown: {
    en: 'Wind down. Stick to light review or planning.',
    id: 'Waktunya santai. Lakukan review ringan atau perencanaan.',
  },

  doThisNow: { en: 'Do This Now', id: 'Kerjakan Sekarang' },
  takeABreak: { en: 'Take a Break', id: 'Istirahat Dulu' },
  allClear: { en: 'All Clear', id: 'Semua Beres' },
  startWorking: { en: 'Start Working', id: 'Mulai Kerja' },
  markComplete: { en: '✓ Mark Complete', id: '✓ Selesai' },
  pause: { en: 'Pause', id: 'Jeda' },

  howsYourEnergy: { en: "How's your energy?", id: 'Bagaimana energi kamu?' },
  energyExhausted: { en: 'Exhausted', id: 'Capek' },
  energyLow: { en: 'Low', id: 'Rendah' },
  energyOkay: { en: 'Okay', id: 'Cukup' },
  energyGood: { en: 'Good', id: 'Baik' },
  energyEnergized: { en: 'Energized', id: 'Semangat' },

  availableTime: { en: 'Available time', id: 'Waktu tersedia' },

  todaysFocus: { en: "Today's Focus", id: 'Fokus Hari Ini' },
  slots: { en: 'slots', id: 'slot' },
  noFocusTasks: {
    en: 'No focus tasks set. Add up to 3 from the Tasks tab.',
    id: 'Belum ada tugas fokus. Tambahkan hingga 3 dari tab Tugas.',
  },

  burnoutRisk: { en: 'Burnout Risk', id: 'Risiko Burnout' },

  // ─── Recommendation Engine Messages ───
  recBreakMsg: {
    en: 'Take a 15-minute break. Walk, stretch, or rest your eyes.',
    id: 'Istirahat 15 menit. Jalan-jalan, peregangan, atau istirahatkan mata.',
  },
  recBreakReason: {
    en: (score: number) => `Your burnout risk is high (${score}/100). Recovery is more productive than pushing through.`,
    id: (score: number) => `Risiko burnout kamu tinggi (${score}/100). Pemulihan lebih produktif daripada memaksakan diri.`,
  },
  recAllClearMsg: {
    en: "You're all caught up! No pending tasks right now.",
    id: 'Semua tugas sudah beres! Tidak ada tugas tertunda.',
  },
  recAllClearReason: {
    en: 'Consider reviewing upcoming material or taking a well-deserved break.',
    id: 'Coba review materi mendatang atau ambil istirahat yang layak.',
  },
  recNoMatchMsg: {
    en: 'No tasks match your current energy and available time.',
    id: 'Tidak ada tugas yang cocok dengan energi dan waktu kamu saat ini.',
  },
  recNoMatchLowEnergy: {
    en: 'Your energy is low. Consider a short break or light review task.',
    id: 'Energi kamu rendah. Coba istirahat singkat atau review ringan.',
  },
  recNoMatchDefault: {
    en: 'Try adjusting your available time or pick a lighter task.',
    id: 'Coba sesuaikan waktu yang tersedia atau pilih tugas yang lebih ringan.',
  },
  recWorkOn: {
    en: (title: string, min: number) => `Work on "${title}" for ~${min} minutes.`,
    id: (title: string, min: number) => `Kerjakan "${title}" selama ~${min} menit.`,
  },
  recStartWith: {
    en: (title: string, min: number) => `Start with "${title}" (~${min} min).`,
    id: (title: string, min: number) => `Mulai dari "${title}" (~${min} mnt).`,
  },
  recWorkOnTask: {
    en: (title: string, min: number) => `Work on "${title}" for ${min} minutes.`,
    id: (title: string, min: number) => `Kerjakan "${title}" selama ${min} menit.`,
  },
  recReasonDueSoon: { en: 'This is due very soon.', id: 'Deadline sudah sangat dekat.' },
  recReasonDeadline2d: { en: 'Deadline approaching in 2 days.', id: 'Deadline tinggal 2 hari lagi.' },
  recReasonLowEnergyMatch: {
    en: (diff: string) => `This is a ${diff} task — good for low energy.`,
    id: (diff: string) => `Ini tugas ${diff} — cocok untuk energi rendah.`,
  },
  recReasonHighEnergy: {
    en: 'Your energy is high — tackle this challenging task now.',
    id: 'Energi kamu tinggi — kerjakan tugas berat ini sekarang.',
  },
  recReasonKeepShort: {
    en: 'Keep sessions short. Take breaks between tasks.',
    id: 'Jaga sesi tetap pendek. Istirahat di antara tugas.',
  },
  recReasonHighImpact: {
    en: 'High academic impact — this moves the needle.',
    id: 'Dampak akademik tinggi — ini sangat berpengaruh.',
  },
  recReasonDefault: {
    en: 'This is your highest-priority actionable task right now.',
    id: 'Ini tugas prioritas tertinggi yang bisa kamu kerjakan sekarang.',
  },

  // ─── Priority Engine ───
  diffEasy: { en: 'Easy', id: 'Mudah' },
  diffModerate: { en: 'Moderate', id: 'Sedang' },
  diffMedium: { en: 'Medium', id: 'Menengah' },
  diffHard: { en: 'Hard', id: 'Sulit' },
  diffVeryHard: { en: 'Very Hard', id: 'Sangat Sulit' },

  urgNoDeadline: { en: 'No deadline', id: 'Tanpa deadline' },
  urgOverdue: { en: 'Overdue', id: 'Terlambat' },
  urgDueToday: { en: 'Due today', id: 'Hari ini' },
  urgDueTomorrow: { en: 'Due tomorrow', id: 'Besok' },
  urgDaysLeft: {
    en: (d: number) => `${d}d left`,
    id: (d: number) => `${d}h lagi`,
  },

  // ─── Burnout Engine ───
  burnoutHealthy: { en: 'Healthy', id: 'Sehat' },
  burnoutModerate: { en: 'Moderate', id: 'Sedang' },
  burnoutHigh: { en: 'High Risk', id: 'Risiko Tinggi' },
  burnoutCritical: { en: 'Critical', id: 'Kritis' },

  burnoutAdviceLow: {
    en: "You're in a good zone. Keep maintaining balance.",
    id: 'Kamu dalam kondisi baik. Terus jaga keseimbangan.',
  },
  burnoutAdviceModerate: {
    en: 'Workload is building up. Watch your breaks and sleep.',
    id: 'Beban kerja mulai menumpuk. Perhatikan istirahat dan tidurmu.',
  },
  burnoutAdviceHigh: {
    en: 'Consider reducing tasks today. Prioritize rest and essentials only.',
    id: 'Kurangi tugas hari ini. Prioritaskan istirahat dan yang penting saja.',
  },
  burnoutAdviceCritical: {
    en: 'Stop and recover. Postpone non-urgent tasks. Sleep is your priority.',
    id: 'Berhenti dan pulihkan diri. Tunda tugas tidak mendesak. Tidur adalah prioritasmu.',
  },

  // ─── Tasks Page ───
  taskInbox: { en: 'Task Inbox', id: 'Kotak Tugas' },
  active: { en: 'active', id: 'aktif' },
  completed: { en: 'completed', id: 'selesai' },
  addTask: { en: '+ Add Task', id: '+ Tambah Tugas' },
  cancel: { en: 'Cancel', id: 'Batal' },
  filterAll: { en: 'All', id: 'Semua' },
  filterPending: { en: 'Pending', id: 'Tertunda' },
  filterActive: { en: 'Active', id: 'Aktif' },
  filterDone: { en: 'Done', id: 'Selesai' },

  overplanWarningTitle: { en: '⚠️ Focus limit reached.', id: '⚠️ Batas fokus tercapai.' },
  overplanWarningMsg: {
    en: 'You already have 3 focus tasks today. Complete one before adding more.',
    id: 'Kamu sudah punya 3 tugas fokus hari ini. Selesaikan satu sebelum menambah.',
  },

  noTasksHere: { en: 'No tasks here.', id: 'Tidak ada tugas di sini.' },
  tryDifferentFilter: { en: 'Try a different filter.', id: 'Coba filter lain.' },
  addFirstTask: { en: 'Add your first task!', id: 'Tambah tugas pertamamu!' },

  subtasksLabel: { en: 'Subtasks', id: 'Sub-tugas' },
  focused: { en: '🎯 Focused', id: '🎯 Fokus' },
  focusToday: { en: '☐ Focus Today', id: '☐ Fokus Hari Ini' },
  aiBreakdown: { en: '🤖 AI Breakdown', id: '🤖 Pecah Tugas AI' },
  breakingDown: { en: '⏳ Breaking down...', id: '⏳ Memecah tugas...' },
  start: { en: '▶ Start', id: '▶ Mulai' },
  delete: { en: 'Delete', id: 'Hapus' },
  steps: { en: 'steps', id: 'langkah' },

  // Task form
  formPlaceholderTitle: { en: 'What do you need to do?', id: 'Apa yang perlu kamu kerjakan?' },
  formPlaceholderDetails: { en: 'Details (optional)', id: 'Detail (opsional)' },
  formCourse: { en: 'Course', id: 'Mata Kuliah' },
  formDeadline: { en: 'Deadline', id: 'Deadline' },
  formDifficulty: { en: 'Difficulty (1-5)', id: 'Kesulitan (1-5)' },
  formImpact: { en: 'Impact (1-5)', id: 'Dampak (1-5)' },
  formDuration: { en: 'Est. duration', id: 'Est. durasi' },
  formNone: { en: 'None', id: 'Tidak ada' },
  formAddTask: { en: 'Add Task', id: 'Tambah Tugas' },

  // ─── Burnout / Wellness Page ───
  wellnessCheck: { en: 'Wellness Check', id: 'Cek Kesehatan' },
  wellnessSubtitle: {
    en: 'Monitor your workload and prevent burnout.',
    id: 'Pantau beban kerja dan cegah burnout.',
  },
  currentBurnoutRisk: { en: 'Current Burnout Risk', id: 'Risiko Burnout Saat Ini' },

  statOverdue: { en: 'Overdue', id: 'Terlambat' },
  statDueIn48h: { en: 'Due in 48h', id: 'Deadline 48j' },
  statAvgStudy: { en: 'Avg Study', id: 'Rata-rata Belajar' },
  statAvgSleep: { en: 'Avg Sleep', id: 'Rata-rata Tidur' },
  statTasks: { en: 'tasks', id: 'tugas' },
  statHrsDay: { en: 'hrs/day', id: 'jam/hari' },
  statHrsNight: { en: 'hrs/night', id: 'jam/malam' },

  weeklyHeatmap: { en: 'Weekly Burnout Heatmap', id: 'Peta Burnout Mingguan' },
  heatmapLow: { en: 'Low', id: 'Rendah' },
  heatmapCritical: { en: 'Critical', id: 'Kritis' },
  study: { en: 'study', id: 'belajar' },

  dailyStudyHours: { en: 'Daily Study Hours', id: 'Jam Belajar Harian' },
  studyRecommendation: {
    en: 'Recommended: 4-6 hours/day · Current week avg shown',
    id: 'Rekomendasi: 4-6 jam/hari · Rata-rata minggu ini',
  },

  sleepPattern: { en: 'Sleep Pattern', id: 'Pola Tidur' },
  sleepDebtWarning: {
    en: "⚠️ You've had sleep debt most of this week. Prioritize rest.",
    id: '⚠️ Kamu kurang tidur hampir sepanjang minggu ini. Utamakan istirahat.',
  },
  sleepOk: {
    en: '✓ Sleep pattern looks reasonable. Keep it up.',
    id: '✓ Pola tidur cukup baik. Pertahankan!',
  },

  suggestions: { en: '💡 Suggestions', id: '💡 Saran' },
  sugOverdue: {
    en: (n: number) => `You have ${n} overdue task${n > 1 ? 's' : ''}. Address the most impactful one first.`,
    id: (n: number) => `Kamu punya ${n} tugas terlambat. Kerjakan yang paling berdampak dulu.`,
  },
  sugSleepShort: {
    en: 'Last night was short. Avoid hard tasks until you recover.',
    id: 'Tidur semalam kurang. Hindari tugas berat sampai pulih.',
  },
  sugNoStudy: {
    en: "Consider a no-study evening tonight. Recovery improves tomorrow's output.",
    id: 'Coba malam ini tanpa belajar. Pemulihan meningkatkan produktivitas besok.',
  },
  sugFocusTasks: {
    en: 'Stick to your 3 focus tasks. Doing less, well, beats doing more, poorly.',
    id: 'Tetap di 3 tugas fokus. Sedikit tapi tuntas lebih baik dari banyak tapi berantakan.',
  },

  // ─── Day names ───
  dayMon: { en: 'Mon', id: 'Sen' },
  dayTue: { en: 'Tue', id: 'Sel' },
  dayWed: { en: 'Wed', id: 'Rab' },
  dayThu: { en: 'Thu', id: 'Kam' },
  dayFri: { en: 'Fri', id: 'Jum' },
  daySat: { en: 'Sat', id: 'Sab' },
  daySun: { en: 'Sun', id: 'Min' },

  sleep: { en: 'Sleep', id: 'Tidur' },
  overdue: { en: 'Overdue', id: 'Terlambat' },
} as const;

// Type for translation keys
export type TranslationKey = keyof typeof translations;

// Get translated string
export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  const val = entry[locale];
  if (typeof val === 'function') return '';
  return val as string;
}

// Get translated function (for parameterized strings)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tf<T extends (...args: any[]) => string>(
  key: TranslationKey,
  locale: Locale
): T {
  const entry = translations[key];
  if (!entry) return (() => key) as unknown as T;
  const val = entry[locale];
  if (typeof val === 'function') return val as unknown as T;
  return (() => val as string) as unknown as T;
}

// Translate day abbreviation
const dayMap: Record<string, TranslationKey> = {
  Mon: 'dayMon', Tue: 'dayTue', Wed: 'dayWed', Thu: 'dayThu',
  Fri: 'dayFri', Sat: 'daySat', Sun: 'daySun',
};

export function translateDay(day: string, locale: Locale): string {
  const key = dayMap[day];
  return key ? t(key, locale) : day;
}
