import Link from "next/link";

export const NotLoggedInContent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">Welcome to the app!</h1>
      <p className="mt-4 text-lg text-center">Sign in to access the app's features.</p>
      <div className="mt-8">
        <Link href="/auth/sign-in">
          <a className="btn btn-primary">Sign in</a>
        </Link>
      </div>
    </div>
  );
};
