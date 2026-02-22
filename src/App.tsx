import { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Circle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Calendar,
  LayoutDashboard,
  Settings,
  Search,
} from 'lucide-react';
import { initialProjects, initialCategories, initialTasks } from './data/seedData';
import { Project, Category, Task, TaskStatus, ProjectWithProgress } from './types/ceo';
import './index.css';

const projectColors: Record<string, { bg: string; bar: string; badge: string }> = {
  pink: { bg: 'bg-pink-50', bar: 'bg-pink-500', badge: 'bg-pink-100 text-pink-700' },
  green: { bg: 'bg-green-50', bar: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  amber: { bg: 'bg-amber-50', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  purple: { bg: 'bg-purple-50', bar: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
  blue: { bg: 'bg-blue-50', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  yellow: { bg: 'bg-yellow-50', bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
  teal: { bg: 'bg-teal-50', bar: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700' },
};

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  todo: <Circle className="w-4 h-4 text-gray-300 hover:text-gray-400" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  done: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  blocked: <AlertCircle className="w-4 h-4 text-red-500" />,
};

function App() {
  const [projects] = useState<Project[]>(initialProjects);
  const [categories] = useState<Category[]>(initialCategories);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(['spring-collection', 'finance', 'creatives'])
  );
  const [view, setView] = useState<'dashboard' | 'calendar'>('dashboard');

  const projectsWithProgress: ProjectWithProgress[] = useMemo(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(t => t.project_id === project.id);
      const completedTasks = projectTasks.filter(t => t.status === 'done').length;
      const totalTasks = projectTasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const projectCategories = categories
        .filter(c => c.project_id === project.id)
        .sort((a, b) => a.order - b.order)
        .map(cat => ({
          ...cat,
          tasks: tasks.filter(t => t.category_id === cat.id).sort((a, b) => a.order - b.order),
        }));
      
      return { ...project, total_tasks: totalTasks, completed_tasks: completedTasks, progress, categories: projectCategories };
    });
  }, [projects, categories, tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done', updated_at: new Date().toISOString() }
        : task
    ));
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      next.has(projectId) ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.due_date === todayStr && t.status !== 'done');
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦫</span>
            <span className="font-bold text-lg text-gray-900">CEO Command</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'calendar' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          
          <div className="pt-4 pb-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">Projects</div>
          </div>
          
          {projectsWithProgress.map(p => (
            <button
              key={p.id}
              onClick={() => toggleProject(p.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                expandedProjects.has(p.id) ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <span>{p.emoji}</span>
              <span className="flex-1 text-left truncate text-gray-700">{p.name}</span>
              <span className="text-xs text-gray-400">{p.progress}%</span>
            </button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>
      
      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {view === 'dashboard' ? 'Dashboard' : 'Calendar'}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {view === 'dashboard' && (
            <div className="space-y-6 max-w-5xl">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Total Tasks</div>
                  <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'done').length}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">High Priority</div>
                  <div className="text-2xl font-bold text-red-600">{highPriorityTasks.length}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Due Today</div>
                  <div className="text-2xl font-bold text-blue-600">{todayTasks.length}</div>
                </div>
              </div>
              
              {/* Today's Focus */}
              {(todayTasks.length > 0 || highPriorityTasks.length > 0) && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold text-gray-900 mb-3">📌 Today's Focus</h2>
                  <div className="space-y-1">
                    {[...todayTasks, ...highPriorityTasks.filter(t => !todayTasks.some(tt => tt.id === t.id))].slice(0, 5).map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      >
                        <div className="transition-transform group-hover:scale-110">{statusIcons[task.status]}</div>
                        <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Projects */}
              <div className="space-y-4">
                {projectsWithProgress.map(project => (
                  <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div
                      onClick={() => toggleProject(project.id)}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {expandedProjects.has(project.id) 
                        ? <ChevronDown className="w-5 h-5 text-gray-400" />
                        : <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                      <span className="text-xl">{project.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.completed_tasks} / {project.total_tasks} tasks</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${projectColors[project.color]?.bar || 'bg-gray-500'} transition-all`} style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 w-10 text-right">{project.progress}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityStyles[project.priority]}`}>{project.priority}</span>
                      </div>
                    </div>
                    
                    {expandedProjects.has(project.id) && (
                      <div className="border-t border-gray-100">
                        {project.categories.map(cat => (
                          <div key={cat.id} className="border-b border-gray-50 last:border-b-0">
                            <div className="px-4 py-2 bg-gray-50/50 flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-600">{cat.name}</span>
                              <span className="text-xs text-gray-400">({cat.tasks.length})</span>
                            </div>
                            <div className="px-4 py-1">
                              {cat.tasks.map(task => (
                                <div
                                  key={task.id}
                                  onClick={() => toggleTask(task.id)}
                                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-gray-50 cursor-pointer group"
                                >
                                  <div className="transition-transform group-hover:scale-110">{statusIcons[task.status]}</div>
                                  <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {task.title}
                                  </span>
                                  {task.assignee && <span className="text-xs text-gray-400">{task.assignee}</span>}
                                  {task.due_date && <span className="text-xs text-blue-600">{task.due_date.slice(5)}</span>}
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${priorityStyles[task.priority]}`}>
                                    {task.priority[0].toUpperCase()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {view === 'calendar' && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Calendar View Coming Soon</h2>
              <p className="text-gray-500">Time blocking and Google Calendar integration</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
