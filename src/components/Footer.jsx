export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-text">© {year} Nespresso Demo • Crafted with React & Vite.</p>
    </footer>
  );
}
