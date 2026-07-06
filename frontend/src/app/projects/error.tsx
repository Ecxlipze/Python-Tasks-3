"use client";
type ErrorPageProps = {
  error: Error;
  reset: () => void;
};
export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <main>
      <h1>Something went wrong!</h1>

      <p>{error.message}</p>

      <button onClick={reset}>
        Try Again
      </button>
    </main>
  );
}