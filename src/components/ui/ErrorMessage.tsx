type ErrorMessageProps = { message: string };

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-red-200">
      <p className="font-medium">Could not load schedule</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
