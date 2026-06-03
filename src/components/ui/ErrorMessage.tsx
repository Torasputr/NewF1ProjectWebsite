type ErrorMessageProps = {
  title?: string;
  message: string;
};

export function ErrorMessage({
  title = "Something went wrong",
  message,
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-red-200">
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
}
