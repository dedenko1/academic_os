'use client';

import { useAppStore } from '@/stores/useAppStore';
import { getCourseCode, getCourseColor } from '@/lib/mock-data';
import { getDifficultyLabel, getUrgencyLabel } from '@/lib/priority-engine';
import { t } from '@/lib/i18n';
import { colorClass } from '@/lib/color-map';
import { Task, Difficulty, Impact, Course } from '@/types';
import { useState } from 'react';

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'done';

export function TasksPage() {
  const { tasks, courses, addTask, updateTaskStatus, deleteTask, toggleFocusTask, toggleSubtask, addSubtasksToTask, locale } = useAppStore();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [overplanWarning, setOverplanWarning] = useState(false);
  const [breakdownTaskId, setBreakdownTaskId] = useState<string | null>(null);
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const pendingCount = tasks.filter(t => t.status !== 'done').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  const handleToggleFocus = (taskId: string) => {
    const success = toggleFocusTask(taskId);
    if (!success) {
      setOverplanWarning(true);
      setTimeout(() => setOverplanWarning(false), 3000);
    }
  };

  const handleAIBreakdown = async (taskId: string) => {
    setBreakdownTaskId(taskId);
    setIsBreakingDown(true);
    await new Promise(r => setTimeout(r, 1500));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const mockSubtasks = generateMockBreakdown(task, locale);
      addSubtasksToTask(taskId, mockSubtasks);
    }
    setIsBreakingDown(false);
    setBreakdownTaskId(null);
    setExpandedTask(taskId);
  };

  const filterLabels: Record<FilterStatus, string> = {
    all: t('filterAll', locale),
    pending: t('filterPending', locale),
    in_progress: t('filterActive', locale),
    done: t('filterDone', locale),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('taskInbox', locale)}</h2>
          <p className="text-sm text-muted mt-0.5">{pendingCount} {t('active', locale)} · {doneCount} {t('completed', locale)}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium
            hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm shadow-accent/20"
        >
          {showForm ? t('cancel', locale) : t('addTask', locale)}
        </button>
      </div>

      {/* Anti-Overplanning Warning */}
      {overplanWarning && (
        <div className="p-3 rounded-xl bg-warning-soft border border-warning/20 text-sm animate-fade-in-scale">
          <span className="font-medium">{t('overplanWarningTitle', locale)}</span>{' '}
          {t('overplanWarningMsg', locale)}
        </div>
      )}

      {/* Add Task Form */}
      {showForm && <TaskForm courses={courses} locale={locale} onAdd={(task) => { addTask(task); setShowForm(false); }} />}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in_progress', 'done'] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-accent text-white'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 stagger-children">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            locale={locale}
            isExpanded={expandedTask === task.id}
            onToggleExpand={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            onStatusChange={updateTaskStatus}
            onDelete={deleteTask}
            onToggleFocus={() => handleToggleFocus(task.id)}
            onToggleSubtask={(subtaskId) => toggleSubtask(task.id, subtaskId)}
            onAIBreakdown={() => handleAIBreakdown(task.id)}
            isBreakingDown={isBreakingDown && breakdownTaskId === task.id}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">{t('noTasksHere', locale)} {filter !== 'all' ? t('tryDifferentFilter', locale) : t('addFirstTask', locale)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task, locale, isExpanded, onToggleExpand, onStatusChange, onDelete, onToggleFocus,
  onToggleSubtask, onAIBreakdown, isBreakingDown,
}: {
  task: Task;
  locale: 'en' | 'id';
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onToggleFocus: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onAIBreakdown: () => void;
  isBreakingDown: boolean;
}) {
  const urgency = getUrgencyLabel(task, locale);
  const courseColor = getCourseColor(task.courseId);
  const completedSubtasks = task.subtasks.filter(s => s.status === 'done').length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        task.status === 'done'
          ? 'bg-surface/50 border-border opacity-60'
          : 'bg-surface border-border hover:border-accent/30 hover:shadow-sm'
      }`}
    >
      {/* Main row */}
      <div className="p-4 flex items-start gap-3 cursor-pointer" onClick={onToggleExpand}>
        {/* Status checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, task.status === 'done' ? 'pending' : 'done');
          }}
          className={`w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            task.status === 'done'
              ? 'bg-success border-success text-white'
              : 'border-border hover:border-accent'
          }`}
        >
          {task.status === 'done' && <span className="text-xs">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through' : ''}`}>
              {task.title}
            </p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-soft text-accent font-mono flex-shrink-0">
              {task.priorityScore.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: courseColor + '18', color: courseColor }}
            >
              {getCourseCode(task.courseId)}
            </span>
            <span className="text-[10px] text-muted">
              {task.estimatedMinutes}m · {getDifficultyLabel(task.difficulty, locale)}
            </span>
            <span className={`text-[10px] font-medium ${colorClass('text', urgency.color)}`}>
              {urgency.label}
            </span>
            {task.isFocusTask && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-soft text-accent font-medium">
                {t('focused', locale)}
              </span>
            )}
            {totalSubtasks > 0 && (
              <span className="text-[10px] text-muted">
                {completedSubtasks}/{totalSubtasks} {t('steps', locale)}
              </span>
            )}
          </div>
        </div>

        <span className={`text-muted text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3 animate-fade-in">
          {task.description && (
            <p className="text-xs text-muted leading-relaxed">{task.description}</p>
          )}

          {task.subtasks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">{t('subtasksLabel', locale)}</p>
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
                  onClick={() => onToggleSubtask(st.id)}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                    st.status === 'done' ? 'bg-success border-success text-white' : 'border-border'
                  }`}>
                    {st.status === 'done' && '✓'}
                  </div>
                  <span className={`text-xs flex-1 ${st.status === 'done' ? 'line-through text-muted' : ''}`}>
                    {st.title}
                  </span>
                  <span className="text-[10px] text-muted">{st.estimatedMinutes}m</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onToggleFocus}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                task.isFocusTask
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border hover:border-accent text-muted hover:text-accent'
              }`}
            >
              {task.isFocusTask ? t('focused', locale) : t('focusToday', locale)}
            </button>
            {task.subtasks.length === 0 && task.status !== 'done' && (
              <button
                onClick={onAIBreakdown}
                disabled={isBreakingDown}
                className="text-xs px-3 py-1.5 rounded-lg font-medium bg-accent-soft text-accent
                  border border-accent/20 hover:bg-accent/10 transition-all disabled:opacity-50"
              >
                {isBreakingDown ? t('breakingDown', locale) : t('aiBreakdown', locale)}
              </button>
            )}
            {task.status !== 'done' && (
              <button
                onClick={() => onStatusChange(task.id, task.status === 'in_progress' ? 'pending' : 'in_progress')}
                className="text-xs px-3 py-1.5 rounded-lg font-medium bg-surface border border-border hover:bg-surface-hover transition-all"
              >
                {task.status === 'in_progress' ? `⏸ ${t('pause', locale)}` : t('start', locale)}
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium text-danger hover:bg-danger-soft transition-all ml-auto"
            >
              {t('delete', locale)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskForm({ courses, locale, onAdd }: {
  courses: Course[];
  locale: 'en' | 'id';
  onAdd: (task: Parameters<ReturnType<typeof useAppStore.getState>['addTask']>[0]) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(3);
  const [impact, setImpact] = useState<Impact>(3);
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      courseId: courseId || null,
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      difficulty,
      estimatedMinutes,
      impact,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-surface border border-border space-y-4 animate-fade-in-scale">
      <input
        type="text"
        placeholder={t('formPlaceholderTitle', locale)}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
        autoFocus
      />
      <textarea
        placeholder={t('formPlaceholderDetails', locale)}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all resize-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted block mb-1">{t('formCourse', locale)}</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm
              focus:outline-none focus:border-accent transition-all"
          >
            <option value="">{t('formNone', locale)}</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">{t('formDeadline', locale)}</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm
              focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">{t('formDifficulty', locale)}</label>
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5] as Difficulty[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  difficulty === d ? 'bg-accent text-white' : 'bg-background border border-border hover:border-accent'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">{t('formImpact', locale)}</label>
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5] as Impact[]).map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setImpact(i)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  impact === i ? 'bg-sage text-white' : 'bg-background border border-border hover:border-sage'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted block mb-1">{t('formDuration', locale)}: {estimatedMinutes}m</label>
        <input
          type="range"
          min="15"
          max="240"
          step="15"
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </div>
      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full py-2.5 bg-accent text-white rounded-xl font-medium text-sm
          hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
      >
        {t('formAddTask', locale)}
      </button>
    </form>
  );
}

function generateMockBreakdown(task: Task, locale: string) {
  const isId = locale === 'id';
  const breakdowns = [
    { title: isId ? `Baca dan pahami persyaratan ${task.title}` : `Read and understand the ${task.title} requirements`, estimatedMinutes: 20 },
    { title: isId ? 'Buat outline atau rencana pendekatan' : 'Create an outline or plan of approach', estimatedMinutes: 25 },
    { title: isId ? 'Kerjakan bagian atau komponen utama pertama' : 'Work on the first major section or component', estimatedMinutes: 45 },
    { title: isId ? 'Review, perbaiki, dan finalisasi' : 'Review, refine, and finalize', estimatedMinutes: 30 },
  ];

  return breakdowns.map((s, i) => ({
    ...s,
    sortOrder: i,
  }));
}
