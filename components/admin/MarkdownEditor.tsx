'use client';

import { useState, useRef } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
}

// Custom icons for markdown toolbar
const HeadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 12h8M4 6v12M12 6v12M17 12l3-3m0 0l3 3m-3-3v9" />
  </svg>
);

const LinkIconCustom = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const EmojiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const commonEmojis = ['✈️', '🛩️', '🏝️', '🌴', '🌊', '☀️', '🌅', '🐠', '🐬', '🦈', '🐢', '🦜', '⭐', '✨', '🎉', '❤️', '🔥', '💎', '🏆', '👑'];

export default function MarkdownEditor({
  value,
  onChange,
  label,
  description,
  placeholder = 'Escribe aquí...',
  rows = 6,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => insertText('**', '**', 'texto en negrita');
  const handleItalic = () => insertText('*', '*', 'texto en cursiva');
  const handleHeading = () => insertText('\n## ', '\n', 'Título');
  const handleList = () => insertText('\n- ', '', 'elemento de lista');
  const handleLink = () => insertText('[', '](url)', 'texto del enlace');

  const handleEmoji = (emoji: string) => {
    insertAtCursor(emoji);
    setShowEmojiPicker(false);
  };

  const toolbarButtons = [
    { icon: <BoldIcon className="w-4 h-4" />, action: handleBold, title: 'Negrita (Ctrl+B)' },
    { icon: <ItalicIcon className="w-4 h-4" />, action: handleItalic, title: 'Cursiva (Ctrl+I)' },
    { icon: <HeadingIcon />, action: handleHeading, title: 'Título' },
    { icon: <ListBulletIcon className="w-4 h-4" />, action: handleList, title: 'Lista' },
    { icon: <LinkIconCustom />, action: handleLink, title: 'Enlace' },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-navy-300">{label}</label>
      )}
      {description && (
        <p className="text-xs text-navy-500">{description}</p>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-navy-800 border border-navy-700 rounded-t-lg border-b-0">
        {toolbarButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={btn.action}
            className="p-1.5 text-navy-400 hover:text-white hover:bg-navy-700 rounded transition-colors"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-navy-700 mx-1" />

        {/* Emoji picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-1.5 rounded transition-colors ${
              showEmojiPicker
                ? 'text-brand-400 bg-navy-700'
                : 'text-navy-400 hover:text-white hover:bg-navy-700'
            }`}
            title="Emojis"
          >
            <EmojiIcon />
          </button>

          {showEmojiPicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="absolute top-full left-0 mt-1 p-2 bg-navy-800 border border-navy-700 rounded-lg shadow-xl z-20 w-64">
                <div className="grid grid-cols-10 gap-1">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmoji(emoji)}
                      className="p-1.5 text-lg hover:bg-navy-700 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help text */}
        <span className="ml-auto text-xs text-navy-500">
          Markdown soportado
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-b-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y font-mono text-sm"
        onKeyDown={(e) => {
          // Keyboard shortcuts
          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') {
              e.preventDefault();
              handleBold();
            } else if (e.key === 'i') {
              e.preventDefault();
              handleItalic();
            }
          }
        }}
      />

      {/* Preview hint */}
      <p className="text-xs text-navy-600">
        Usa **texto** para negrita, *texto* para cursiva, ## para títulos
      </p>
    </div>
  );
}
