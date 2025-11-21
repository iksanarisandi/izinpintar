import React, { useState } from 'react';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_TEMPLATES } from '../types';

interface TemplateEditorProps {
  templates: Record<string, string>;
  setTemplates: (templates: Record<string, string>) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ templates, setTemplates }) => {
  const [selectedType, setSelectedType] = useState<string>(Object.keys(templates)[0]);
  const [editedContent, setEditedContent] = useState(templates[selectedType]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTypeChange = (type: string) => {
    if (hasChanges) {
      if (!window.confirm('Ada perubahan yang belum disimpan. Lanjutkan?')) {
        return;
      }
    }
    setSelectedType(type);
    setEditedContent(templates[type]);
    setHasChanges(false);
  };

  const handleContentChange = (content: string) => {
    setEditedContent(content);
    setHasChanges(content !== templates[selectedType]);
  };

  const handleSave = () => {
    setTemplates({
      ...templates,
      [selectedType]: editedContent
    });
    setHasChanges(false);
    alert('Template berhasil disimpan!');
  };

  const handleReset = () => {
    if (window.confirm('Reset template ke default?')) {
      const defaultContent = DEFAULT_TEMPLATES[selectedType] || '';
      setEditedContent(defaultContent);
      setTemplates({
        ...templates,
        [selectedType]: defaultContent
      });
      setHasChanges(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editor Template</h2>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Template Type Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(templates).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Template Editor */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900 dark:text-white">Template: {selectedType}</span>
              {hasChanges && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                  Belum disimpan
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                <Save size={16} />
                <span>Simpan</span>
              </button>
            </div>
          </div>

          <textarea
            value={editedContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none"
            placeholder="Tulis template di sini..."
            spellCheck={false}
          />
        </div>

        {/* Variable Help */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">📝 Variabel yang tersedia:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-400">
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{nama}}'}</code> - Nama</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{unit}}'}</code> - Unit/Bagian</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{date}}'}</code> - Tanggal</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{dayName}}'}</code> - Nama Hari</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{reason}}'}</code> - Alasan Izin</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{schedule}}'}</code> - Jadwal</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{jabatanStruktural}}'}</code> - Jabatan</div>
            <div><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">{'{{timeGreeting}}'}</code> - Salam Waktu</div>
          </div>
        </div>
      </div>
    </div>
  );
};
