import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const ClerkSigned = () => {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <button className="dark:text-sky-300 dark:hover:bg-gray-800 dark:border-sky-400 dark:hover:border-sky-300 dark:hover:text-sky-100
            text-sky-500 hover:bg-sky-100 border-sky-300 hover:text-sky-600
            border-2 cursor-pointer h-8 pr-2 pl-2 min-w-20 rounded-full">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="dark:text-sky-300 dark:hover:bg-gray-800 dark:border-sky-400 dark:hover:border-sky-300 dark:hover:text-sky-100
            text-sky-500 hover:bg-sky-100 border-sky-300 hover:text-sky-600
            border-2 cursor-pointer h-8 pr-2 pl-2 min-w-20 rounded-full">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
};

export { ClerkSigned };