'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'daily_todo_v1'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function formatDate() {
  const d = new Date()
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function CheckIcon() {
  return (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
      <polyline points="1,3.5 3.5,6 9,1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <line x1="2" y1="3.5" x2="11" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M4.5 3.5V2.5C4.5 2 5 1.5 6.5 1.5C8 1.5 8.5 2 8.5 2.5V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3.5 3.5L4 10.5C4 11 4.5 11.5 5 11.5H8C8.5 11.5 9 11 9 10.5L9.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function TodoApp() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmClosing, setConfirmClosing] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.tasks) {
          setTasks(parsed.tasks)
        } else if (Array.isArray(parsed)) {
          setTasks(parsed)
        }
      }
    } catch {}
    setMounted(true)
  }, [])

  const save = useCallback((newTasks) => {
    try {
      const data = {
        tasks: newTasks
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [])

  const addTask = () => {
    const text = input.trim()
    if (!text) return
    const newTasks = [...tasks, { id: uid(), text, done: false }]
    setTasks(newTasks)
    save(newTasks)
    setInput('')
  }

  const toggleTask = (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(newTasks)
    save(newTasks)
  }

  const deleteTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id)
    setTasks(newTasks)
    save(newTasks)
  }

  const handleReset = () => {
    setShowConfirm(true)
    setConfirmClosing(false)
  }

  const confirmReset = () => {
    setTasks([])
    save([])
    closeConfirm()
  }

  const closeConfirm = () => {
    setConfirmClosing(true)
    setTimeout(() => {
      setShowConfirm(false)
      setConfirmClosing(false)
    }, 220)
  }

  const done = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const s = {
    wrap: {
      width: '100%',
      maxWidth: 480,
      padding: '2.5rem 1.5rem 4rem',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '2.25rem',
    },
    dateLabel: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--ink2)',
      marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 300,
      color: 'var(--ink)',
      letterSpacing: '-0.025em',
      lineHeight: 1.15,
    },
    progressTrack: {
      marginTop: 20,
      height: 1.5,
      background: 'var(--line)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      width: `${pct}%`,
      background: 'var(--ink)',
      borderRadius: 2,
      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    progressLabel: {
      marginTop: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink2)',
      letterSpacing: '0.04em',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: '1.75rem',
      borderBottom: '1px solid var(--line2)',
      paddingBottom: 10,
    },
    taskInput: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: 14,
      fontWeight: 300,
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink)',
      padding: '4px 0',
    },
    addBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink)',
      fontSize: 22,
      lineHeight: 1,
      fontWeight: 300,
      padding: '0 2px',
      opacity: 0.35,
      transition: 'opacity 0.15s',
      flexShrink: 0,
    },
    taskList: {
      listStyle: 'none',
    },
    taskItem: (isHovered) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 13,
      padding: '12px 0',
      borderBottom: '1px solid var(--line)',
      animation: 'fadeSlideIn 0.2s ease',
      position: 'relative',
    }),
    checkbox: (isDone) => ({
      width: 17,
      height: 17,
      borderRadius: 3,
      border: `1px solid ${isDone ? 'var(--ink)' : 'var(--ink3)'}`,
      background: isDone ? 'var(--ink)' : 'transparent',
      cursor: 'pointer',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--bg)',
      transition: 'all 0.15s',
      animation: isDone ? 'checkPop 0.2s ease' : 'none',
    }),
    taskTextWrap: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    taskText: (isDone) => ({
      fontSize: 14,
      fontWeight: 300,
      color: isDone ? 'var(--ink3)' : 'var(--ink)',
      transition: 'color 0.2s',
      display: 'block',
    }),
    deleteBtn: (isHovered) => ({
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink3)',
      display: 'flex',
      alignItems: 'center',
      padding: '3px 3px',
      opacity: isHovered ? 1 : 0,
      transition: 'opacity 0.15s, color 0.15s',
      flexShrink: 0,
    }),
    emptyState: {
      textAlign: 'center',
      padding: '3rem 0',
      color: 'var(--ink3)',
      fontSize: 13,
      fontWeight: 300,
      lineHeight: 1.7,
    },
    footer: {
      marginTop: '1.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskCount: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink2)',
      letterSpacing: '0.04em',
    },
    resetBtn: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink3)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0',
      transition: 'color 0.2s',
    },
    toastOverlay: {
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--toast-bg)',
      color: 'var(--toast-text)',
      borderRadius: 8,
      padding: '11px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      fontSize: 12,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em',
      animation: confirmClosing ? 'toastOut 0.22s ease forwards' : 'toastIn 0.22s ease forwards',
      zIndex: 100,
      whiteSpace: 'nowrap',
    },
    toastYes: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--red)',
      fontWeight: 500,
      letterSpacing: '0.04em',
      padding: 0,
    },
    toastNo: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--toast-text)',
      opacity: 0.5,
      letterSpacing: '0.04em',
      padding: 0,
      transition: 'opacity 0.15s',
    },
  }

  if (!mounted) return null

  return (
    <>
      <div style={s.wrap}>
        <div style={s.header}>
          <div style={s.dateLabel}>{formatDate()}</div>
          <h1 style={s.title}>Hari ini</h1>
          <div style={s.progressTrack}>
            <div style={s.progressFill} />
          </div>
          <div style={s.progressLabel}>{done} dari {total} selesai</div>
        </div>

        <div style={s.inputRow}>
          <input
            ref={inputRef}
            style={s.taskInput}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Tambah task baru..."
            maxLength={120}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            style={s.addBtn}
            onClick={addTask}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.35}
            title="Tambah task"
          >
            +
          </button>
        </div>

        <ul style={s.taskList}>
          {tasks.map(task => (
            <li
              key={task.id}
              style={s.taskItem(hoveredId === task.id)}
              onMouseEnter={() => setHoveredId(task.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={s.checkbox(task.done)}
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked={task.done}
                tabIndex={0}
                onKeyDown={e => e.key === ' ' && toggleTask(task.id)}
              >
                {task.done && <CheckIcon />}
              </div>
              <div style={s.taskTextWrap}>
                <span style={s.taskText(task.done)}>{task.text}</span>
              </div>
              <button
                style={s.deleteBtn(hoveredId === task.id)}
                onClick={() => deleteTask(task.id)}
                title="Hapus task"
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>

        {total === 0 && (
          <div style={s.emptyState}>
            Belum ada task hari ini.<br />
            Mulai dari satu hal kecil.
          </div>
        )}

        <div style={s.footer}>
          <span style={s.taskCount}>
            {total > 0 ? `${total} task` : ''}
          </span>
          <button
            style={s.resetBtn}
            onClick={handleReset}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
          >
            Reset hari ini
          </button>
        </div>
      </div>

      {showConfirm && (
        <div style={s.toastOverlay}>
          <span>Hapus semua task?</span>
          <button style={s.toastYes} onClick={confirmReset}>Ya, reset</button>
          <button
            style={s.toastNo}
            onClick={closeConfirm}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
          >
            Batal
          </button>
        </div>
      )}
    </>
  )
}
