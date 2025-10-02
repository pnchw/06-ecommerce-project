export default function Container({ children }) {
  return (
    <div className="max-w-[1920px] mx-auto px-2 sm:px-4 md:px-8 lg:px-20">
      {children}
    </div>
  );
}
