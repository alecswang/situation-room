import { ReactNode } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RoomFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RoomForm({ value, onChange, onSubmit }: RoomFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
          Create New Room
        </label>
        <Input
          id="roomName"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter room name"
          required
          role="activist"
        />
      </div>
      <Button type="submit" variant="primary">
        Create Room
      </Button>
    </form>
  );
}