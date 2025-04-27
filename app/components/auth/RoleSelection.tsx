import Button from '../ui/Button';

interface RoleSelectionProps {
  onSelectRole: (role: 'activist' | 'journalist') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-6">Select your role</h2>
      <div className="space-y-4">
        <Button
          onClick={() => onSelectRole('activist')}
          className="w-full"
          variant="primary"
        >
          Activist
        </Button>
        <Button
          onClick={() => onSelectRole('journalist')}
          className="w-full"
          variant="secondary"
        >
          Journalist
        </Button>
      </div>
    </div>
  );
}