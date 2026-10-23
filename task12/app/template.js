// Next.js remounts templates on route changes; the provider in layout stays mounted.
export default function Template({ children }) {
  return <div className="route-content">{children}</div>;
}
