import { DocIcon, ImageIcon, VideoIcon, AudioIcon } from '@/components/shared/icons';
import { cn } from '@/lib/utils';

type FileType = 'document' | 'image' | 'video' | 'audio' | 'unknown';

function getFileTypeFromName(name: string): FileType {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) return 'image';
  if (['mp4','mov','webm','mkv','avi'].includes(ext)) return 'video';
  if (['mp3','wav','ogg','flac','m4a'].includes(ext)) return 'audio';
  if (['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','md'].includes(ext)) return 'document';
  return 'unknown';
}

export function FileCard({ name, kind }: { name: string; kind?: "document" | "image" | "video" | "audio" | "unknown" }) {
  const type = kind ?? getFileTypeFromName(name);
  const icon = (
    type === 'image' ? <ImageIcon size={22} /> :
    type === 'video' ? <VideoIcon size={22} /> :
    type === 'audio' ? <AudioIcon size={22} /> :
    <DocIcon size={22} />
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate" title={name}>{name}</div>
        </div>
      </div>
    </div>
  );
}
