import Logo from "./Logo";

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-5 pt-8">
      <Logo />
      <h1 className="text-lg font-bold tracking-tight text-white">
        <span>Let Football </span>
        <span className="text-pitch-500">Flow</span>
      </h1>
    </header>
  );
}
